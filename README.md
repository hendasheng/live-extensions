# Live Extensions

Ableton Live 12 扩展工具集。

## 环境要求

- **Node.js >= 24.14**（推荐 [fnm](https://github.com/Schniz/fnm) 管理版本）
- **Ableton Live 12 Beta**（Developer Mode 已开启：Preferences → Extensions）
- Windows / macOS

## 快速开始

```bash
git clone https://github.com/hendasheng/live-extensions.git
cd live-extensions/video-hit-marker
npm install
cp .env.example .env   # 按需编辑 Live Beta 路径
npm start
```

在 Live 中右键 MIDI 轨道 → Video Hit Marker 即可打开。

## 扩展列表

### video-hit-marker

视频卡点工具。拖入视频，在关键时刻按 `T` 打点，点击 Generate MIDI 生成对应的 MIDI 音符到当前 MIDI 轨道。

## 多机同步

每台机器首次 clone 后需要：

1. `npm install`（SDK 通过本地 tgz 安装，确保 `~/Downloads/` 下有对应的 SDK 文件）
2. 复制 `.env.example` → `.env`，填入本机 Live Beta 路径
3. `.env` 已 gitignore，不会冲突
