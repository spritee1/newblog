# 关于

你好，我是 **Qselery**。这里放一些折腾记录、小作品，以及偶尔想清楚的事。

## 这个站是怎么来的

2020 年我在 Cloudflare Workers + KV 上搭过一个不用服务器的博客（CF-Blog），页面全量边缘缓存，速度接近静态站，内容又能像 WordPress 一样在线写。

但它毕竟是五年前的架构：软 404、没有 RSS、模板每次请求都去 GitHub 拉取、后台只有一个明文密码。所以 2026 年重写了一遍，现在这套：

- **Astro** 生成静态页面，部署在 Cloudflare Workers 上
- **Markdown** 写内容，存在 GitHub 仓库，可回滚、可本地预览
- **Sveltia CMS** 提供浏览器写作后台（`/admin/`），改完直接 commit 回仓库
- **Twikoo** 预留了评论位（配置后启用）
- **Pagefind** 做站内搜索，构建时生成索引

## 主题

页面主题是 [Firefly](https://github.com/CuteLeaf/Firefly)（MIT），基于 [Fuwari](https://github.com/saicaca/fuwari) 二次开发，感谢作者。

## 联系

想聊什么，直接在文章下面留言（评论开启后），或者去 [GitHub](https://github.com/spritee1) 找我。
