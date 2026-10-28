# MYBLOG：Astro + Cloudflare Workers

从 2020 年的 CF-Blog（Workers + KV 拼 HTML）迁移过来的静态博客。页面在构建时生成，部署到 Cloudflare Workers 的静态资源上；内容用 Markdown 存在 Git 里；评论跑在 Twikoo（Workers + D1）；搜索用 Pagefind，构建时生成索引，不依赖任何后端。

- 技术栈：Astro 7 / TypeScript / Pagefind / Twikoo / Sveltia CMS / Wrangler 4
- 运行时要求：Node.js ≥ 22.12、pnpm

## 目录结构

```text
site/
├── public/
│   ├── admin/            # Sveltia CMS 后台入口（/admin/）
│   ├── images/           # 后台上传的图片落到这里
│   └── favicon.*
├── src/
│   ├── components/       # Header / Footer / PostCard / TwikooComments
│   ├── content/blog/     # 文章（Markdown / MDX）
│   ├── layouts/          # BaseLayout：SEO、OG、JSON-LD、深浅色
│   ├── pages/            # 路由：首页、文章、标签、归档、关于、搜索、404、RSS、robots
│   ├── styles/global.css # 全站样式
│   ├── consts.ts         # 站点信息、导航、评论地址
│   ├── content.config.ts # frontmatter 校验
│   └── utils/format.ts   # 日期、阅读时长、标签 slug
├── astro.config.mjs
├── wrangler.jsonc        # Workers 静态资源部署配置
└── package.json
```

## 本地开发

```sh
pnpm install
pnpm dev          # http://localhost:4321
```

`pnpm dev` 没有 Pagefind 索引，`/search/` 会提示先构建；这是预期行为。

构建并预览生产产物：

```sh
pnpm build        # astro build + pagefind 索引，产物在 dist/
pnpm preview      # http://localhost:4321，搜索可用
```

类型检查：

```sh
pnpm check
```

## 写作

文章放在 `src/content/blog/`，文件名就是 URL：`hello-astro.md` → `/blog/hello-astro/`。

```yaml
---
title: '标题'
description: '一到两句话的摘要，用于列表和 SEO'
pubDate: 2026-10-28
updatedDate: 2026-11-02   # 可选
tags: ['建站', 'Astro']
category: '折腾'          # 可选，目前只做展示
cover: '/images/cover.jpg' # 可选
draft: false              # true 时不出现在列表/RSS/sitemap
---

正文用 Markdown / MDX。
```

图片放 `public/images/`，正文里用 `/images/xxx.jpg` 引用。

## 浏览器后台（Sveltia CMS）

访问 `https://你的域名/admin/`。后台通过 GitHub API 直接读写仓库里的 Markdown，提交后重新构建即生效。

先改 `public/admin/config.yml` 三处：

1. `backend.repo` → 你的仓库，如 `yourname/my-blog`
2. `site_url` / `display_url` → 正式域名
3. 登录方式二选一（见下）

### 方式 A：个人访问令牌（推荐单人写作）

不需要额外部署任何东西。在 GitHub 生成一个 Fine-grained token，权限只给目标仓库的 **Contents: Read and write**，然后在 `/admin/` 登录页选 “Sign in with Access Token” 粘贴即可。令牌存在浏览器本地。

### 方式 B：OAuth 登录（多人写作）

1. 部署 [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) 到 Workers（仓库里的 Deploy 按钮或 `wrangler deploy`）。
2. 在 GitHub 建 OAuth App，回调地址填 `https://<你的-auth-worker>.workers.dev/callback`。
3. 给这个 Worker 配环境变量 `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`，建议再加 `ALLOWED_DOMAINS=你的域名`。
4. 把 Worker 地址写进 `config.yml` 的 `backend.base_url`。

## 评论（Twikoo）

评论默认关闭（`TWIKOO_URL` 为空就不渲染评论区）。要开启：

1. 克隆 [twikoo-cloudflare](https://github.com/twikoojs/twikoo-cloudflare)，按 README 安装依赖，并把超出 Workers 体积限制的包置空。
2. `npx wrangler d1 create twikoo`，把 `database_name` / `database_id` 填进它的 `wrangler.toml`，再执行 `npx wrangler d1 execute twikoo --remote --file=./schema.sql` 建表。
3. `npx wrangler r2 bucket create twikoo`（可选，用于评论图片），更新 `R2_PUBLIC_URL`。
4. `npx wrangler deploy --minify`，得到形如 `https://twikoo-cloudflare.xxx.workers.dev` 的地址。
5. 把地址填进 `src/consts.ts` 的 `TWIKOO_URL`（要带 `https://`），重新构建部署。

## 部署到 Cloudflare Workers

```sh
pnpm exec wrangler login          # 只需一次
SITE_URL=https://你的域名 pnpm deploy
```

`pnpm deploy` = `pnpm build && wrangler deploy`，会把 `dist/` 作为静态资源上传。`wrangler.jsonc` 里的 `name`（当前 `my-blog`）决定 Worker 名称，可自行修改。

`SITE_URL` 很重要：它决定 canonical、Open Graph、sitemap 和 RSS 里的绝对地址。改了域名一定要带新值重新构建，否则搜索引擎会拿到旧域名。

绑定自定义域名：Cloudflare 控制台 → Workers & Pages → 选中这个 Worker → Settings → Domains & Routes → Add → Custom domain。域名托管在 Cloudflare 时只需要点几下，证书自动签发。

其他说明：

- 未知路径返回真正的 404（`not_found_handling: "404-page"` + `src/pages/404.astro`），不再是老版本的软 404。
- `/admin/` 在 `robots.txt` 里被禁止收录。
- 想接 CI，可以在 GitHub Actions 里跑 `pnpm build` + `cloudflare/wrangler-action`，用 `CLOUDFLARE_API_TOKEN` 部署；纯手工 `pnpm deploy` 也够用。

## 上线检查清单

- [ ] `src/consts.ts`：站点名、描述、作者改成自己的
- [ ] `SITE_URL` 用正式域名构建
- [ ] `public/admin/config.yml`：仓库、域名、登录方式
- [ ] Twikoo 部署完并填入 `TWIKOO_URL`（不打算开评论就跳过）
- [ ] 部署后访问 `/`、`/blog/`、一篇文章、`/search/?q=关键词`、随便一个不存在的路径
- [ ] 提交一次后台文章，确认 GitHub 上有 commit、站点重新构建后能看到

## 常见问题

**搜索搜不到刚发的文章？** 索引是构建时生成的，需要重新 `pnpm build` 并部署。

**中文搜索效果一般？** Pagefind 对中文按词切分，没有词干还原；搜两三个字的词比搜整句准。

**部署后页面里的链接还是 `blog.example.com`？** 构建时没传 `SITE_URL`，带上环境变量重新构建。

**后台登录 404 / 报 OAuth 错误？** 检查 `config.yml` 的 `base_url` 是否和实际 Worker 地址一致，以及 GitHub OAuth App 的回调地址是否为 `<worker>/callback`。
