import { json } from '@sveltejs/kit';
import { del, list } from '@vercel/blob';
import { env } from '$env/dynamic/private';
import { verifySession } from '$lib/auth/magic-link.js';
import { REPO_IMAGE_PREFIX, isRepoImagePath } from '$lib/server/upload.js';
import type { RequestHandler } from './$types';

// Read at runtime so a deployment without blob storage still builds
const BLOB_READ_WRITE_TOKEN = env.BLOB_READ_WRITE_TOKEN;

async function requireAdmin(cookies: { get(name: string): string | undefined }): Promise<boolean> {
	return (await verifySession(cookies.get('cms_session') || '')) !== null;
}

// GET - list uploaded project images
export const GET: RequestHandler = async ({ cookies }) => {
	if (!(await requireAdmin(cookies))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!BLOB_READ_WRITE_TOKEN) {
		return json({ error: 'Image storage is not configured.' }, { status: 500 });
	}

	try {
		const { blobs } = await list({ token: BLOB_READ_WRITE_TOKEN, prefix: REPO_IMAGE_PREFIX });

		const images = blobs
			.filter((blob) => blob.pathname !== REPO_IMAGE_PREFIX)
			.map((blob) => ({
				name: blob.pathname.slice(REPO_IMAGE_PREFIX.length),
				pathname: blob.pathname,
				url: blob.url,
				size: blob.size
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		return json({ images });
	} catch (error) {
		console.error('GET /api/images failed:', error);
		return json({ error: 'Failed to list images' }, { status: 500 });
	}
};

// DELETE - remove one uploaded project image
export const DELETE: RequestHandler = async ({ url, cookies }) => {
	if (!(await requireAdmin(cookies))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!BLOB_READ_WRITE_TOKEN) {
		return json({ error: 'Image storage is not configured.' }, { status: 500 });
	}

	const pathname = url.searchParams.get('pathname');
	if (!pathname) {
		return json({ error: 'A pathname parameter is required' }, { status: 400 });
	}

	// Only ever delete inside the repo-image prefix, and never via a traversal
	if (!isRepoImagePath(pathname)) {
		return json({ error: 'That file cannot be deleted.' }, { status: 400 });
	}

	try {
		// Resolve through list() so we delete a blob we actually own, rather
		// than whatever URL the caller hands us
		const { blobs } = await list({ token: BLOB_READ_WRITE_TOKEN, prefix: pathname });
		const target = blobs.find((blob) => blob.pathname === pathname);

		if (!target) {
			return json({ error: 'File not found' }, { status: 404 });
		}

		await del(target.url, { token: BLOB_READ_WRITE_TOKEN });
		return json({ success: true, pathname });
	} catch (error) {
		console.error('DELETE /api/images failed:', error);
		return json({ error: 'Failed to delete image' }, { status: 500 });
	}
};
