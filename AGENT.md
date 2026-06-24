# CLAUDE.md — AI 接手上下文

## 项目概览

Ableton Live 12 扩展工具集，首个扩展为 video-hit-marker（视频卡点 MIDI 生成器）。

## 技术栈

- **SDK**: `@ableton-extensions/sdk` v1.0.0-beta.0（本地 tgz 安装）
- **构建**: esbuild（`build.ts`），入口 `src/extension.ts`，输出 `dist/extension.js`（CJS）
- **HTML 加载**: `.html` 文件通过 esbuild `text` loader 转为字符串导入
- **类型声明**: `src/html.d.ts` — `declare module "*.html"`

## 安装与配置

1. 从 [Ableton Developer](https://www.ableton.com/en/developer/) 下载 Extensions SDK，解压得到 tgz 文件
2. 修改 `video-hit-marker/package.json` 中 `@ableton-extensions/sdk` 和 `@ableton-extensions/cli` 的 `file:` 路径，指向解压后的 tgz
3. `npm install`
4. `cp .env.example .env`，确认 `EXTENSION_HOST_PATH` 指向本机 Live Beta 可执行文件

## 项目结构

```
live-extensions/
├── AGENT.md                      # 本文件
├── README.md
├── .gitignore                   # node_modules, dist, .env
└── video-hit-marker/
    ├── manifest.json            # Live 扩展清单
    ├── package.json             # SDK 依赖，file: 路径需按本机调整
    ├── build.ts                 # esbuild 构建配置
    ├── tsconfig.json
    ├── .env                     # EXTENSION_HOST_PATH（已 gitignore）
    ├── .env.example             # 环境变量模板
    └── src/
        ├── extension.ts         # 扩展入口，MIDI 生成逻辑
        ├── interface.html       # WebView UI（自包含 HTML+CSS+JS）
        └── html.d.ts            # .html 模块类型声明
```

## 核心架构

### extension.ts

- 注册右键菜单: `MidiTrack` → "Video Hit Marker"
- 通过 `context.ui.showModalDialog(url, 960, 680)` 打开 WebView
- 接收 WebView 消息后创建 MIDI clip：
  - `clip` 从 beat 0 开始
  - 排序 markers 并转为 `NoteDescription[]`（pitch: 60, duration: 0.25, velocity: 100）
  - `startTime = marker.time * (tempo / 60)`

### interface.html（自包含，无外部依赖）

**通信协议**（关键）：
- Windows (WebView2): `window.chrome.webview.postMessage(message)`
- macOS (WebKit): `window.webkit.messageHandlers.live.postMessage(message)`
- 关闭并回传结果: `{ method: "close_and_send", params: [JSON.stringify(result)] }`

**UI 结构**：
- 上传区域（拖拽 / 点击）→ 视频播放器 → 时间轴
- 右侧面板: Markers 列表 + Generate MIDI 按钮
- 快捷键: Space 播放/暂停, T 打点, ← → 快进快退

**时间轴交互**：
- 拖拽 scrubbing（mousedown/mousemove/mouseup 在 document 上）
- 打点 hover 高亮 + 弹出删除按钮
- 打点绘制: 倒三角（`ctx.moveTo`, `ctx.lineTo`），无竖线
- 播放线: 白色竖线，无箭头

## 关键约定

- 不要用 `window.parent.postMessage()` — 这是 WebView，不是 iframe
- MIDI clip 的 `clipStart` 固定为 0，clip 从 arrangement 最开头开始
- 时间戳用 `视频秒数 * (bpm / 60)` 转为 beats
- UI 底色统一用 `#252525`，时间轴略深用 `#1e1e1e`
- 空 marker 列表根据 `videoLoaded` 显示不同文案

## 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| `npm start` 连不上 Live | Live 未开 / Developer Mode 未启用 | 先开 Live Beta，确认 Preferences → Extensions 开启 |
| Node 版本报错 | 系统 Node < 24 | `fnm use 24` 后重试 |
| 管道另一端无进程 | Live 已关闭或重启中 | 重启 Live |
| SDK 路径找不到 | tgz 路径是相对路径，clone 后需要 | 确认 `~/Downloads/` 下有 SDK tgz 文件 |

## 后续扩展

添加新插件时：
1. 在 `live-extensions/` 下新建文件夹（如 `my-tool/`）
2. 复制 video-hit-marker 的 `build.ts`, `tsconfig.json` 作为模板
3. 在 README.md 的扩展列表中添加条目
4. 检查 `package.json` 中 SDK 相对路径是否一致
