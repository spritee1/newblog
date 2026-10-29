# MYBLOG

基于 [Firefly](https://github.com/CuteLeaf/Firefly)（Astro 7 + Tailwind + Svelte）的个人博客，内容存在 GitHub 仓库，构建成静态页面部署在 Cloudflare Workers，浏览器里通过 Sveltia CMS 写作。

- 站点：https://blog.qselery.cc.cd
- 后台：https://blog.qselery.cc.cd/admin/
- 仓库：https://github.com/spritee1/newblog

## 本地开发

```sh
pnpm install     # 需要 Node ≥ 22.23、pnpm 11
pnpm dev         # http://localhost:4321
pnpm build       # 构建到 dist/（含 Pagefind 索引、字体子集化等）
pnpm preview     # 预览构建产物
```

Firefly 的构建脚本比一般主题重（抓 GitHub 卡片数据、生成 LQIP 占位图、字体子集化、Pagefind 索引），需要联网，首次构建约 1~3 分钟。

## 写作

文章放在 `src/content/posts/`，一篇一个 Markdown，文件名决定 URL（`/posts/<文件名>/`）。

```yaml
---
title: 标题
published: 2026-10-28        # 必填，注意字段名不是 pubDate
updated: 2026-10-29          # 可选
description: 列表和 SEO 里显示的简介
tags: [建站, Astro]
category: 建站               # 可为空
image: /images/cover.webp    # 可选封面
draft: false
pinned: false
comment: true
---
```

图片放 `public/images/`，正文用 `/images/xxx.webp` 引用；后台上传会自动转 webp 并限制长边 2048px、体积 5MB。

## 站点配置

主题的所有配置集中在 `src/config/`：

| 文件 | 作用 |
| --- | --- |
| `siteConfig.ts` | 标题、副标题、域名、主题色、页面开关 |
| `profileConfig.ts` | 头像、名字、签名、社交链接 |
| `navBarConfig.ts` | 导航菜单 |
| `backgroundWallpaper.ts` | 壁纸、首页横幅文字、音乐/视频播放 |
| `announcementConfig.ts` | 侧边栏公告 |
| `commentConfig.ts` | 评论系统（Twikoo/Waline/Giscus/Artalk） |
| `FooterConfig.html` | 页脚 HTML |

站点头像在 `src/assets/images/avatar.avif`，换成自己的图后重新构建即可。

## 后台写作

访问 `/admin/`，用 **Access Token** 登录（Fine-grained token，只给本仓库 Contents: Read and write）。除文本外的一切提交都直接 commit 到 `main`，随后 GitHub Actions 自动构建并部署，1~3 分钟后线上生效。

## 构建与部署

推送到 `main` 会触发 `.github/workflows/deploy.yml`：

1. 安装依赖（pnpm 11）
2. `pnpm build`（Node 24）
3. `wrangler deploy` 到 Worker `qselery-blog`，绑自定义域名 `blog.qselery.cc.cd`

需要仓库 Secret `CLOUDFLARE_API_TOKEN`。手动部署：

```sh
pnpm build && pnpm exec wrangler deploy
```

## 旧地址

老站的文章路径 `/blog/<slug>/` 保留为跳转页（meta refresh + JS），指向新地址 `/posts/<slug>/`，文件在 `public/blog/`。

## 许可

主题代码来自 Firefly（MIT），保留其 `LICENSE`；模板设计来自 Fuwari。文章内容版权归作者。
