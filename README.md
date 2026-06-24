# Live Extensions

Ableton Live 12 扩展工具集。

## 环境要求

- **Node.js >= 24.14**（Windows: 官网安装或 fnm；macOS: `brew install fnm && fnm install 24`）
- **Ableton Live 12 Beta**（Developer Mode 已开启：Preferences → Extensions，开启后需重启 Live）
- **Ableton Extensions SDK**
- Windows / macOS

## 快速开始

```bash
git clone https://github.com/hendasheng/live-extensions.git
cd live-extensions/video-hit-marker
npm install
cp .env.example .env   # 按需编辑 Live Beta 路径
npm start
```

> `.env` 已 gitignore，每台机器需要自己复制并配置。

### `.env` 配置

| 平台 | `EXTENSION_HOST_PATH` |
|------|----------------------|
| Windows | `C:\ProgramData\Ableton\Live 12 Beta\Program\Ableton Live 12 Beta.exe` |
| macOS | `/Applications/Ableton Live 12 Beta.app/Contents/Helpers/ExtensionHost` |

> ⚠️ **macOS 注意**：不能直接指向 `.app`，必须指向包含 `ExtensionHostNodeModule.node` 的 `Helpers/ExtensionHost` 目录，否则会 handshake 超时。

在 Live 中右键 MIDI 轨道 → **Video Hit Marker** 即可打开。

## 扩展列表

### video-hit-marker

视频卡点工具。拖入视频，在关键时刻按 `T` 打点，点击 **Generate MIDI** 生成对应的 MIDI 音符到当前 MIDI 轨道。

| 操作 | 行为 |
|------|------|
| `Generate MIDI` 按钮 | 回传数据，生成 MIDI，关闭窗口 |
| `Esc` | 仅关闭窗口，不生成 MIDI |
| macOS 红绿灯 | 不显示，用 `Esc` 关闭 |

> 关闭窗口不会生成 MIDI，只有点击按钮才会。符合直觉。
