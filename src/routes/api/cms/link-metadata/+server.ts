import { json } from '@sveltejs/kit';
import { verifySession } from '$lib/auth/magic-link.js';
import { assertPublicUrl, UnsafeUrlError } from '$lib/server/safe-url.js';
import type { RequestHandler } from './$types';

const FETCH_TIMEOUT_MS = 8000;
// Enough for any sane <head>; we only ever read metadata out of it.
const MAX_BYTES = 512 * 1024;

function decodeEntities(value: string): string {
	return value
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();
}

function findMeta(html: string, patterns: RegExp[]): string | null {
	for (const pattern of patterns) {
		const match = html.match(pattern);
		if (match?.[1]) {
			const value = decodeEntities(match[1]);
			if (value) return value;
		}
	}
	return null;
}

/** Read at most MAX_BYTES so a huge or endless response cannot exhaust memory. */
async function readCapped(response: Response): Promise<string> {
	const reader = response.body?.getReader();
	if (!reader) return '';

	const decoder = new TextDecoder();
	let html = '';
	let total = 0;

	while (total < MAX_BYTES) {
		const { done, value } = await reader.read();
		if (done) break;
		total += value.length;
		html += decoder.decode(value, { stream: true });
		// Everything we want lives in <head>
		if (html.includes('</head>')) break;
	}
	await reader.cancel().catch(() => {});
	return html;
}

export const GET: RequestHandler = async ({ url, cookies }) => {
	const sessionToken = cookies.get('cms_session');
	if (!(await verifySession(sessionToken || ''))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const target = url.searchParams.get('url');
	if (!target) {
		return json({ error: 'A url parameter is required.' }, { status: 400 });
	}

	let safeUrl: URL;
	try {
		safeUrl = await assertPublicUrl(target);
	} catch (error) {
		if (error instanceof UnsafeUrlError) {
			return json({ error: error.message }, { status: 400 });
		}
		throw error;
	}

	try {
		const response = await fetch(safeUrl, {
			headers: {
				// Some sites serve a stub to unknown agents; be honest but recognisable
				'User-Agent': 'Mozilla/5.0 (compatible; ThomasFreemanCMS/1.0; +link-preview)',
				Accept: 'text/html,application/xhtml+xml'
			},
			redirect: 'follow',
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
		});

		if (!response.ok) {
			return json(
				{ error: `That page returned ${response.status}.`, url: safeUrl.toString() },
				{ status: 502 }
			);
		}

		const html = await readCapped(response);

		const title =
			findMeta(html, [
				/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
				/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
				/<title[^>]*>([\s\S]*?)<\/title>/i
			]) ?? safeUrl.hostname.replace(/^www\./, '');

		const description = findMeta(html, [
			/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
			/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
			/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i
		]);

		return json({
			url: safeUrl.toString(),
			title: title.slice(0, 200),
			description: description?.slice(0, 400) ?? '',
			siteName: safeUrl.hostname.replace(/^www\./, '')
		});
	} catch (error) {
		const timedOut = error instanceof Error && error.name === 'TimeoutError';
		return json(
			{ error: timedOut ? 'That page took too long to respond.' : 'Could not reach that page.' },
			{ status: 504 }
		);
	}
};
