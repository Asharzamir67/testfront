// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  onWindowFocus: (callback) => {
    ipcRenderer.on('window-focus', callback);
    return () => ipcRenderer.removeListener('window-focus', callback);
  }
});