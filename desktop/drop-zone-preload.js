/**
 * 悬浮窗的预加载脚本
 * 通过 contextBridge 安全地暴露 IPC 接口，渲染进程可调用主进程的上传能力
 */
const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('dropZoneAPI', {
  /** 接收 File 对象，通过 webUtils 获取真实路径后传给主进程上传 */
  uploadVideo: (file) => {
    const filePath = webUtils.getPathForFile(file);
    return ipcRenderer.invoke('upload-video', filePath);
  },
  /** 点击狗狗 → 回到主界面 */
  showMainWindow: () => ipcRenderer.send('show-main-window'),
});
