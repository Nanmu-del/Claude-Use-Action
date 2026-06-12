<<<<<<< HEAD
# 🎵 个人音乐播放器 Web Music Player

一个纯前端、零依赖的本地音乐播放器。打开网页即可加载本地音频文件，带实时频谱可视化、旋转黑胶唱片、可自定义的背景与主题。无需安装、无需后端、无需联网（背景预设图除外）。

![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 功能特性

- 🎧 **本地播放** — 支持批量添加本地音频文件（mp3/wav/ogg 等浏览器支持的格式）
- 📊 **实时频谱可视化** — 基于 Web Audio API，唱片周围绽放随节奏跳动的环形声波
- 💿 **旋转黑胶唱片** — 播放时旋转、随音乐能量"呼吸"缩放
- 🎨 **高度自定义** — 一键切换背景图（预设 / 本地上传 / URL 链接）、主题强调色、背景模糊度、面板透明度
- 💾 **设置持久化** — 所有自定义通过 `localStorage` 保存，刷新不丢失
- 🔀 **播放控制** — 上一首 / 下一首 / 随机 / 循环 / 进度拖动 / 音量调节
- 📱 **响应式设计** — 适配桌面与移动端
- 🪟 **毛玻璃 UI** — 渐变背景、浮动光晕、流畅动效

## 🚀 快速开始

### 方式一：双击启动（推荐，免命令行）

1. 下载或克隆本仓库
2. 双击 **`启动播放器.vbs`**（无黑框窗口）或 **`start.bat`**
3. 浏览器自动打开播放器

### 方式二：直接打开

双击 `index.html` 即可在浏览器中打开。

> 提示：部分浏览器对 `file://` 协议下的 Web Audio 有限制。若频谱不显示，建议用方式一启动，或使用本地服务器（见下）。

### 方式三：本地服务器（可选）

```bash
# Python 3
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 📖 使用说明

1. 点击 **选择文件** 添加本地音乐（可多选）
2. 点击播放列表中的歌曲或播放按钮开始播放
3. 点击右上角 **⚙️** 打开自定义面板：
   - 选择预设背景图，或上传本地图片 / 粘贴图片 URL
   - 选择主题强调色（频谱与控件颜色会同步变化）
   - 调节背景模糊与界面透明度
   - 「恢复默认」一键还原

## 📁 项目结构

```
music-player-web/
├── index.html         # 页面结构
├── style.css          # 样式与动效
├── app.js             # 播放逻辑 + 可视化 + 自定义设置
├── start.bat          # Windows 启动脚本
├── 启动播放器.vbs      # Windows 无窗口启动脚本
├── README.md
├── LICENSE
└── .gitignore
```

## 🛠️ 技术栈

- 原生 HTML5 / CSS3 / JavaScript（无框架、无构建步骤）
- Web Audio API（`AnalyserNode` 频谱分析）
- Canvas 2D（可视化绘制）
- localStorage（设置持久化）

## 📷 浏览器兼容

建议使用最新版 Chrome / Edge / Firefox。Web Audio 可视化需要支持 `AudioContext` 的现代浏览器。

## 📄 许可证

[MIT](LICENSE) © 2026
=======
# Claude-Use-Action
Claude使用教程
>>>>>>> 9ebe7c6d14895f123191965aa394039936f774d6
