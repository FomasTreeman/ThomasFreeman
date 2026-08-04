/** Blob prefix for project card images. */
export const REPO_IMAGE_PREFIX = 'repos/';

const ALLOWED_IMAGE_TYPES = [
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/gif',
	'image/avif',
	'image/svg+xml'
];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function isAllowedImageType(type: string): boolean {
	return ALLOWED_IMAGE_TYPES.includes(type);
}

/**
 * Reduce an uploaded filename to a single safe path segment.
 *
 * The previous implementation joined the raw `file.name` straight onto a
 * directory path, so a name like `../../x` escaped the intended folder. Keep
 * only the basename and a conservative character set.
 */
export function sanitiseFileName(name: string): string {
	const basename = name.split(/[\\/]/).pop() ?? '';
	const cleaned = basename
		.replace(/[^a-zA-Z0-9._-]/g, '-')
		.replace(/^[.-]+/, '')
		.replace(/-{2,}/g, '-')
		.slice(0, 120);

	return cleaned || 'upload';
}

/**
 * Confirm a pathname refers to a repo image and nothing else, so a delete
 * cannot reach other blobs in the store.
 */
export function isRepoImagePath(pathname: string): boolean {
	if (!pathname.startsWith(REPO_IMAGE_PREFIX)) return false;
	const rest = pathname.slice(REPO_IMAGE_PREFIX.length);
	return rest.length > 0 && !rest.includes('/') && sanitiseFileName(rest) === rest;
}
