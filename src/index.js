import { app, BrowserWindow } from 'electron';

app.commandLine.appendSwitch('lang', 'en-US');

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    show: false,
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      webSecurity: false
    }
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => console.error('Failed to load URL:', errorDescription, errorCode));

  win.loadURL('https://arcade.makecode.com/kiosk')
    .catch(err => console.error('Error loading URL:', err));

  win.webContents.on('did-finish-load', () => {
    win.show();
  });

  win.on('closed', () => {
    app.quit();
  });
}

process.on('SIGINT', () => {
  console.log('Received SIGINT, exiting.');
  app.quit();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, exiting.');
  app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});