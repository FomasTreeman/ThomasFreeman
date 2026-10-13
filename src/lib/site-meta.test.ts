import { describe, it, expect } from 'vitest';
import {
	DEFAULT_SITE_META,
	absoluteUrl,
	cleanSiteUrl,
	ogImageVersion,
	parseSiteMeta
} from './site-meta.js';

describe('parseSiteMeta', () => {
	it('returns the defaults when nothing is stored', () => {
		expect(parseSiteMeta(null)).toEqual(DEFAULT_SITE_META);
		expect(parseSiteMeta(undefined)).toEqual(DEFAULT_SITE_META);
		expect(parseSiteMeta('')).toEqual(DEFAULT_SITE_META);
	});

	it('returns the defaults for malformed JSON rather than throwing', () => {
		expect(parseSiteMeta('{not json')).toEqual(DEFAULT_SITE_META);
		expect(parseSiteMeta('"a string"')).toEqual(DEFAULT_SITE_META);
		expect(parseSiteMeta('null')).toEqual(DEFAULT_SITE_META);
	});

	it('reads every field from a complete entry', () => {
		const meta = parseSiteMeta(
			JSON.stringify({
				siteName: 'Tom Freeman',
				title: 'Tom Freeman — DevSecOps Engineer',
				description: 'DevSecOps engineer: CI/CD, cloud security and infrastructure as code.',
				siteUrl: 'https://me.fomastree.dev'
			})
		);
		expect(meta).toEqual({
			siteName: 'Tom Freeman',
			title: 'Tom Freeman — DevSecOps Engineer',
			description: 'DevSecOps engineer: CI/CD, cloud security and infrastructure as code.',
			siteUrl: 'https://me.fomastree.dev'
		});
	});

	it('falls back per field, so one blank field does not blank the rest', () => {
		const meta = parseSiteMeta(
			JSON.stringify({ title: 'Tom Freeman — DevSecOps', description: '   ' })
		);
		expect(meta.title).toBe('Tom Freeman — DevSecOps');
		expect(meta.description).toBe(DEFAULT_SITE_META.description);
		expect(meta.siteName).toBe(DEFAULT_SITE_META.siteName);
		expect(meta.siteUrl).toBe(DEFAULT_SITE_META.siteUrl);
	});

	it('ignores fields of the wrong type', () => {
		const meta = parseSiteMeta(JSON.stringify({ title: 42, description: ['x'], siteUrl: 7 }));
		expect(meta.title).toBe(DEFAULT_SITE_META.title);
		expect(meta.description).toBe(DEFAULT_SITE_META.description);
		expect(meta.siteUrl).toBe(DEFAULT_SITE_META.siteUrl);
	});

	it('collapses whitespace so head copy stays on one line', () => {
		const meta = parseSiteMeta(
			JSON.stringify({ description: '  DevSecOps.\n\n  Cloud   security. ' })
		);
		expect(meta.description).toBe('DevSecOps. Cloud security.');
	});

	it('keeps a stored entry from before siteUrl existed working', () => {
		// Entries saved by the first version of /cms/meta have no siteUrl
		const meta = parseSiteMeta(JSON.stringify({ title: 'T', description: 'D', siteName: 'S' }));
		expect(meta.siteUrl).toBe(DEFAULT_SITE_META.siteUrl);
	});

	it('does not leak the defaults object by reference', () => {
		const meta = parseSiteMeta(null);
		meta.title = 'changed';
		expect(DEFAULT_SITE_META.title).not.toBe('changed');
	});
});

describe('cleanSiteUrl', () => {
	it.each([
		['https://me.fomastree.dev', 'https://me.fomastree.dev'],
		['https://me.fomastree.dev/', 'https://me.fomastree.dev'],
		['  https://me.fomastree.dev/about?x=1#y ', 'https://me.fomastree.dev'],
		['me.fomastree.dev', 'https://me.fomastree.dev'],
		['me.fomastree.dev/', 'https://me.fomastree.dev'],
		['HTTPS://ME.FOMASTREE.DEV', 'https://me.fomastree.dev'],
		['https://thomas-freeman.vercel.app', 'https://thomas-freeman.vercel.app']
	])('normalises %s to %s', (input, expected) => {
		expect(cleanSiteUrl(input)).toBe(expected);
	});

	const rejected: [unknown, string][] = [
		['', 'empty'],
		['   ', 'blank'],
		['http://me.fomastree.dev', 'plain http'],
		['ftp://me.fomastree.dev', 'other scheme'],
		['https://localhost', 'no dot in the host'],
		['https://user:pw@me.fomastree.dev', 'credentials'],
		['not a url at all', 'spaces'],
		['https://', 'scheme only'],
		[42, 'not a string'],
		[null, 'null']
	];
	it.each(rejected)('rejects %s (%s)', (input) => {
		expect(cleanSiteUrl(input)).toBeUndefined();
	});
});

describe('ogImageVersion', () => {
	const base = {
		siteName: 'Tom Freeman',
		description: 'DevSecOps engineer.',
		siteUrl: 'https://me.fomastree.dev'
	};

	it('is stable for the same text', () => {
		expect(ogImageVersion(base)).toBe(ogImageVersion({ ...base }));
		expect(ogImageVersion(base)).toMatch(/^[0-9a-z]+$/);
	});

	it('changes when any text drawn on the card changes', () => {
		const v = ogImageVersion(base);
		expect(ogImageVersion({ ...base, siteName: 'Tom' })).not.toBe(v);
		expect(ogImageVersion({ ...base, description: 'Something else.' })).not.toBe(v);
		expect(ogImageVersion({ ...base, siteUrl: 'https://thomas-freeman.vercel.app' })).not.toBe(v);
	});
});

describe('absoluteUrl', () => {
	it('joins the origin and a path with exactly one slash', () => {
		const meta = { siteUrl: 'https://me.fomastree.dev' };
		expect(absoluteUrl(meta, '/sitemap.xml')).toBe('https://me.fomastree.dev/sitemap.xml');
		expect(absoluteUrl(meta, 'og-image.png')).toBe('https://me.fomastree.dev/og-image.png');
		expect(absoluteUrl(meta, '/')).toBe('https://me.fomastree.dev/');
	});
});
