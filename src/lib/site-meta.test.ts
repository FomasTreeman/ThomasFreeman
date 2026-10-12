import { describe, it, expect } from 'vitest';
import { DEFAULT_SITE_META, parseSiteMeta } from './site-meta.js';

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
				description: 'DevSecOps engineer: CI/CD, cloud security and infrastructure as code.'
			})
		);
		expect(meta).toEqual({
			siteName: 'Tom Freeman',
			title: 'Tom Freeman — DevSecOps Engineer',
			description: 'DevSecOps engineer: CI/CD, cloud security and infrastructure as code.'
		});
	});

	it('falls back per field, so one blank field does not blank the rest', () => {
		const meta = parseSiteMeta(
			JSON.stringify({ title: 'Tom Freeman — DevSecOps', description: '   ' })
		);
		expect(meta.title).toBe('Tom Freeman — DevSecOps');
		expect(meta.description).toBe(DEFAULT_SITE_META.description);
		expect(meta.siteName).toBe(DEFAULT_SITE_META.siteName);
	});

	it('ignores fields of the wrong type', () => {
		const meta = parseSiteMeta(JSON.stringify({ title: 42, description: ['x'] }));
		expect(meta.title).toBe(DEFAULT_SITE_META.title);
		expect(meta.description).toBe(DEFAULT_SITE_META.description);
	});

	it('collapses whitespace so head copy stays on one line', () => {
		const meta = parseSiteMeta(
			JSON.stringify({ description: '  DevSecOps.\n\n  Cloud   security. ' })
		);
		expect(meta.description).toBe('DevSecOps. Cloud security.');
	});

	it('does not leak the defaults object by reference', () => {
		const meta = parseSiteMeta(null);
		meta.title = 'changed';
		expect(DEFAULT_SITE_META.title).not.toBe('changed');
	});
});
