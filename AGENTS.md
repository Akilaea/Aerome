# Aerome Project Rules

> 本文件由上游 Mineradio 的 AGENTS.md 派生而来，已更新为 Aerome 派生作品的工作规则。

## Project Identity

Aerome 是 [Mineradio](https://github.com/XxHuberrr/Mineradio)（作者：XxHuberrr）的 GPL-3.0 派生作品，由 [Akilaea](https://github.com/Akilaea) 维护。同样是 Windows Electron 桌面音乐播放器，核心体验包括搜索、播放、歌单、歌词、3D 歌单架、粒子视觉预设、DIY 视觉控制台和 GitHub 自动更新。

**派生作品与上游的关系**：
- 上游 Mineradio 名称、MR Logo、界面视觉设计归原作者 XxHuberrr 所有
- Aerome 使用独立项目名、独立图标、独立 appId、独立发布仓库
- 保留上游 LICENSE（GPL-3.0）与 NOTICE，叠加 Akilaea 派生作品版权

- 派生作品 GitHub 仓库：`https://github.com/Akilaea/Aerome`
- 上游 GitHub 仓库：`https://github.com/XxHuberrr/Mineradio`
- 当前源码版本：`v1.1.0`

## Start Every New Codex Thread Here

新对话开始处理 Aerome 前，必须先确认当前目录是当前派生作品的源码根目录（例如 `E:\Claude code\Mineradio-main`），然后读这些文件：

- `AGENTS.md`（本文件）
- `docs/PROJECT_MEMORY.md`（继承自上游）
- 涉及玻璃 SVG 质感时读取 `docs/GLASS_SVG_TEXTURE.md`
- 涉及发布时读取 `CHANGELOG.md`、`RELEASE.md`、`package.json`

## Repository Layout

```text
<project root>/
├─ public/
│  ├─ index.html        # 主 UI、CSS、歌词、粒子、3D 歌单架、视觉控制台
│  └─ vendor/           # 本地 vendor 依赖
├─ desktop/             # Electron main/preload
├─ build/               # 打包资源和 installer 脚本
├─ docs/                # 项目记忆、设计偏好、长期约束
├─ server.js            # 本地 API、音乐源、更新检查、补丁应用、B 站接入
├─ dj-analyzer.js       # 节奏/音频分析
├─ package.json         # 版本号、构建命令、electron-builder 配置
└─ CHANGELOG.md         # 中文更新说明优先写在顶部
```

## Commands

```bash
npm start                  # 启动 Electron 应用
node --check server.js     # 语法检查
node --check desktop/main.js
npm run build:win:dir      # 打包目录版（不出安装器）
npm run build:win          # 出 NSIS 安装包到 dist/
```

前端主逻辑在 `public/index.html`。改动后至少做：

```bash
node --check server.js
node --check desktop/main.js
```

并用实际 Electron 或浏览器检查关键交互。

## Release Workflow

发布新版本时：

1. 更新 `package.json` 和 `package-lock.json` 版本号。
2. 更新 `CHANGELOG.md` 顶部中文说明。
3. 运行语法/空白检查。
4. 执行 `npm run build:win`。
5. 上传 GitHub Release 资产：
   - `dist/Aerome-x.y.z-Setup.exe`
   - `dist/Aerome-x.y.z-Setup.exe.blockmap`
   - `dist/latest.yml`
   - 需要的 `Aerome-旧版本-x.y.z.json` 轻量补丁
6. 上游 0.9 系列补丁跳过；Aerome 自己的版本补丁按需生成。

GitHub CLI / `gh auth` / Release 上传需要代理时，优先使用可用本机代理 `127.0.0.1:10808`。

## User Preferences（继承自上游）

- 交流语言：中文。
- 用户偏好：少废话，直接做，修完验证，能发布就一起发布。
- UI 审美：精致、暗色、高级、流畅，拒绝廉价渐变、过度透明、错位、闪烁和卡顿。
- 视觉质量定义：质感、丝滑度、帧数稳定同时成立；性能优化不能牺牲既有质感。
- 玻璃质感：详见 `docs/GLASS_SVG_TEXTURE.md`。
- 备份策略：不要删除旧资料；重复和历史内容移到独立备份目录。

## Memory Protocol

当用户说"保留""这个做得很好""我喜欢""记住这个""保存一下""以后别忘了"或同类表达时：

1. 判断用户认可的是代码、视觉效果、交互流程、发布流程还是工作习惯。
2. 将结论追加到 `docs/PROJECT_MEMORY.md` 的对应区块。
3. 如果是玻璃 SVG、粒子预设、3D 歌单架等脆弱视觉实现，同时更新对应专项文档。
4. 记录日期、涉及文件、关键参数、不要再改坏的边界。
5. 如果本轮有代码提交，把记忆文档一起提交。

## Guardrails（继承自上游）

- 不要随意重写 `public/index.html` 的大块视觉系统；先定位已有函数和状态。
- 不要动电影视觉系统，除非用户明确点名。
- 不要恢复旧的侧边栏闪烁、控制台播放暂停失效、3D 歌单架强制切回星河等问题。
- 不要把搜索结果、左侧歌单、3D 歌单架的性能优化做成一次性渲染全部内容。
- 不要把用户认可的玻璃质感改成普通毛玻璃或廉价透明面板。

## 派生作品合规边界

- **不要**删除或修改上游 LICENSE / NOTICE 中的原版权声明。
- **不要**把派生作品标为「原创」——必须明确标注是 Mineradio 的派生作品。
- **不要**使用 Mineradio 名称或 MR Logo 作为本项目标识——本项目独立用 Aerome。
- 修改代码时如果触及原 `@author` 注释，保留原注释，可追加 `modified by Akilaea`。
