# Security Policy

## Supported Versions

当前只维护最新公开版本。

## Local Service Boundary

Aerome 的本地 API 服务默认只监听 `127.0.0.1`，不接受局域网或外网直连：

- 默认 `HOST=127.0.0.1`，仅本机回环可访问。
- CORS 仅允许来源为 `localhost` / `127.0.0.1` 的请求；其他来源的浏览器跨域调用会被拒绝。
- 静态资源服务对请求路径做了 root 边界校验，路径穿越尝试会被 404。

如果显式需要把服务暴露给局域网（例如家庭媒体场景），可在启动前设置环境变量 `HOST=0.0.0.0`，但此时请确保网络环境可信，并自行承担相应风险。

## Installer Safety Notice

继承自上游的安全说明：上游 `v1.0.10` 及更早旧安装包不再建议继续安装或传播。请只使用 Aerome 仓库的 GitHub Release 安装包（基于上游 v1.1.0 派生重打包）。

## Reporting a Vulnerability

如果你发现安全问题，请通过 GitHub Issues 或仓库作者主页联系作者。

请不要在公开 Issue 中直接贴出 Cookie、Token、账号信息、私密链接或可复现的敏感数据。

## Sensitive Data

Aerome 不应收集或上传用户 Cookie。用户登录状态应保存在本地用户数据目录中。

如果你要提交问题反馈，请先确认没有附带：

- `.cookie`
- `.qq-cookie`
- `.bili-buvid`
- 本地音乐文件
- 用户账号截图
- 调试日志中的 Cookie、Token 或隐私路径
