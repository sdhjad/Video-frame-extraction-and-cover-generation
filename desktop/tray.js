/**
 * 系统托盘管理
 * 窗口关闭后最小化到任务栏托盘，右键菜单可恢复窗口或彻底退出
 */
const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let tray = null;
let forceQuit = false;

/**
 * 创建系统托盘
 * @param {BrowserWindow} mainWindow - 主窗口实例
 * @param {object} callbacks - { onShow, onHide, onQuit }
 */
function createTray(mainWindow, callbacks) {
  // 从应用图标生成 16x16 托盘小图标
  const iconPath = path.resolve(__dirname, 'assets', 'app.ico');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip('视频抽帧 — 拖拽 MP4 到右下角悬浮窗即可抽帧');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
        if (callbacks.onShow) callbacks.onShow();
      },
    },
    {
      label: '隐藏窗口',
      click: () => {
        mainWindow.hide();
        if (callbacks.onHide) callbacks.onHide();
      },
    },
    { type: 'separator' },
    {
      label: '退出程序',
      click: () => {
        forceQuit = true;
        if (callbacks.onQuit) callbacks.onQuit();
        require('electron').app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // 双击托盘图标快速恢复窗口
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
    if (callbacks.onShow) callbacks.onShow();
  });
}

function isForceQuit() {
  return forceQuit;
}

module.exports = { createTray, isForceQuit };
