// 全站配置：改这里就够了
export const SITE_TITLE = 'MYBLOG';
export const SITE_DESCRIPTION = '记录折腾、作品和一些想清楚的事。';
export const SITE_AUTHOR = 'Qselery';
// 部署后把这里改成你的正式域名（不带结尾斜杠），会影响 canonical / OG / sitemap / RSS
export const SITE_URL = import.meta.env.SITE || 'https://blog.qselery.cc.cd';

// 评论系统：填 Twikoo 服务端地址（部署 twikoo-cloudflare 后拿到的 workers.dev 或自定义域名）
// 留空则整块评论区不渲染
export const TWIKOO_URL = '';

// 导航
export const NAV = [
	{ href: '/', label: '首页' },
	{ href: '/blog/', label: '文章' },
	{ href: '/tags/', label: '标签' },
	{ href: '/archive/', label: '归档' },
	{ href: '/about/', label: '关于' },
];
