// electron/main.js
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import electronIsDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEV_SERVER_URL = process.env.ELECTRON_RENDERER_URL ?? 'http://localhost:3000';
const DEV_SERVER_WS_URL = (() => {
  try {
    const parsed = new URL(DEV_SERVER_URL);
    const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${parsed.host}`;
  } catch {
    return 'ws://localhost:3000';
  }
})();

let mainWindow = null;
let cspConfigured = false;

function configureContentSecurityPolicy(session) {
  if (cspConfigured) return;

  const connectSources = ["'self'"];
  if (electronIsDev) {
    connectSources.push(DEV_SERVER_URL, DEV_SERVER_WS_URL);
  }

  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    `connect-src ${connectSources.join(' ')}`,
    "font-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'"
  ].join('; ');

  session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = {
      ...details.responseHeaders,
      'Content-Security-Policy': [contentSecurityPolicy]
    };
    callback({ responseHeaders });
  });

  cspConfigured = true;
}

async function loadRenderer(mainWindowInstance) {
  const productionIndex = path.join(__dirname, '../dist/index.html');

  if (electronIsDev) {
    try {
      console.log(`Loading dev server at ${DEV_SERVER_URL}`);
      await mainWindowInstance.loadURL(DEV_SERVER_URL);
      return;
    } catch (error) {
      console.warn('Dev server unavailable, falling back to production build.', error);
    }
  }

  try {
    await mainWindowInstance.loadFile(productionIndex);
  } catch (error) {
    console.error('Failed to load production build:', error);
    throw error;
  }
}

async function createWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (electronIsDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('focus', () => {
    mainWindow.webContents.send('window-focus');
  });

  configureContentSecurityPolicy(mainWindow.webContents.session);
  await loadRenderer(mainWindow);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
