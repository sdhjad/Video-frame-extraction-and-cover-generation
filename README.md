# Video Frame Extraction & Cover Generation · 视频抽帧封面生成

A desktop tool for extracting frames from videos and generating AI-powered cover images for Douyin-style content.

基于 Electron + React + Go + FFmpeg 的桌面应用，用于视频抽帧、逐帧预览和 AI 封面生成。

## Features · 功能

- **Video Frame Extraction** — Upload videos and extract frames at custom intervals via FFmpeg
- **Frame Preview** — Full-size preview with keyboard navigation (← → Esc) and batch selection
- **AI Cover Generation** — Generate Douyin-style covers in 3:4 (portrait) and 4:3 (landscape) ratios
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
├── backend/              # Go API server
│   ├── cmd/server/       # Entry point
│   └── internal/
│       ├── api/          # HTTP handlers (upload, frames, covers, download)
│       ├── apimart/      # AI image generation client
│       ├── config/       # Environment configuration
│       ├── covers/       # Cover generation orchestration
│       ├── jobs/         # Job queue & lifecycle management
│       ├── storage/      # File system & frame storage
│       └── video/        # FFmpeg video frame extraction
├── frontend/             # React SPA
│   └── src/
│       ├── api/          # HTTP client & endpoint definitions
│       ├── components/   # UI components
│       ├── hooks/        # Custom React hooks
│       ├── styles/       # CSS stylesheets
│       ├── types/        # TypeScript type definitions
│       └── utils/        # Utilities (cover download, etc.)
└── desktop/              # Electron desktop shell
    ├── main.cjs          # Main process (backend lifecycle + window)
    ├── assets/           # App icon
    └── electron-builder.yml  # NSIS packaging config
```

## Getting Started · 本地开发

### Prerequisites · 环境要求

- **Go** 1.26+
- **Node.js** 22+
- **FFmpeg** (on PATH for development; bundled in production build)

### 1. Backend · 后端

```bash
cd backend
cp .env.example .env      # Add your APIMART_API_KEY
go run ./cmd/server        # Starts on :8082
```

### 2. Frontend · 前端

```bash
cd frontend
npm install
npm run dev                # Vite dev server on :5173
```

### 3. Desktop · 桌面端

```bash
cd desktop
npm install
npm run start              # Electron window with backend + frontend
```

## Packaging · 打包

```bash
cd desktop
npm run pack               # Build backend, frontend, then create NSIS installer
```

Output: `desktop/dist/视频抽帧 Setup x.x.x.exe`

## Environment Variables · 环境变量

| Variable | Description |
|---|---|
| `APIMART_API_KEY` | API key for APIMart image generation |
| `VIDEO_FRAME_BACKEND` | Custom backend binary path (Electron) |
| `FRONTEND_URL` | Frontend dev server URL (Electron dev mode) |

## License

MIT
