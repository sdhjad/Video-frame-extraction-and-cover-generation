const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let backend = null;
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 980,
    height: 720,
    title: '视频抽帧',
    icon: path.resolve(__dirname, 'assets', 'app.ico'),
    autoHideMenuBar: true,
    backgroundColor: '#fafafa',
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  win.setMenuBarVisibility(false);
  win.on('page-title-updated', (event) => {
    event.preventDefault();
    win.setTitle('视频抽帧');
  });
  if (process.env.FRONTEND_URL) {
    win.loadURL(process.env.FRONTEND_URL);
  } else if (isDev) {
    win.loadFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
  } else {
    win.loadFile(path.join(process.resourcesPath, 'frontend', 'index.html'));
  }
}

function startBackend() {
  const backendExe = isDev
    ? path.resolve(__dirname, '..', 'backend', 'bin', 'server.exe')
    : path.join(process.resourcesPath, 'backend', 'server.exe');
  const backendDir = path.dirname(backendExe);

  const env = { ...process.env };
  const envFile = isDev
    ? path.resolve(__dirname, '..', 'backend', '.env')
    : path.join(process.resourcesPath, 'backend', '.env');
  Object.assign(env, readEnv(envFile));

  const ffmpegDir = isDev
    ? 'D:\\Tools\\ffmpeg\\bin'
    : path.join(process.resourcesPath, 'ffmpeg');
  const pathKey = Object.keys(env).find((key) => key.toLowerCase() === 'path') || 'Path';
  env[pathKey] = `${ffmpegDir};${env[pathKey] || ''}`;

  backend = spawn(backendExe, [], {
    cwd: backendDir,
    env,
    stdio: 'inherit',
    windowsHide: true,
  });
  backend.on('error', (error) => console.error('backend start failed:', error));
  backend.on('exit', (code) => console.error('backend exited:', code));
}

function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }));
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backend) backend.kill();
  if (process.platform !== 'darwin') app.quit();
});
