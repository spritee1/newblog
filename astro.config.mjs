// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://qselery.cc.cd';

export default defineConfig({
	site,
	integrations: [
		mdx(),
		sitemap({
			// 搜索页和后台是 noindex，不放进 sitemap
			filter: (page) => !page.includes('/search/') && !page.includes('/admin/'),
		}),
	],
	markdown: {
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
			wrap: true,
		},
	},
});
