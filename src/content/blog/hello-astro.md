---
title: '开张：把五年前的博客重写一遍'
description: '从 CF-Blog 迁移到 Astro + Cloudflare Workers，顺便把评论、搜索、后台写作都补齐。'
pubDate: 2026-10-28
tags: ['建站', 'Astro', 'Cloudflare']
draft: false
---

2020 年那套 CF-Blog 还能跑，但我不想再修了。这次换了栈，顺手把之前欠的功能都补上：真 404、RSS、站内搜索、可管理的评论。

## 为什么重写

老方案是 Workers + KV 直接把 HTML 拼出来，边缘缓存，速度确实快。问题是：

- 所有未知路径都返回 `200` + 一行 404 文本，搜索引擎会当成正常页收录
- 文章不存在时 Worker 直接抛异常，Cloudflare 给用户一个 `error code: 1101`
- 没有 RSS，没有搜索，模板还挂在别人仓库的 raw 地址上
- 后台只有一个 Basic Auth 账号，密码明文写在代码里

这些不是配置问题，是当年设计时没考虑到的。

## 现在的结构

| 部分 | 选型 | 跑在哪 |
| --- | --- | --- |
| 页面生成 | Astro 静态输出 | 构建时 |
| 托管 | Workers 静态资源 | Cloudflare 边缘 |
| 内容 | Markdown + frontmatter | GitHub 仓库 |
| 评论 | Twikoo | Workers + D1 |
| 搜索 | Pagefind | 纯静态索引 |
| 写作后台 | Sveltia CMS | 浏览器里直接 commit |

```bash
# 本地跑起来
pnpm install
pnpm dev

# 构建（含搜索索引）
pnpm build

# 部署
pnpm run deploy
```

## 写作流程

平时两种方式都行：

1. 打开 `/admin/`，登录 GitHub，写 Markdown，点发布 —— 自动 commit
2. 本地新建 `src/content/blog/xxx.md`，写完 `git push`

两种方式最终都落在同一个目录，谁也不会覆盖谁。

> 评论数据在 D1 里，和代码仓库分开，换主题、换框架都不影响历史评论。

## 接下来

- 把旧文一篇篇补回来（能找到的）
- 给文章加封面图
- 看看要不要做英文版

先这样，能写就行。
