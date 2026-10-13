import { getContent } from '$lib/db/content.js';
import { verifySession } from '$lib/auth/magic-link.js';
import { SITE_META_KEY } from '$lib/constants/content-keys.js';
import { cleanSiteUrl, parseSiteMeta } from '$lib/site-meta.js';
import { renderOgCard, type OgCardText } from '$lib/server/og-card.js';
import type { RequestHandler } from './$types';

/**
 * The social card, drawn from the published `site.meta` (see og-card.ts).
 *
 * The layout links it as /og-image.png?v=<hash of the text>, so a change of
 * copy gives the card a new URL and platforms that cache images by URL fetch
 * the new one. The query is only a cache key; the image is always current.
 *
 * A logged-in admin may instead pass the card's fields as query parameters,
 * which is how /cms/meta previews unsaved edits. Anonymous requests ignore
 * them, so nobody can use this endpoint to render arbitrary text.
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
	let meta = parseSiteMeta(null);
	try {
		meta = parseSiteMeta(await getContent(SITE_META_KEY));
	} catch (error) {
		console.error('og-image: failed to read site meta:', error);
	}

	let text: OgCardText = meta;
	let preview = false;

	const wantsPreview = ['siteName', 'description', 'siteUrl'].some((k) => url.searchParams.has(k));
	if (wantsPreview && (await verifySession(cookies.get('cms_session') || ''))) {
		preview = true;
		const param = (key: string) => url.searchParams.get(key)?.replace(/\s+/g, ' ').trim();
		text = {
			siteName: param('siteName')?.slice(0, 60) || meta.siteName,
			description: param('description')?.slice(0, 300) || meta.description,
			siteUrl: cleanSiteUrl(url.searchParams.get('siteUrl')) ?? meta.siteUrl
		};
	}

	try {
		const png = await renderOgCard(text);
		return new Response(new Uint8Array(png), {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': preview
					? 'private, no-store'
					: // Shared cache for an hour, then serve stale while re-rendering
						'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
			}
		});
	} catch (error) {
		console.error('og-image: render failed:', error);
		return new Response('Could not render the social card', { status: 500 });
	}
};
