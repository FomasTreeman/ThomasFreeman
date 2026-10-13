import { getContent } from '$lib/db/content.js';
import { SITE_META_KEY } from '$lib/constants/content-keys.js';
import { absoluteUrl, parseSiteMeta } from '$lib/site-meta.js';
import type { RequestHandler } from './$types';

/**
 * robots.txt used to be a static file, but its Sitemap line names the site's
 * public address, which is now CMS content (`site.meta`, edited at /cms/meta).
 */
export const GET: RequestHandler = async ({ setHeaders }) => {
	let meta = parseSiteMeta(null);
	try {
		meta = parseSiteMeta(await getContent(SITE_META_KEY));
	} catch (error) {
		console.error('robots.txt: failed to read site meta:', error);
	}

	setHeaders({ 'Cache-Control': 'max-age=0, s-maxage=3600' });

	const lines = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /cms',
		'Disallow: /api',
		'',
		`Sitemap: ${absoluteUrl(meta, '/sitemap.xml')}`,
		''
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
