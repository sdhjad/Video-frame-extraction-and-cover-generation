/**
 * 桌面悬浮拖拽窗口
 * 在屏幕右下角显示一个半透明悬浮球，用户可将 MP4 文件拖入自动上传抽帧
 */
const { BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let dropZoneWin = null;
let mainWindow = null;
let apiBase = 'http://localhost:8080';

/** 创建悬浮拖拽窗口，注册 IPC 上传通道 */
function createDropZone(port, mw) {
  if (port) apiBase = `http://localhost:${port}`;
  if (mw) mainWindow = mw;

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  dropZoneWin = new BrowserWindow({
    width: 230,
    height: 245,
    x: width - 250,
    y: height - 265,
    frame: false,          // 无边框
    transparent: true,     // 透明背景，露出圆角
    resizable: false,
    skipTaskbar: true,     // 不在任务栏显示
    alwaysOnTop: true,     // 始终在最上层
    show: false,           // 初始隐藏，窗口最小化到托盘时才显示
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.resolve(__dirname, 'drop-zone-preload.js'),
    },
  });

  dropZoneWin.loadFile(path.resolve(__dirname, 'drop-zone.html'));

  function restoreMainWindow() {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.executeJavaScript(`
        if (sessionStorage.getItem('pendingJobId')) {
          window.dispatchEvent(new Event('pendingJobAvailable'));
        }
      `);
    }
    hideDropZone();
  }

  // 点击狗狗 → 回到主界面
  ipcMain.on('show-main-window', () => restoreMainWindow());

  // 抽帧完成后 React 通知 → 自动弹出主界面
  ipcMain.on('show-main-window-from-renderer', () => restoreMainWindow());

  // 注册 IPC 通道：渲染进程传来文件路径，主进程负责上传到后端
  ipcMain.handle('upload-video', async (_event, filePath) => {
    console.log('[drop-zone] 收到上传请求:', filePath);
    try {
      const result = await uploadAndCreateJob(filePath);
      console.log('[drop-zone] 上传成功:', result.id);
      // 把 job ID 写入 sessionStorage 并立即通知 React 开始轮询
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.executeJavaScript(`
          sessionStorage.setItem('pendingJobId', '${result.id}');
          window.dispatchEvent(new Event('pendingJobAvailable'));
        `);
      }
      return result;
    } catch (err) {
      console.error('[drop-zone] 上传失败:', err.message);
      throw err;
    }
  });
}

/** 显示悬浮窗（不抢占焦点） */
function showDropZone() {
  if (dropZoneWin) dropZoneWin.showInactive();
}

/** 隐藏悬浮窗 */
function hideDropZone() {
  if (dropZoneWin) dropZoneWin.hide();
}

/**
 * 将本地 MP4 文件上传到 Go 后端，触发抽帧任务
 * 使用 Node.js 内置 fetch + FormData 构造 multipart 请求
 */
async function uploadAndCreateJob(filePath) {
  const fileName = path.basename(filePath);

  // 仅允许 .mp4 后缀，避免意外上传非视频文件
  if (!fileName.toLowerCase().endsWith('.mp4')) {
    throw new Error('仅支持 MP4 视频文件');
  }

  let buffer;
  try {
    buffer = await fs.promises.readFile(filePath);
  } catch {
    throw new Error('无法读取文件: ' + fileName);
  }

  // 构造 multipart/form-data 请求体（与服务端 upload_handler.go 对齐）
  const formData = new FormData();
  const blob = new Blob([buffer], { type: 'video/mp4' });
  formData.append('video', blob, fileName);
  formData.append('fps', '1');     // 默认每秒1帧，与前端 UploadPanel 一致
  formData.append('format', 'jpg');

  const response = await fetch(`${apiBase}/api/jobs`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`后端返回 ${response.status}: ${text}`);
  }

  return await response.json();
}

module.exports = { createDropZone, showDropZone, hideDropZone };
