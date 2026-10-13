/**
 * Site-wide metadata: the <title> of the home page, the description search
 * engines show, the Open Graph / Twitter card copy that every page shares,
 * and the public address the site calls itself.
 *
 * Stored in the `content` table under `site.meta` as JSON and edited at
 * /cms/meta, so a change of role, focus or domain does not need a deploy.
 */

/**
 * Default public origin of the site, no trailing slash. The live value is
 * `siteUrl` in the CMS; this is only what a fresh database falls back to.
 */
export const SITE_URL = 'https://thomas-freeman.vercel.app';

export interface SiteMeta {
	/** og:site_name, and the suffix other pages use in their titles */
	siteName: string;
	/** Home page <title>, og:title, twitter:title and the social image alt */
	title: string;
	/** meta description, og:description and twitter:description */
	description: string;
	/**
	 * Primary public origin (`https://host`, no path). Used for the canonical
	 * link, og:url, the og:image address, the sitemap and robots.txt. Vercel
	 * serves the site on several hostnames; this says which one counts.
	 */
	siteUrl: string;
}

export const DEFAULT_SITE_META: SiteMeta = {
	siteName: 'Tom Freeman',
	title: 'Tom Freeman — Full Stack Developer',
	description: 'Full stack developer working in TypeScript, Svelte and BSV blockchain.',
	siteUrl: SITE_URL
};

/** Rough limits above which platforms truncate. Guidance for the editor, not enforced. */
export const SITE_META_LIMITS = {
	title: 60,
	description: 160
} as const;

function cleanString(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	// Head copy is a single line. Collapse stray newlines/tabs from the editor.
	const trimmed = value.replace(/\s+/g, ' ').trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Reduce a typed site address to a bare https origin, or undefined when it is
 * not one. Accepts a missing scheme and ignores any path, query or fragment,
 * so "me.example.dev/" and "https://me.example.dev/about?x" both become
 * "https://me.example.dev". Only https is accepted: the canonical address of
 * a public site is never plain http, and a typo here would poison every
 * canonical and social link.
 */
export function cleanSiteUrl(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	if (!trimmed) return undefined;

	const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
	let url: URL;
	try {
		url = new URL(withScheme);
	} catch {
		return undefined;
	}

	if (url.protocol !== 'https:') return undefined;
	if (url.username || url.password) return undefined;
	// A bare hostname needs at least one dot; "localhost" is not a public site
	if (!url.hostname.includes('.')) return undefined;

	return url.origin;
}

/**
 * Parse the stored `site.meta` value. Every field falls back to its default on
 * its own, so a missing or malformed entry can never leave the head empty.
 */
export function parseSiteMeta(raw: string | null | undefined): SiteMeta {
	if (!raw) return { ...DEFAULT_SITE_META };

	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		console.error('Malformed JSON in site.meta; falling back to defaults');
		return { ...DEFAULT_SITE_META };
	}

	if (typeof parsed !== 'object' || parsed === null) return { ...DEFAULT_SITE_META };
	const record = parsed as Record<string, unknown>;

	return {
		siteName: cleanString(record.siteName) ?? DEFAULT_SITE_META.siteName,
		title: cleanString(record.title) ?? DEFAULT_SITE_META.title,
		description: cleanString(record.description) ?? DEFAULT_SITE_META.description,
		siteUrl: cleanSiteUrl(record.siteUrl) ?? DEFAULT_SITE_META.siteUrl
	};
}

/**
 * Short, stable fingerprint of the text drawn on the social card. Appended to
 * the og:image URL so that platforms which cache images by URL (LinkedIn,
 * Slack, X) fetch a fresh card whenever the copy changes. FNV-1a, 32-bit.
 */
export function ogImageVersion(
	meta: Pick<SiteMeta, 'siteName' | 'description' | 'siteUrl'>
): string {
	const input = `${meta.siteName}\n${meta.description}\n${meta.siteUrl}`;
	let hash = 0x811c9dc5;
	for (let i = 0; i < input.length; i++) {
		hash ^= input.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(36);
}

/** Absolute URL for a site path, e.g. absoluteUrl(meta, '/sitemap.xml'). */
export function absoluteUrl(meta: Pick<SiteMeta, 'siteUrl'>, path: string): string {
	return `${meta.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
