import type { APIRoute } from 'astro';
import { SITE_URL } from '../consts';

export const GET: APIRoute = () => {
	const site = SITE_URL.replace(/\/$/, '');
	const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${site}/sitemap-index.xml
`;
	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
