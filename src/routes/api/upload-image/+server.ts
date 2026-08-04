import { json } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { verifySession } from '$lib/auth/magic-link.js';
import {
	MAX_IMAGE_BYTES,
	REPO_IMAGE_PREFIX,
	isAllowedImageType,
	sanitiseFileName
} from '$lib/server/upload.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionToken = cookies.get('cms_session');
	if (!(await verifySession(sessionToken || ''))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!BLOB_READ_WRITE_TOKEN) {
		return json({ error: 'Image storage is not configured.' }, { status: 500 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!(file instanceof File)) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		if (!isAllowedImageType(file.type)) {
			return json({ error: 'That file type is not supported.' }, { status: 400 });
		}

		if (file.size > MAX_IMAGE_BYTES) {
			return json({ error: 'Images must be 5MB or smaller.' }, { status: 400 });
		}

		const name = sanitiseFileName(file.name);
		const blob = await put(`${REPO_IMAGE_PREFIX}${name}`, file, {
			access: 'public',
			contentType: file.type,
			token: BLOB_READ_WRITE_TOKEN,
			allowOverwrite: true
		});

		return json({ success: true, name, url: blob.url, pathname: blob.pathname });
	} catch (error) {
		console.error('POST /api/upload-image failed:', error);
		return json({ error: 'Failed to upload image' }, { status: 500 });
	}
};
