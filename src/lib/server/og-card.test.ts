import { describe, it, expect } from 'vitest';
import { OG_HEIGHT, OG_WIDTH, renderOgCard } from './og-card.js';

const text = {
	siteName: 'Tom Freeman',
	description: 'DevSecOps engineer — secure CI/CD, cloud and infrastructure as code.',
	siteUrl: 'https://me.fomastree.dev'
};

function pngSize(png: Buffer): { width: number; height: number } {
	// IHDR is the first chunk: width and height are big-endian at bytes 16 and 20
	return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

describe('renderOgCard', () => {
	it('renders a 1200x630 PNG', async () => {
		const png = await renderOgCard(text);
		expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
		expect(pngSize(png)).toEqual({ width: OG_WIDTH, height: OG_HEIGHT });
	});

	it('draws different pixels for different text', async () => {
		const a = await renderOgCard(text);
		const b = await renderOgCard({ ...text, description: 'Something else entirely.' });
		expect(a.equals(b)).toBe(false);
	});

	it('copes with the longest description the editor suggests', async () => {
		const png = await renderOgCard({ ...text, description: 'x '.repeat(80).trim() });
		expect(pngSize(png)).toEqual({ width: OG_WIDTH, height: OG_HEIGHT });
	});
});
