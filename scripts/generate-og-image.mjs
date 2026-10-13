/**
 * Renders static/og-image.png, the 1200x630 card social platforms show when the
 * site is shared. Kept as a script so the image can be regenerated when the
 * name, role or palette changes.
 *
 *   node scripts/generate-og-image.mjs
 *
 * The tagline and the eyebrow hostname are the published `site.meta`
 * description and siteUrl (edited at /cms/meta) when TURSO_DATABASE_URL and
 * TURSO_AUTH_TOKEN are set in the environment or .env; otherwise the built-in
 * defaults. Pass a string as the first argument to override the tagline
 * either way.
 */
import { chromium } from '@playwright/test';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

config();

const OUTPUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'static', 'og-image.png');
const NAME = 'Tom Freeman';
// Mirror DEFAULT_SITE_META in src/lib/site-meta.ts (this file is plain JS, so
// it cannot import the TypeScript constants).
const DEFAULT_HOST = 'thomas-freeman.vercel.app';
const DEFAULT_TAGLINE = 'Full stack developer working in TypeScript, Svelte and BSV blockchain.';

/** The published site.meta row, or {} when there is no database or no row. */
async function publishedMeta() {
	const url = process.env.TURSO_DATABASE_URL;
	const authToken = process.env.TURSO_AUTH_TOKEN;
	if (!url || !authToken) return {};

	const { createClient } = await import('@libsql/client');
	const db = createClient({ url, authToken });
	const result = await db.execute({
		sql: 'SELECT value FROM content WHERE key = ? AND is_draft = 0',
		args: ['site.meta']
	});
	const raw = result.rows[0]?.value;
	if (typeof raw !== 'string') return {};

	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch {
		return {};
	}
}

function hostOf(siteUrl) {
	if (typeof siteUrl !== 'string' || !siteUrl.trim()) return null;
	try {
		return new URL(siteUrl).host;
	} catch {
		return null;
	}
}

function escapeHtml(text) {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

const published = await publishedMeta();
const tagline =
	process.argv[2] ||
	(typeof published.description === 'string' && published.description.trim()) ||
	DEFAULT_TAGLINE;
const siteHost = hostOf(published.siteUrl) || DEFAULT_HOST;

const html = `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<style>
			* { margin: 0; padding: 0; box-sizing: border-box; }
			body {
				width: 1200px;
				height: 630px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				gap: 1.5rem;
				padding: 5rem;
				background:
					radial-gradient(50rem 30rem at 12% 8%, rgba(255, 139, 0, 0.5), transparent 65%),
					radial-gradient(45rem 32rem at 92% 96%, rgba(0, 121, 255, 0.45), transparent 65%),
					#1a1a1a;
				color: #fff;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
			}
			.eyebrow {
				font-family: ui-monospace, 'SF Mono', Menlo, monospace;
				font-size: 1.65rem;
				letter-spacing: 0.22em;
				text-transform: uppercase;
				color: #ffb545;
			}
			h1 { font-size: 6rem; font-weight: 800; line-height: 1; letter-spacing: -0.02em; }
			p { font-size: 2.35rem; font-weight: 500; opacity: 0.82; max-width: 26ch; line-height: 1.3; }
			.rule {
				width: 9rem;
				height: 0.6rem;
				border-radius: 999px;
				background: linear-gradient(135deg, #ff8b00, #f9dc00);
			}
		</style>
	</head>
	<body>
		<div class="eyebrow">${escapeHtml(siteHost)}</div>
		<h1>${escapeHtml(NAME)}</h1>
		<div class="rule"></div>
		<p>${escapeHtml(tagline)}</p>
	</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: OUTPUT });
await browser.close();

console.log(`Wrote ${OUTPUT}`);
console.log(`Host: ${siteHost}`);
console.log(`Tagline: ${tagline}`);
