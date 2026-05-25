/**
 * 视频抽帧 — Electron 桌面端入口
 *
 * ┌──────────┐  ┌──────────┐  ┌────────────┐
 * │ 系统托盘  │  │  主窗口   │  │ 悬浮拖拽窗  │
 * │ tray.cjs  │  │window.cjs │  │drop-zone   │
 * └────┬─────┘  └────┬─────┘  └─────┬──────┘
 *      │             │              │
 *      └──────────┬──┘──────────────┘
 *                 │
 *          main.cjs (入口)
 *                 │
 *          backend.cjs
 *          Go API 服务
 *
 * 生命周期：
 *   关闭窗口 → 最小化到托盘 → 右下角出现悬浮拖拽球
 *   拖拽 MP4 到悬浮球 → 自动上传后端 → 开始抽帧
 */
const { app } = require('electron');
const { createMainWindow } = require('./window');
const { startBackend, stopBackend } = require('./backend');
const { createTray, isForceQuit } = require('./tray');
const { createDropZone, showDropZone, hideDropZone } = require('./drop-zone');

let mainWindow = null;

app.whenReady().then(() => {
  // 1. 启动 Go 后端，获取监听端口
  const port = startBackend();

  // 2. 创建前端主窗口
  mainWindow = createMainWindow();

  // 3. 创建系统托盘，恢复窗口时注入脚本加载拖拽任务（不刷新页面）
  createTray(mainWindow, {
    onShow: () => {
      hideDropZone();
      mainWindow.webContents.executeJavaScript(`
        if (sessionStorage.getItem('pendingJobId')) {
          window.dispatchEvent(new Event('pendingJobAvailable'));
        }
      `);
    },
    onHide: showDropZone,
  });

  // 4. 创建右下角悬浮拖拽窗口（初始隐藏），传入主窗口引用以便上传后刷新 UI
  createDropZone(port, mainWindow);

  // 关闭窗口 → 最小化到托盘，同时显示悬浮拖拽球
  mainWindow.on('close', (event) => {
    if (!isForceQuit()) {
      event.preventDefault();
      mainWindow.hide();
      showDropZone();
    }
  });
});

// 程序退出前清理后端进程
app.on('before-quit', () => stopBackend());
