# Trove

Trove 是 [StarDash](https://github.com/boffti/stardash) 的 fork。它在你自己的机器上整理你加星的 GitHub 仓库。

StarDash 的版权人是 StarDash Contributors，年份是 2026，许可证是 MIT。声明在 [LICENSE](LICENSE)。Trove 保留这份声明。原项目仍然是 [boffti/stardash](https://github.com/boffti/stardash)。

## 这个 fork 改了什么

这个 fork 保留 StarDash 的星标列表、Radar、健康报告和 MCP 服务。改动在工作区。

- 界面有英文和简体中文。语言开关在侧栏。
- 仓库关系图把共享标签、合集或 topic 的星标连在一起。
- 工作区的布局和导航按这张图重做了。
- StarDash 发布的容器镜像是上游应用。运行 Trove 时，用本仓库的 Dockerfile 构建。

## 在本机运行

安装 Node.js 22.5 或更高版本，以及 pnpm。

```sh
pnpm install
pnpm dev
```

打开 http://localhost:3000 并连接 GitHub。第一个登录的账号拥有这个实例。

AI 功能需要配置模型服务。搜索和 Radar 不需要。变量写在 [.env.example](.env.example)。

## 用 Docker 运行

StarDash 在 GHCR 上的镜像是上游应用。这个仓库的 compose 文件用本地 Dockerfile 构建 Trove。

```sh
docker compose up --build -d
```

数据库文件是卷 `trove-data` 上的 `/data/trove.db`。如果旧版本把数据库放在 `/data/stardash.db`，而 `trove.db` 还不存在，服务第一次启动时会把旧文件改名。

旧 compose 项目使用的卷名是 `stardash-data`。那是另一个卷。还需要那些数据时，把数据库文件复制过来。

已经打开的浏览器需要重新登录，因为会话 cookie 的名字改了。主题和语言会回到默认值，因为浏览器里的本地存储键也改了。请重新生成 MCP 令牌。早前签发的令牌不能再通过校验。

## 许可证

MIT。Copyright (c) 2026 StarDash Contributors。全文在 [LICENSE](LICENSE)。
