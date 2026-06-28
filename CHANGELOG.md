# Changelog

## v1.2.0

新增 **酷狗音乐**音源 + **三方跨音源 fallback**（参考 ncm 解锁思路），同时把所有运行时缓存统一迁出 C 盘。

### 酷狗音源接入

- 新增 `/api/kugou/search`：免登录搜索，走 `msearch.kugou.com/api/v3/search/song` + 自实现 MD5 签名（参数按字典序排序后两端拼 `NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt`），返回标准化 SongInfo 列表（含 hash + albumId + name + artist + duration）。
- 新增 `/api/kugou/song/url`：免登录拿播放 URL，走 `m.kugou.com/app/i/getSongInfo.php?cmd=playInfo`。免费歌曲返回 128K 试听 URL，VIP 歌曲返回 `playable=false` + `payRequired=true`。
- 新增 `/api/kugou/lyric`：免登录拿 LRC 歌词，走 `krcs.kugou.com/search` + `lyrics.kugou.com/download` 两步式接口（候选 ID + accesskey → base64 LRC 文本），解析为 `{from, to, content}` 行。
- 设备标识：启动时生成 + 持久化 `dfid` + `mid` 到 `E:\Claude code\AeromeData\.kugou-dfid`，避免反爬。
- `audioProxyHeadersFor` 增加 `kugou.com` / `kgmusic.com` 分支，自动带 `Referer: https://www.kugou.com/` + `Origin`。

### 三方跨音源 fallback（VIP 解锁思路）

- `alternatePlaybackProviders` 改为返回 `['qq', 'kugou', 'netease']` 数组（剔除当前源）。
- `searchAlternatePlatformSong` 依次尝试每个备选音源，第一个找到同名同歌手歌曲的返回。
- 实际场景：网易云 VIP → 自动找 QQ 版本；QQ VIP → 自动找酷狗版本；酷狗 VIP → 自动找 QQ 版本。覆盖范围比 v1.1.x 的双源 fallback 显著扩大。

### UI 端

- 搜索 tab 增加「酷狗」选项；`searchMode` 白名单、`setSearchMode`、placeholder 全部更新。
- `songProviderKey` / `playbackProviderLabel` / `songSourceTagHtml` 识别 kugou。
- `fetchBeatPrefetchAudioUrl` + `loadAndPlayCurrentSong` 增加 kugou 分支，VIP 歌曲自动触发 `tryAutoPlaybackFallback`。
- CSS `.tag-source.kugou`（酷狗蓝 `#009AF3`）+ `.search-result.kugou-source:hover`。
- 全平台「All」搜索现在并行搜网易云 + QQ + 酷狗，结果按相关性合并。
- 新增 `normalizeKugouItem`，把后端 hash/albumId 字段标准化为前端期望的 song 对象。

### 缓存目录统一（v1.1.x 遗留）

- 所有运行时缓存重定向到 `E:\Claude code\AeromeData\`：
  - `.cookie`（网易云）+ `.qq-cookie`（QQ 音乐）+ `.bili-buvid`（B 站）+ `.kugou-dfid`（酷狗）
  - `beatmaps/`（节拍图缓存）
  - `updates/`（自动更新下载 + 补丁备份）
  - `userData/`（Electron 内部：Cache、GPUCache、Code Cache、IndexedDB 等）
- 不再写入 C 盘 `%APPDATA%\Aerome\`；可通过 `AEROME_DATA_DIR` 环境变量覆盖。

### 兼容性

- v1.1.x 用户升级后旧的 C 盘 cookie/缓存不会自动迁移（避免误删用户数据）；如需保留登录态，用户可手动把 `%APPDATA%\Aerome\.cookie` 拷贝到 `E:\Claude code\AeromeData\.cookie`。
- v1.1.0 已经创建过的独立 `Aerome` 文件夹仍可被 v1.1.1+ 安全覆盖安装。

## v1.1.1

同步上游 Mineradio v1.1.1 的 **P0 安装器安全修复**（[上游发布说明](https://github.com/XxHuberrr/Mineradio/releases/tag/v1.1.1)），并完成 Aerome 品牌化适配。

### 安装器安全修复（来自上游 v1.1.1）

- **新增专属标记文件**：安装时在安装根目录写入 `.aerome-install-root` 标记文件（含 `appId=com.aerome.desktop`）。卸载时只清理该标记文件确认归属的目录，避免误删用户其它文件。
- **卸载不再递归删除安装根目录**：新卸载器改为枚举 Aerome 已知文件名（`Aerome.exe`、Electron 运行时 DLL/pak/dat、`locales/`、`resources/`、`swiftshader/` 等空目录），不再使用 `RMDir /R $INSTDIR`。
- **卸载前双重校验**：`un.AeromeValidateUninstallDir` 强制要求卸载路径必须是 `\Aerome` 结尾，且必须存在标记文件；任意一项不满足直接 `SetErrorLevel 2` 退出，不删任何文件。
- **禁止在混合目录就地安装**：例如 `D:\百度盘\翻身(1)` 这类含其它文件的目录不再被接管为安装目录；安装器只允许独立的 `Aerome` 文件夹，或空的可创建目录。
- **禁用遗留不安全卸载器**：`AeromeDisableUnsafeOldUninstallers` 在安装开始时扫描注册表中记录的旧 InstallLocation，如果该路径缺少标记文件且不是当前可接管目录，会删除遗留的 `Uninstall Aerome.exe` 单文件并清理残留注册表项，防止后续被错误调用。
- **首次安装目录选择改进**：自动从 D-Z 盘中选首个可用盘作为默认安装位置（只有 C 盘时回落到 `C:\Aerome`）；如果注册表已有可接管的 Aerome 安装路径，优先复用。
- **C 盘保护**：检测到 D-Z 任意盘存在时，禁止安装到 C 盘（避免与系统盘混用）；只有当电脑确实只有 C 盘时才放行。
- **保留覆盖能力**：v1.1.0 已经创建过的独立 `Aerome` 文件夹即使没有标记文件，也可以被 v1.1.1 安全覆盖安装（自动补写标记）。

### 升级说明

- 这是 **P0 安全更新**，必须运行完整的 Setup.exe 才能替换旧版 Windows 卸载器和注册表项；不提供软件内快速补丁。
- 已经安装 v1.1.0 的用户：直接覆盖安装即可，旧文件夹会被识别为可接管目录，标记文件会自动补全。
- 已经从更早版本（v1.0.x）升级过的用户：如果当前安装路径是独立的 `D:\Aerome` 之类的纯净目录，直接覆盖安装；如果是混合目录（例如 `D:\百度盘\翻身(1)`），安装器只移除遗留的 `Uninstall Aerome.exe` 单文件，并把新版本安装到一个安全的 `Aerome` 子目录，不会触碰目录里的其它文件。

### 其它

- 上游 v1.1.1 同时附带作者的支持海报（`docs/SUPPORT.md` + `docs/assets/support/mineradio-author-support-poster.png`），这是上游作者个人的赞助渠道，**Aerome 派生版本不携带此文件**，仅同步与安全相关的代码改动。

## 二创 · 品牌重命名为 Aerome（未发布）

- 项目名 Mineradio → **Aerome**，独立维护仓库 https://github.com/Akilaea/Aerome
- `package.json` 改：`name=aerome`、`productName=Aerome`、`appId=com.aerome.desktop`、`executableName=Aerome`、`shortcutName=Aerome`、`artifactName=Aerome-${version}-Setup.${ext}`、`publish` 指向 Akilaea/Aerome、新增 `aerome.update` 配置块（保留 `mineradio.update` 向后兼容）
- `desktop/main.js` 改：`APP_NAME=Aerome`、`APP_USER_MODEL_ID=com.aerome.desktop`、Electron 分区 `persist:aerome-*`、IPC channel 前缀 `aerome-*`、窗口标题、PowerShell 内部 class 名保持不变（不影响用户）
- `build/after-pack.js` 改：rcedit 写入的 FileDescription / ProductName / CompanyName 全部改 Aerome
- `build/installer.nsh` 改：NSIS 内部变量、欢迎页文案、安装器品牌标识全改为 Aerome
- `server.js` 改：User-Agent 改 `Aerome/<version>`、release/installer artifact 命名改 `Aerome-*`、`patch type` 同时支持 `aerome-resource-patch` 和旧 `mineradio-resource-patch`、临时 patch 文件后缀改 `.aerome-patch`、beatmap 缓存目录改 `D:\AeromeCache\beatmaps`
- 环境变量：新增 `AEROME_*` 系列，**保留** `MINERADIO_*` 系列作为 fallback，平滑迁移
- 应用图标已替换（基于 `new.jpg` 重新生成的多尺寸 PNG + ICO，原图标备份到 `build/icon.*.original`）
- 文档全面更新：README、NOTICE、SECURITY、PRIVACY、本 CHANGELOG；保留原作者 XxHuberrr 的版权与 LICENSE，叠加 Akilaea 派生作品版权

## 二创 · B 站音源接入（未发布）

- 新增 B 站（bilibili）免登录音源：在 `server.js` 增加 `/api/bili/search`、`/api/bili/detail`、`/api/bili/audio`、`/api/bili/subtitle` 四个端点。
- 搜索结果取 B 站视频，标题自动清理 `<em class="keyword">` 高亮标签；`pic` 字段会补全为完整 https URL。
- 音频流走 DASH，按 bandwidth 取最高码率（通常是 192K mp4a），并附带 2 条备份流地址；通过现有 `/api/audio` 代理播放，自动带 `Referer: https://www.bilibili.com/`。
- 字幕走 B 站 player/v2，优先取中文字幕，转换为 `{from, to, content}` 行格式。多数音乐视频无字幕，返回空数组；后续桌面歌词接到 B 站时会做 best-effort 兼容。
- 启动时自动生成一份 buvid3/buvid_fp cookie 持久化到 `.bili-buvid`，避免触发 B 站搜索反爬。该文件仅是匿名设备标识，无登录信息。

## 二创安全基线（未发布）

- 本地 API 服务默认监听地址由 `0.0.0.0` 改为 `127.0.0.1`，默认不再暴露到局域网/外网。需要局域网访问时仍可通过 `HOST=0.0.0.0` 环境变量恢复旧行为。
- 收紧 CORS 策略：不再使用通配 `Access-Control-Allow-Origin: *`，改为只允许来源 host 为 `localhost` 或 `127.0.0.1` 的请求，避免恶意网页跨域调用本机 API。
- HTTP 服务入口统一处理 `OPTIONS` 预检，返回 204 并附带按 Origin 计算的 CORS 头。
- 静态资源服务增加显式 root 边界校验，作为路径穿越的防御纵深。

## v1.1.0

- 纯净安装发布版：从当前 `resources/app` 可信源码重新构建 1.1.0 安装包，旧打包产物、旧备份包和旧安装包不再作为发布来源。
- 重要安全说明：`v1.0.10` 及更早旧安装包不再建议继续安装或传播，请先隔离旧安装包；本次不提供从 `v1.0.10` 到 `v1.1.0` 的软件内本地更新，请到 GitHub Release 手动下载 `v1.1.0` 进行纯净安装。
- 默认视觉参数更新：将 `默认测试.json` 作为首次启动默认用户存档和软件内视觉参数默认值；新用户首次启动即使用同一份快照，用户存档中自动预置「默认测试」。
- 默认视觉快照包括：`emily` 视觉预设、封面粒子分辨率 `1.55`、电影镜头强度 `0.5`、歌词发光 `0.28`、高亮色 `#fac900`、发光色 `#008aff`、UI/Home/视觉图标白色、3D 歌单架静态常驻、播客歌单默认关闭、侧向角度 `-15`。
- 3D 歌单架新增内容开关：可关闭播客歌单，可选择是否把「我的歌单」与「收藏歌单」合并成一条连续滚动列表。
- 3D 歌单架交互修复：动态/静态详情页绑定分流，静态详情页跟随封面粒子世界轴，动态详情页跟随镜头；常驻歌单架未命中时不再长期挡歌词，命中卡片时才浮起到前景。
- 3D 歌单详情页修复：详情页打开后保持更完整的页面显示和中心高亮行；修复固定/常驻状态下详情页被歌词或卡片遮挡、动态镜头触发区异常、滚轮高亮不同步等问题。
- 歌词透明度修复：详情页选歌/切歌时新词不再突然跳亮；详情页打开时歌词保持可读，但降低发光层并保持在详情页下层，避免遮挡中心高亮行。
- 高级设置新增性能项：后台策略支持自动优化、保持运行、停止释放；画质档位支持低/中/高/超高；直播后台保持开启后不再进入低占用暂停。
- 用户存档修复：应用用户视觉存档后会提交播放态视觉预设，跳转歌曲、切歌不再回退到上一个视觉预设。
- 全屏/控制台修复：视觉预设热键按钮不再被全屏 DIY 悬浮入口遮挡；视觉控制台隐藏按钮会跟随一起隐藏，不再残留一个孤立标记。
- 更新 Electron / electron-builder 依赖，修复已知高风险构建依赖告警。
- 修复软件内更新失败后的循环体验：快速补丁失败后不再自动反复拉完整安装包，完整安装包下载完成后也不再自动打开，需用户手动确认。
- 更新下载会复用本地已校验通过的安装包，避免重复下载同一文件。

## v1.0.10

- 重做桌面歌词视觉与交互：保持软件内歌词质感，优化白底可读性、长歌词滚动、锁定穿透、电影震动与最小化状态一致性。
- 修复安魂预设歌词位置无法调整的问题，当前嘴部歌词原位置作为原点，景深改为按视角前后移动。
- 歌词布局新增上下角度与左右角度调节，并会随本地布局和用户存档保存。
- 歌词镜头绑定开启时避让右侧 3D 歌单架，安魂预设也同步处理，避免遮挡歌单架操作。
- 新增方向键上下调节音量，每次 5%，输入框和滑条聚焦时不会误触。
- 调整更新包规则：补丁包命名使用 `旧版本→新版本` 表达，且以后只为低于新版的最近 4 个版本生成快速补丁。

## v1.0.9

- 修复安装包深色界面中部分文字仍为黑色导致看不清的问题，安装器改为浅色高对比界面。
- 安装包支持用户自由选择安装目录；默认仍优先 `D:\Mineradio`，选择盘根目录时会自动补全 `Mineradio` 文件夹。
- 修复软件可重复打开的问题，重复启动时会聚焦当前已运行的窗口。
- 修复软件每次启动都会自动创建/刷新桌面快捷方式的问题。

## v1.0.8

- 修复 QQ 音乐登录后头像/昵称与播放授权状态不同步的问题，歌单能读但歌曲无法播放时会优先识别真实播放票据缺失。
- Home 左侧大卡片改为施工提示，并支持在 Home 页手动展开播放器控制台。
- 视觉预设顺序调整为 emily、安魂、星河、唱片、星球、滚筒、虚空；安魂十字架选中态保持同款蓝色。
- 视觉控制台新增 4 个槽位的“用户存档”，可保存粒子、颜色、滑条和歌词外观习惯，并支持卡片内直接命名。
- 修复重启后歌词预设/自定义颜色没有立即恢复到舞台歌词的问题。
- 播放与暂停增加音频淡入淡出，降低手动启停时的突兀感。

## v1.0.7

- 反正没什么人看，布想写日志了

## v1.0.6

- 反正没什么人看，布想写日志了

## v1.0.5

- 优化 GitHub 更新下载：默认优先尝试国内加速线路，失败后自动切换下一条线路，最后兜底 GitHub 直连。
- 更新弹窗新增下载速度、已下载大小、预计剩余时间、当前线路和线路尝试次数显示。
- 更新失败时保留具体失败原因和已尝试线路数量，方便用户判断是超时、DNS、HTTP、校验失败还是资源未同步。
- 下载完整安装包和快速补丁都会校验 release digest，避免镜像缓存异常导致坏包被应用。
- 修复旧版本快速补丁匹配过宽的问题，确保 `1.0.0`、`1.0.1`、`1.0.2`、`1.0.3` 只会匹配各自对应的补丁包。

## v1.0.4

- 优化最小化/隐藏窗口时的后台占用：只有真正最小化、不可见或文档隐藏时进入深度低占用；可见但失焦、副屏显示时保持正常帧率和电影镜头。
- 修复桌面全屏模式下 3D 视觉画布尺寸不同步导致的裁切/偏上问题；全屏、退出全屏和窗口 resize 后会连续刷新主渲染视口。
- 优化播放器控制台自动隐藏时的残影：隐藏状态不再保留玻璃背景、滤镜和阴影，同时保留显示时的原有玻璃质感。
- 视觉控制台新增“控制台玻璃色差”滑条，并给视觉控制台悬浮按钮增加贴边自动隐藏按钮。
- 左侧“我的歌单”详情页改为分批加载更多歌曲，放大“加载更多”按钮，详情头部支持滚动置顶和回到顶部。
- 沉浸模式恢复左侧歌单栏、3D 歌单架和默认封面渐变背景的可用性。

## v1.0.3

- 重构视觉预设控制台的信息结构，新增 `预设 / 外观 / 歌词 / 动态 / 高级` 五个分区，减少功能堆叠带来的操作压力。
- 优化色轮和封面取色面板的自适应定位，弹层会贴近触发按钮并限制在当前窗口内，降低不同分辨率下错位或越界的概率。
- 修复背景颜色状态混淆问题：纯黑色现在代表真正的黑色背景，封面渐变改为独立模式，控制台会明确显示“封面渐变”。
- 保留并优化根据专辑封面生成背景渐变的功能，避免点击默认时才触发、左侧色块却显示黑色的误导。

## v1.0.2

- Add collect-to-playlist and play-next actions to artist detail songs.
- Publish quick patches for `1.0.1 -> 1.0.2` and `1.0.0 -> 1.0.2`, plus a full installer for cross-version upgrades.

## v1.0.1

- Smooth Emily visual loading and track-change transitions.
- Remove the forced loading-state jump, shorten the Emily cover color mix, and fade cover depth in gradually.
- Publish a `1.0.0 -> 1.0.1` quick patch so installed users can receive an update prompt.

## v1.0.0

- 调整播放器控制台显隐规则：播放、切歌、天气电台开播不再主动弹出底部控制台；只有底部手柄/热区唤出时显示，鼠标移出热区后快速收起。
- 修复播放器控制台进度条不随播放推进的问题：进度条和时间显示现在会优先使用真实音频时长，并在浏览器暂未返回 duration 时使用歌曲 metadata 兜底。
- 修复网易云 / QQ 扫码成功但登录态不落地的问题：网易云不再因资料接口短暂无 profile 立刻清空 cookie，QQ 登录支持新式 `psrf_*` / `wx*` token。
- 修复播放/暂停按钮手动恢复播放失效：手动点击路径现在会在用户点击同步栈内先调用 `audio.play()`，再恢复音频分析器，避免错过浏览器用户激活窗口。
- 修复播放准备阶段的栈溢出会拖死控制台的问题：歌词预置、封面加载、喜欢状态、Home 状态、listen session 和 beatmap / DJ 视觉预热均改为隔离执行，任何非音频链路异常不再阻断真实切歌。
- `playQueueAt` 增加播放阶段日志；若后续仍出现异常，控制台会标明 `source-url`、`visual-prep`、`audio-start` 等阶段，界面不再直接弹出 `Maximum call stack size exceeded`。
- 单曲循环的 `ended` 回调改为异步再入，避免浏览器在音频结束事件中同步重进 `playQueueAt` 引发递归风险。
- 修复天气电台 / 歌单播放链路的控制台递归风险：不再运行时重写播放、上一首、下一首按钮的 `onclick`，避免 `Maximum call stack size exceeded`。
- 切歌开始时立即刷新队列高亮和迷你队列计数；即使浏览器拦截自动播放，标题、时长、队列当前项也保持同步。
- Home 天气电台主按钮和天气卡片统一到同一启动入口，并增加启动 busy 锁，避免重复点击并发开播。
- 修复右键唤起 3D 歌单架时误唤出播放器控制台：歌单架打开期间会硬隐藏底部控制台，并阻止热区/播放态 reveal。

- 隔离 3D 歌单架刷新/关闭异常：歌单 API 成功后不再因为 shelf 重建或 3D 详情列表绘制失败而误报“歌单加载失败”。
- 天气电台、歌单、播客、每日推荐和 3D 详情播放入口统一使用安全队列刷新；队列写入后播放器控制台会恢复可点击，不再被 UI 渲染异常拖死。
- 恢复歌单 / 天气电台自动开播为非 manual 路径，并将 `playQueueAt` 前置 UI 阶段纳入兜底，避免队列标题已变但实际音频和上下一首按钮停在旧状态。
- 天气电台音乐来源收窄为网易云搜索，并取消入队前批量播放 URL 探测，避免点击入口时请求堆积造成卡死。
- 天气电台前端复用正在进行的天气加载请求，避免 Home 后台预加载和手动启动同时打到后端。
- 自动播放被系统拦截时，播放器控制台保持可点击并提示手动继续；真正加载失败的队列项会自动跳到下一首。
- 手动下一首 / 上一首现在一定切换实际音频；单曲循环只在自然播完时重复当前曲。
- 切歌开始时立即暂停旧音频，避免出现歌词和 UI 已切走但旧歌还在播的错位。
- 修复天气电台城市经纬度缺失时落到 `(0,0)` 的问题，并在 Open-Meteo 超时/失败时返回临时电台队列。
- 歌单曲目加载增加 `playlist_track_all -> playlist_detail` 降级，减少歌单加载失败。
- 播放队列写入后强制恢复底部控制台可交互状态，避免天气电台或歌单开播后控制台残留不可点击。
- 启动页退出后补 Home 恢复安全网，避免首页隐藏在空场背景后。

- 发布 Mineradio 首个正式版本，GitHub 主页和安装包版本统一为 `1.0.0`。
- 首页正式版包含天气电台、每日推荐、私人电台、继续听、听歌画像和我的歌单入口。
- 天气电台接入 Open-Meteo，并优先混入每日推荐和私人推荐曲库，过滤 AI / 白噪音 / 雨声助眠等低质结果。
- 修复窗口模式下主页 6 张主卡片在紧凑尺寸中过早堆叠、挤出首屏的问题。
- 保持启动后 Wallpaper 银河背景干净显示，播放后切换到 Emily / 默认播放态视觉。

## v0.9.13

- 开场动画升级为 WebGL 光流线场，融合 `ShipSwiftAnimatedLoop` 的 RGB 分通道、Warp 流动和高亮线场质感。
- 移除刻意的环形/花瓣式爆点，改为更自然的斜向流线相位变化，让启动过程更帅气但不突兀。
- 开场动画播放完成后不再自动进入主页，会停留在“点击进入”状态；点击任意位置或按 Enter/空格后进入 Home。
- 保留 2D canvas fallback，WebGL 不可用时仍能显示启动页。
- 生成 `0.9.12 -> 0.9.13` 快速补丁，用于已安装用户轻量更新。

## v0.9.9

- 统一当前版本号为 `0.9.9`
- 接入 GitHub Releases 更新检测配置
- 增加更新弹窗与更新下载任务接口
- 增加 QQ 音乐与网易云音乐双平台体验方向
- 优化电影镜头节奏分析与 DJ 视觉模式
- 增加自定义封面、自定义歌词、歌词布局和视觉控制相关能力

## 说明

这是首次公开发布前的整理版本。更早版本属于本地迭代记录，暂不展开。
