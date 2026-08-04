import { getContent } from '$lib/db/content.js';
import { PROJECTS_KEY } from '$lib/constants/content-keys.js';
import PINNED from '$lib/utils/repos.js';
import type { RequestHandler } from './$types';

const SITE = 'https://thomas-freeman.vercel.app';

// Static routes worth indexing. /cms and /api are excluded here and in robots.txt.
const STATIC_PATHS = ['/', '/resources', '/blogs', '/play'];

function urlEntry(path: string, priority: string): string {
	return `	<url>\n		<loc>${SITE}${path}</loc>\n		<priority>${priority}</priority>\n	</url>`;
}

export const GET: RequestHandler = async ({ setHeaders }) => {
	let projectNames = Object.keys(PINNED);

	try {
		const raw = await getContent(PROJECTS_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed) && parsed.length > 0) {
				projectNames = parsed.map((p) => p?.name).filter(Boolean);
			}
		}
	} catch (error) {
		// Fall back to the pinned list rather than serving no sitemap at all
		console.error('sitemap: failed to read projects config:', error);
	}

	const entries = [
		...STATIC_PATHS.map((path) => urlEntry(path, path === '/' ? '1.0' : '0.7')),
		...projectNames.map((name) => urlEntry(`/repo/${encodeURIComponent(name)}`, '0.6'))
	];

	setHeaders({ 'Cache-Control': 'max-age=0, s-maxage=3600' });

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
};
