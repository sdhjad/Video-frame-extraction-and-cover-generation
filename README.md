# Video Frame Extraction & Cover Generation · 视频抽帧封面生成

A desktop tool for extracting frames from videos and generating AI-powered cover images for Douyin-style content.

基于 Electron + React + Go + FFmpeg 的桌面应用，用于视频抽帧、逐帧预览和 AI 封面生成。

## Features · 功能

- **Video Frame Extraction** — Upload videos and extract frames at custom intervals via FFmpeg
- **Frame Preview** — Full-size preview with keyboard navigation (← → Esc) and batch selection
- **AI Cover Generation** — Generate Douyin-style covers in 3:4 (portrait) and 4:3 (landscape) ratios
- **System Tray & Drop Zone** — Minimize to tray, drag-and-drop MP4 files onto floating drop zone for quick import
- **One-Click Packaging** — Electron desktop app bundling backend + frontend + FFmpeg into a single NSIS installer
- **Local Storage** — All video files and extracted frames stored locally

## Tech Stack · 技术栈

| Layer | Technology |
|---|---|
| Backend | Go 1.26, Gin, FFmpeg |
| Frontend | React 19, TypeScript, Vite 8 |
| Desktop | Electron 39, electron-builder |
| AI | APIMart (gpt-image-2) |

## Project Structure · 目录结构

```
├── backend/                  # Go API server
│   ├── cmd/server/main.go    # Entry point
│   └── internal/
│       ├── api/              # HTTP handlers
│       ├── apimart/          # AI image generation client
│       ├── config/           # Environment config
│       ├── covers/           # Cover generation service
│       ├── jobs/             # Job queue & management
│       ├── storage/          # File & frame storage
│       └── video/            # FFmpeg video processing
├── frontend/                 # React SPA
│   └── src/
│       ├── api/              # HTTP client layer
│       ├── components/       # UI components
│       ├── hooks/            # Custom React hooks
│       ├── styles/           # CSS stylesheets
│       ├── types/            # TypeScript types
│       └── utils/            # Utilities
└── desktop/                  # Electron desktop shell
    ├── main.js               # App entry (lifecycle orchestration)
    ├── window.js             # Main browser window
    ├── backend.js            # Go backend process management
    ├── tray.js               # System tray icon & menu
    ├── drop-zone.js          # Floating drag-and-drop window
    ├── preload.js            # Preload script (context bridge)
    └── electron-builder.yml  # NSIS packaging config
```

## Quick Start · 本地运行

### Prerequisites · 环境要求

- [Go](https://go.dev/dl/) 1.26+
- [Node.js](https://nodejs.org/) 22+
- [FFmpeg](https://ffmpeg.org/download.html) (on PATH for development; bundled in production build)

### 1. Clone & Setup · 克隆项目

```bash
git clone https://github.com/sdhjad/Video-frame-extraction-and-cover-generation.git
cd Video-frame-extraction-and-cover-generation
```

### 2. Backend · 后端

```bash
cd backend
cp .env.example .env          # 编辑 .env，填入你的 APIMART_API_KEY
go run ./cmd/server            # 服务启动在 http://localhost:8080
```

### 3. Frontend (Dev Mode) · 前端开发模式

```bash
cd frontend
npm install
npm run dev                    # Vite 开发服务器 http://localhost:5173
```

### 4. Desktop (Electron) · 桌面端

```bash
cd desktop
npm install
npm run start                  # 启动 Electron 窗口，自动拉起后端和前端
```

Electron 启动后：
- **主窗口** — 视频上传、抽帧、预览、封面生成
- **系统托盘** — 关闭窗口后最小化到托盘
- **悬浮拖拽球** — 最小化后显示，拖入 MP4 文件直接开始抽帧

## Deployment · 部署打包

### 打包为 Windows 安装程序

确保已安装 FFmpeg 并将 `ffmpeg.exe` 放到 `desktop/external/ffmpeg/` 下：

```bash
# 1. 准备 FFmpeg
mkdir -p desktop/external/ffmpeg
cp /path/to/ffmpeg.exe desktop/external/ffmpeg/

# 2. 编译 Go 后端
cd backend
go build -o bin/server.exe ./cmd/server

# 3. 构建前端
cd ../frontend
npm install && npm run build

# 4. 打包 Electron 安装程序
cd ../desktop
npm install && npm run pack
```

也可以一步完成：

```bash
cd desktop
npm run pack    # 自动执行 build:backend → build:frontend → electron-builder
```

产物位置：`desktop/dist/视频抽帧 Setup 0.1.0.exe`

### 安装程序包含

| 组件 | 说明 |
|---|---|
| Electron 运行时 | 桌面窗口环境 |
| Go 后端服务 | API 和 FFmpeg 视频处理 |
| React 前端 | UI 界面 |
| FFmpeg | 视频抽帧引擎（无需用户单独安装） |
| .env 配置 | 运行时配置（不含密钥模板） |

### 首次安装后配置

安装完成后，编辑安装目录下的 `resources/backend/.env`，填入你的 API 密钥：

```
APIMART_API_KEY=你的真实密钥
```

## Environment Variables · 环境变量

| Variable | Required | Description |
|---|---|---|
| `APIMART_API_KEY` | 是 | APIMart AI 图像生成 API 密钥 |
| `VIDEO_FRAME_BACKEND` | 否 | 自定义后端二进制路径（Electron 开发/调试用） |
| `FRONTEND_URL` | 否 | 前端开发服务器地址（Electron 开发模式用） |

## License

MIT
