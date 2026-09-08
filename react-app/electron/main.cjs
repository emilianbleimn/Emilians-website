// Electron-Hauptprozess: erstellt das Desktop-Fenster und lädt die React-App.
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Im Dev-Modus laden wir den Vite-Server, sonst den fertigen Build (dist/).
const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 380,
    minHeight: 600,
    backgroundColor: '#0A0A0B',
    autoHideMenuBar: true,
    title: 'EB Web Studio',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Externe Links (target=_blank / window.open) im Standardbrowser öffnen
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // mailto: und externe http(s)-Navigationen außerhalb der App öffnen
  win.webContents.on('will-navigate', (event, url) => {
    const internal = url.startsWith('http://localhost') || url.startsWith('file://');
    if (!internal) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
