/**
 * Renders the 1200x630 social card (og:image) from the CMS site metadata.
 *
 * This replaces static/og-image.png and the Playwright script that produced
 * it: the design is the same, but the name, tagline and hostname are drawn
 * from `site.meta` on request, so the picture can no longer drift from the
 * copy on /cms/meta. Satori lays the card out with a subset of CSS (flexbox,
 * gradients, fonts) and returns SVG; resvg rasterises that to PNG.
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
// Satori needs the font bytes (TTF/OTF/WOFF, not WOFF2). `?inline` makes Vite
// embed them in the server bundle as data URLs, so nothing has to be read from
// node_modules at runtime, where a serverless function may not have it.
import interMedium from '@fontsource/inter/files/inter-latin-500-normal.woff?inline';
import interExtraBold from '@fontsource/inter/files/inter-latin-800-normal.woff?inline';
import jetbrainsMono from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff?inline';
import type { SiteMeta } from '$lib/site-meta.js';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

function fontData(dataUrl: string): Buffer {
	return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
}

const FONTS = [
	{ name: 'Inter', data: fontData(interMedium), weight: 500 as const, style: 'normal' as const },
	{ name: 'Inter', data: fontData(interExtraBold), weight: 800 as const, style: 'normal' as const },
	{
		name: 'JetBrains Mono',
		data: fontData(jetbrainsMono),
		weight: 400 as const,
		style: 'normal' as const
	}
];

/**
 * The original card set the tagline at 2.35rem in a 26ch column. That was
 * rendered in the macOS system font; Inter runs about 10% wider, so 640px is
 * what reproduces the same line breaks (checked against the old PNG, every
 * line lands within 2px). Descriptions may run to ~160 characters (the CMS
 * counter's limit), so longer ones get a smaller size and a wider column
 * instead of overflowing the card.
 */
function taglineStyle(text: string): { fontSize: number; maxWidth: number } {
	if (text.length <= 64) return { fontSize: 37.6, maxWidth: 640 };
	if (text.length <= 110) return { fontSize: 33, maxWidth: 800 };
	return { fontSize: 29, maxWidth: 940 };
}

type Node = { type: string; props: Record<string, unknown> };

function el(type: string, style: Record<string, unknown>, children?: Node[] | string): Node {
	return { type, props: { style, children } };
}

export type OgCardText = Pick<SiteMeta, 'siteName' | 'description' | 'siteUrl'>;

/** Build the card's element tree. Exported for tests. */
export function cardTree(text: OgCardText): Node {
	const host = new URL(text.siteUrl).host;
	const tagline = taglineStyle(text.description);

	return el(
		'div',
		{
			width: OG_WIDTH,
			height: OG_HEIGHT,
			// Satori defaults to content-box, which adds the padding to the
			// height and centres the text 80px too low; the original page was
			// border-box throughout
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			gap: 24,
			padding: 80,
			// Same two glows over the same charcoal as the original card
			backgroundColor: '#1a1a1a',
			backgroundImage: [
				'radial-gradient(ellipse 800px 480px at 12% 8%, rgba(255, 139, 0, 0.5), rgba(255, 139, 0, 0) 65%)',
				'radial-gradient(ellipse 720px 512px at 92% 96%, rgba(0, 121, 255, 0.45), rgba(0, 121, 255, 0) 65%)'
			].join(', '),
			color: '#fff',
			fontFamily: 'Inter'
		},
		[
			el(
				'div',
				{
					fontFamily: 'JetBrains Mono',
					fontSize: 26.4,
					letterSpacing: 5.8,
					textTransform: 'uppercase',
					color: '#ffb545'
				},
				host
			),
			el(
				'div',
				{ fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: -1.92 },
				text.siteName
			),
			el('div', {
				width: 144,
				height: 9.6,
				borderRadius: 999,
				backgroundImage: 'linear-gradient(135deg, #ff8b00, #f9dc00)'
			}),
			el(
				'div',
				{
					fontSize: tagline.fontSize,
					maxWidth: tagline.maxWidth,
					fontWeight: 500,
					lineHeight: 1.3,
					color: 'rgba(255, 255, 255, 0.82)',
					// Last line of defence: never spill off the bottom of the card
					lineClamp: 5
				},
				text.description
			)
		]
	);
}

export async function renderOgCard(text: OgCardText): Promise<Buffer> {
	// satori's types want a ReactNode; the plain {type, props} tree is what JSX
	// compiles to, so the cast is only to satisfy the signature
	const svg = await satori(cardTree(text) as unknown as Parameters<typeof satori>[0], {
		width: OG_WIDTH,
		height: OG_HEIGHT,
		fonts: FONTS
	});
	return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}
