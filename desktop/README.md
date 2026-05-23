# 视频抽帧桌面端

桌面端现在使用 **Electron + React + Go**。

## 为什么换成 Electron

Electron 不需要 Rust，也不需要 Visual Studio C++ Build Tools。当前项目已有 Node、React 和 Go，使用 Electron 可以更快跑通桌面应用。

## 目录

- `desktop/main.cjs`：Electron 主进程
- `desktop/package.json`：桌面端脚本和依赖
- `frontend/`：React 界面
- `backend/`：Go 本地服务

## 开发启动

方式一：直接启动桌面端。

```powershell
cd D:\视频抽帧\frontend
npm run build

cd D:\视频抽帧\desktop
npm install
npm run dev
```

这种方式会直接加载 `frontend/dist/index.html`，并自动启动 Go 后端。

方式二：连接 Vite 开发服务。

```powershell
cd D:\视频抽帧\frontend
npm run dev

cd D:\视频抽帧\desktop
$env:FRONTEND_URL="http://127.0.0.1:5173"
npm run dev
```

Electron 启动时会自动启动 Go 后端：

```powershell
go run ./cmd/server
```

## 环境变量

- `FRONTEND_URL=http://127.0.0.1:5173`
- `VIDEO_FRAME_BACKEND=后端可执行文件路径`
- `APIMART_API_KEY=你的密钥`

如果没有设置 `VIDEO_FRAME_BACKEND`，Electron 会默认用 `go run ./cmd/server` 启动后端。

## 后续打包

后续可以继续补：

- 编译 Go 后端为 exe
- 使用 electron-builder 打包安装包
- 将前端 dist 和后端 exe 一起打进桌面应用
