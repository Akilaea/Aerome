# 发布流程

> 本文件已为 Aerome 派生作品更新。继承自上游 Mineradio v1.1.0 的发布边界依然适用。

## v1.1.0 发布边界（继承自上游）

- 基于 Mineradio v1.1.0 源码派生重打包，不复用上游旧 `dist/`、旧安装包、旧 `node_modules`、旧备份包或任何历史 packaged build。
- 不生成从上游旧版本到 Aerome 的快速补丁。
- GitHub Release 需要明确标注：本仓库是 Mineradio 的 GPL-3.0 派生作品。
- 安装包样式沿用 `docs/INSTALLER_STYLE.md` 的中文极简黑白蓝格式。

## 发布前检查

- 确认 `package.json` 和 `package-lock.json` 版本号正确。
- 确认 `aerome.update.owner/repo` 指向 Akilaea/Aerome（旧 `mineradio.update` 字段也保留兼容读取）。
- 确认 `.cookie`、`.qq-cookie`、`.bili-buvid`、`updates/`、`node_modules/`、旧 `dist/` 没有进入 git。
- 运行语法检查：`git diff --check`、`node --check server.js`、`node --check desktop/main.js`、`node --check build/after-pack.js`、前端内联脚本解析。
- 运行 Git 跟踪风险残留检查，确认没有跟踪 `.exe/.dll/.scr/.bat/.cmd/.ps1/.vbs/.jse/.wsf/.hta/.xlsm` 等可执行/脚本残留。
- 从当前源码执行 `npm run build:win` 生成 Windows 安装包。
- 对新生成的安装包和当前源码执行安全扫描。
- 生成并记录新安装包 SHA256。

## GitHub Release

Release tag：

```text
v1.1.0
```

Release 标题：

```text
Aerome v1.1.0 — 基于 Mineradio 的 GPL-3.0 派生作品
```

Release 正文必须包含：

- 派生作品声明（指向 https://github.com/XxHuberrr/Mineradio ）
- Akilaea 维护说明
- 改动摘要（B 站音源、安全基线收紧、品牌重命名）
- GPL-3.0 协议链接

建议上传资产：

- `dist/Aerome-1.1.0-Setup.exe`
- `dist/Aerome-1.1.0-Setup.exe.blockmap`
- `dist/Aerome-1.1.0-SHA256SUMS.txt`

## 更新检测

应用会请求 GitHub Releases latest。

本地验证更新链路时，可以用临时 manifest：

```json
{
  "latestVersion": "1.1.0-test",
  "release": {
    "name": "Aerome v1.1.0-test",
    "downloadUrl": "http://127.0.0.1:3144/Aerome-1.1.0-Setup.exe",
    "notes": ["本地在线更新链路测试"]
  }
}
```
