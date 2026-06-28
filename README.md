# Aerome

Aerome 是一款 Windows 桌面沉浸式音乐播放器，把天气电台、搜索播放、歌词舞台、粒子视觉和 3D 歌单架组合成一个更接近现场感的私人音乐空间。

> **派生作品声明**：Aerome 是 [Mineradio](https://github.com/XxHuberrr/Mineradio)（作者：XxHuberrr）的 GPL-3.0 派生作品。本项目遵循 GPL-3.0 协议，保留原作者版权声明与 LICENSE，并在其基础上做了扩展。原作者保留对 Mineradio 名称、MR Logo、界面视觉设计与原创视觉表达的权利；Aerome 使用了独立的项目名与图标，不与原项目混淆。

## 当前版本

当前版本：`1.1.0`

状态：Aerome 公开开源发布版（派生自 Mineradio v1.1.0）。

> **来自上游的安全提示**：上游 `v1.0.10` 及更早旧安装包不再建议继续安装或传播。Aerome 直接基于 v1.1.0 源码派生，请只使用本仓库的 GitHub Release 资产。

## 相对上游的二创改动

- **B 站音源接入**：新增 `/api/bili/search`、`/api/bili/detail`、`/api/bili/audio`、`/api/bili/subtitle` 四个免登录端点；音频流走 DASH 自动挑最高码率；搜索 tab 增加「B站」平台选项。
- **酷狗音源接入**：新增 `/api/kugou/search`、`/api/kugou/song/url`、`/api/kugou/lyric` 三个免登录端点；搜索走 msearch + 签名；播放 URL 走 m.kugou.com playInfo（免费歌曲直接拿 128K url，VIP 标记 payRequired）；歌词走 krcs/lyrics 两步式 LRC 下载；搜索 tab 增加「酷狗」平台选项；三方跨音源 fallback 链 netease ↔ qq ↔ kugou（VIP/受限歌曲自动匹配同名同歌手的其它平台版本）。
- **缓存目录统一**：所有运行时缓存（cookie、beatmap、updates、Electron userData）重定向到 `E:\Claude code\AeromeData\`，不再写入 C 盘；可通过 `AEROME_DATA_DIR` 环境变量覆盖。
- **安全基线收紧**：本地 HTTP 服务默认监听 `127.0.0.1`（保留 `HOST` 环境变量覆盖）；CORS 不再使用通配 `*`，改为只允许 `localhost` / `127.0.0.1` 来源；OPTIONS 预检统一在 HTTP 入口处理；静态资源服务增加显式 root 边界校验。
- **品牌重命名**：项目名 Mineradio → Aerome，独立 appId、独立图标、独立发布仓库；旧 `MINERADIO_*` 环境变量仍向后兼容读取，新 `AEROME_*` 优先。

## 核心特性（继承自 Mineradio v1.1.0）

- Open-Meteo 天气电台，根据当前位置、城市和天气 mood 生成更合适的播放队列
- 首页包含天气电台、每日推荐、私人电台、继续听、听歌画像和我的歌单入口
- Wallpaper 银河首页背景，未播放状态保持干净的星河氛围
- 播放后切换到 Emily / 默认播放态视觉，歌词舞台与粒子舞台同步工作
- 基于节奏的电影镜头视觉系统
- 面向长播客和 DJ 曲目的专属视觉模式
- 歌词舞台、自定义歌词、歌词位置与视觉控制
- 自定义专辑封面上传与裁剪
- 右键唤起 3D 歌单架，支持歌单队列浏览
- 网易云音乐账号、搜索、歌单、播客等体验接入
- QQ 音乐搜索、登录态与音源补充接入
- **新增**：B 站视频音频免登录播放
- **新增**：酷狗音乐搜索/播放/歌词免登录接入
- **新增**：网易云 / QQ / 酷狗 三方跨音源 fallback，VIP 受限歌曲自动匹配同名版本
- GitHub Releases 更新检测与下载入口
- 首次启动内置「默认测试」视觉用户存档

## 使用说明

Windows 用户可以在 GitHub Releases 中下载安装包。

正式分发以 Release 资产中的 `Aerome-1.1.0-Setup.exe` 为准。安装包会创建桌面快捷方式。

## 开发运行

```bash
npm install
npm start
npm run build:win
```

桌面版入口由 Electron 主进程加载本地服务。`npm run build:win` 会生成 Windows NSIS 安装包，产物位于 `dist/`。

## 更新机制

Aerome 会请求 GitHub Releases latest 检测新版本。远端版本高于本地版本时，应用内更新入口会展示 Release 内容、下载安装包到本机用户数据目录，并通过系统打开安装包。

本地验证更新链路时，可以通过 `AEROME_UPDATE_MANIFEST`（或旧 `MINERADIO_UPDATE_MANIFEST`）指向一个本地 manifest JSON 或 HTTP 地址来模拟线上 Release。

## 第三方音乐平台说明

Aerome 不是网易云音乐、QQ 音乐、酷狗音乐、腾讯音乐娱乐集团或哔哩哔哩的官方客户端，也不隶属于任何音乐平台。酷狗音乐是广州酷狗计算机科技有限公司的商标，本项目非官方、非附属。

项目中的第三方平台接入仅用于个人学习、本地客户端体验和用户自有账号的播放辅助。请遵守对应平台的用户协议、版权规则和会员权益规则。项目不会提供绕过付费、绕过会员、破解音质或重新分发音乐内容的能力。

B 站接入仅使用公开免登录接口，不涉及登录态、不读取用户私人数据。

酷狗接入仅使用公开免登录接口（搜索 + 免费歌曲 128K 试听 URL + LRC 歌词），VIP 歌曲仅标记为不可播放并尝试自动跨音源匹配其它平台的免费版本。

## 用户数据与隐私

登录 Cookie、搜索历史、自定义封面、自定义歌词、节奏分析缓存、B 站匿名 buvid3 等数据只应保存在本机用户数据目录或浏览器本地存储中，不应提交到仓库。

更多说明见 [PRIVACY.md](./PRIVACY.md)。

## 版权与授权

本项目是 [Mineradio](https://github.com/XxHuberrr/Mineradio) 的 GPL-3.0 派生作品，由 Akilaea 维护。

- 原作品版权 `Copyright (C) 2026 XxHuberrr`，遵循 GPL-3.0
- 派生作品版权 `Copyright (C) 2026 Akilaea`，遵循 GPL-3.0
- 详见 [LICENSE](./LICENSE) 与 [NOTICE.md](./NOTICE.md)

Aerome 名称与图标为 Akilaea 独立设计，与原 Mineradio 项目无关联。第三方依赖和第三方服务分别遵循其各自授权与服务条款。
