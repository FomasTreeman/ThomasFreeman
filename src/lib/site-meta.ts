/**
 * Site-wide metadata: the <title> of the home page, the description search
 * engines show, and the Open Graph / Twitter card copy that every page shares.
 *
 * Stored in the `content` table under `site.meta` as JSON and edited at
 * /cms/meta, so a change of role or focus does not need a deploy. The fields
 * here are the ones that read as copy; URLs and image dimensions stay in code.
 */

/** Public origin of the deployed site, with no trailing slash. */
export const SITE_URL = 'https://thomas-freeman.vercel.app';

export interface SiteMeta {
	/** og:site_name, and the suffix other pages use in their titles */
	siteName: string;
	/** Home page <title>, og:title, twitter:title and the social image alt */
	title: string;
	/** meta description, og:description and twitter:description */
	description: string;
}

export const DEFAULT_SITE_META: SiteMeta = {
	siteName: 'Tom Freeman',
	title: 'Tom Freeman — Full Stack Developer',
	description: 'Full stack developer working in TypeScript, Svelte and BSV blockchain.'
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
		description: cleanString(record.description) ?? DEFAULT_SITE_META.description
	};
}
