/**
 * Resolve a stored project image reference to something an <img src> can use.
 *
 * Images uploaded before the move to Vercel Blob are bare filenames that live
 * in static/repos, so both forms have to keep working.
 */
export function resolveImageSrc(image?: string, fallbackName?: string): string {
	if (image) {
		return /^https?:\/\//i.test(image) ? image : `/repos/${image}`;
	}
	return `/repos/${(fallbackName ?? '').toLowerCase()}.webp`;
}
