---
title: Markdown 排版测试
published: 2026-10-20
description: 把标题、列表、代码、表格、引用都过一遍，方便检查主题样式。
tags: [测试, Markdown]
category: 测试
---

这是一篇用来检查排版的样例文章。发布前可以删掉，也可以留作参考。

## 二级标题

正文段落。中文排版里我用了 1.85 的行高，17px 字号，长段落读起来不累。**加粗**、*斜体*、`行内代码`、[链接](https://astro.build)、~~删除线~~ 都在这里。

### 三级标题

无序列表：

- 第一项
- 第二项，带一点说明文字，测试换行后的行距
- 第三项
  - 嵌套项
  - 另一个嵌套项

有序列表：

1. 先装依赖
2. 再跑构建
3. 最后部署

## 代码块

```ts
interface Post {
	title: string;
	pubDate: Date;
	tags?: string[];
}

export function sortByDate(posts: Post[]): Post[] {
	return [...posts].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
```

```bash
pnpm build && wrangler deploy
```

## 表格

| 方案 | 维护成本 | 适合场景 |
| --- | --- | --- |
| Astro 静态站 | 低 | 个人博客、文档 |
| Workers + KV | 中 | 需要在线后台且不想上服务器 |
| 传统 WordPress | 高 | 多作者、插件生态 |

## 引用

> 内容进 Git 最大的好处不是版本控制，是「随时可以换掉整个渲染层而不丢东西」。

## 分隔线与长内容

---

最后一段，用来测试文章底部和评论区的间距。

- [x] 检查代码块深色模式
- [x] 检查表格横向滚动
- [ ] 补一张封面图
