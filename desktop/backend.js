/**
 * 后端 Go 服务生命周期管理
 * 负责启动、停止 Go API 服务，注入 FFmpeg 路径和 .env 配置
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let backendProcess = null;

/** 解析 .env 文件，返回键值对对象 */
function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(
    fs.readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const idx = line.indexOf('=');
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
      }),
  );
}

/** 启动 Go 后端服务，返回最终生效的端口号 */
function startBackend() {
  const isDev = !require('electron').app.isPackaged;
  const exePath = isDev
    ? path.resolve(__dirname, '..', 'backend', 'bin', 'server.exe')
    : path.join(process.resourcesPath, 'backend', 'server.exe');

  const envFile = isDev
    ? path.resolve(__dirname, '..', 'backend', '.env')
    : path.join(process.resourcesPath, 'backend', '.env');

  const env = { ...process.env, ...readEnvFile(envFile) };

  // 注入 FFmpeg 目录到 PATH，确保 Go 能调用 ffmpeg 命令
  const ffmpegDir = isDev
    ? 'D:\\Tools\\ffmpeg\\bin'
    : path.join(process.resourcesPath, 'ffmpeg');
  const pathKey = Object.keys(env).find((k) => k.toLowerCase() === 'path') || 'Path';
  env[pathKey] = `${ffmpegDir};${env[pathKey] || ''}`;

  backendProcess = spawn(exePath, [], {
    cwd: path.dirname(exePath),
    env,
    stdio: 'inherit',
    windowsHide: true,
  });

  backendProcess.on('error', (err) => console.error('后端启动失败:', err));
  backendProcess.on('exit', (code) => console.error('后端进程退出, 退出码:', code));

  return env.PORT || '8080';
}

/** 停止 Go 后端服务 */
function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

module.exports = { startBackend, stopBackend };
