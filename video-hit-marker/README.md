# Video Hit Marker

视频卡点工具。拖入视频，在关键时刻打点，生成 MIDI 音符到当前 MIDI 轨道。

## 当前状态

功能完整可用，Live 12 Beta 测试通过。

## 功能

- 拖拽或点击上传视频（支持更换）
- 视频播放 / 暂停（Space）
- 时间轴打点标记（T）
- 时间轴拖拽 scrubbing（实时跟随）
- 打点 hover 高亮 + 删除
- 生成 MIDI 音符到选中轨道
- 竖屏 / 横屏自适应布局

## 技术要点

- WebView 通信: Windows 用 `window.chrome.webview.postMessage`，macOS 用 `window.webkit.messageHandlers.live.postMessage`
- 消息格式: `{ method: "close_and_send", params: [JSON.stringify(result)] }`
- MIDI clip 从 beat 0 开始，音符时间 = `视频秒数 × (bpm / 60)`

## 踩坑记录

1. **Generate MIDI 无反应** — 最初用 `window.parent.postMessage()`，WebView 不是 iframe，不会收到。改为 SDK 的 WebView2/WebKit 专用通信协议解决。

2. **Clip 前面有空隙** — `clipStart` 按第一个 marker 的 beat 位置计算，导致 clip 不从 0 开始。改为 `clipStart = 0` 固定从头开始。

3. **WebView 尺寸** — 横屏视频下方大片空白，竖屏视频太小。通过检测视频宽高比，切换 `.portrait` / `.landscape` CSS 类自适应。

4. **打点列表滚动条违和** — 默认滚动条与暗色 UI 不搭。`::-webkit-scrollbar` 自定义暗色窄滚动条。

5. **空状态文本显示为框** — `.markers-list li` 的 `background: #333` 继承到 `.empty`。加 `background: none` 和 `display: block`（覆盖 flex）。

6. **拖拽 scrubbing** — 起初只有 click 跳转，改 mouse 松手才跳。改为 mousedown/mousemove/mouseup 实现实时拖拽跟随。
