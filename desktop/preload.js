/**
 * 主窗口的预加载脚本
 * 暴露 IPC 接口，让 React 页面能通知主进程执行操作
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  /** 通知主进程显示主窗口 */
  showWindow: () => ipcRenderer.send('show-main-window-from-renderer'),
});
