/**
 * 主窗口管理
 * 创建 Electron 主窗口并加载前端页面
 */
const { BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow() {
  const isDev = !require('electron').app.isPackaged;

  const win = new BrowserWindow({
    width: 980,
    height: 720,
    title: '视频抽帧',
    icon: path.resolve(__dirname, 'assets', 'app.ico'),
    autoHideMenuBar: true,
    backgroundColor: '#fafafa',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  win.setMenuBarVisibility(false);

  // 阻止页面标题被覆盖
  win.on('page-title-updated', (event) => {
    event.preventDefault();
    win.setTitle('视频抽帧');
  });

  // 根据运行环境加载前端页面（开发 → 本地文件 / 生产 → ASAR 内资源）
  if (process.env.FRONTEND_URL) {
    win.loadURL(process.env.FRONTEND_URL);
  } else if (isDev) {
    win.loadFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
  } else {
    win.loadFile(path.join(process.resourcesPath, 'frontend', 'index.html'));
  }

  return win;
}

module.exports = { createMainWindow };
