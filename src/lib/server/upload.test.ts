import { describe, it, expect } from 'vitest';
import { isRepoImagePath, sanitiseFileName } from './upload.js';

describe('sanitiseFileName', () => {
	it('keeps an ordinary filename intact', () => {
		expect(sanitiseFileName('my-project.webp')).toBe('my-project.webp');
	});

	it.each([
		['../../etc/passwd', 'passwd'],
		['..\\..\\windows\\system32', 'system32'],
		['/absolute/path/img.png', 'img.png'],
		['....//evil.png', 'evil.png']
	])('strips traversal from %s', (input, expected) => {
		expect(sanitiseFileName(input)).toBe(expected);
	});

	it('never returns a value containing a path separator', () => {
		for (const input of ['a/b', 'a\\b', '../x', './y']) {
			const result = sanitiseFileName(input);
			expect(result).not.toContain('/');
			expect(result).not.toContain('\\');
		}
	});

	it('falls back when nothing usable survives', () => {
		expect(sanitiseFileName('../')).toBe('upload');
		expect(sanitiseFileName('')).toBe('upload');
	});

	it('replaces characters outside the safe set', () => {
		expect(sanitiseFileName('my file (1).png')).toBe('my-file-1-.png');
	});
});

describe('isRepoImagePath', () => {
	it('accepts a plain repo image path', () => {
		expect(isRepoImagePath('repos/card.webp')).toBe(true);
	});

	it.each([
		['card.webp', 'missing prefix'],
		['repos/', 'empty filename'],
		['repos/nested/card.webp', 'nested path'],
		['repos/../secret.json', 'traversal'],
		['other/card.webp', 'different prefix'],
		['reposcard.webp', 'prefix not a directory']
	])('rejects %s (%s)', (pathname) => {
		expect(isRepoImagePath(pathname)).toBe(false);
	});
});
