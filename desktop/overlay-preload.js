const { contextBridge, ipcRenderer } = require('electron');

function bind(channel, callback) {
  if (typeof callback !== 'function') return () => {};
  const listener = (_event, payload) => callback(payload || {});
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld('desktopOverlay', {
  onLyricsState: (callback) => bind('aerome-desktop-lyrics-state', callback),
  onWallpaperState: (callback) => bind('aerome-wallpaper-state', callback),
  setLyricsDrag: (dragging) => ipcRenderer.invoke('aerome-desktop-lyrics-set-dragging', !!dragging),
  setLyricsPointerCapture: (active) => ipcRenderer.invoke('aerome-desktop-lyrics-set-pointer-capture', !!active),
  setLyricsHotBounds: (bounds) => ipcRenderer.invoke('aerome-desktop-lyrics-set-hot-bounds', bounds || {}),
  setLyricsLockState: (locked) => ipcRenderer.invoke('aerome-desktop-lyrics-set-lock-state', !!locked),
  moveLyricsBy: (dx, dy) => ipcRenderer.invoke('aerome-desktop-lyrics-move-by', Number(dx) || 0, Number(dy) || 0),
  closeLyrics: () => ipcRenderer.invoke('aerome-desktop-lyrics-set-enabled', false, {}),
});
