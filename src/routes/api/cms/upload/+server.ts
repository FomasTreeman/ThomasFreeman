import { json } from '@sveltejs/kit';
import { verifySession } from '$lib/auth/magic-link.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

function checkAuth(cookies: any): boolean {
	const sessionToken = cookies.get('cms_session');
	return verifySession(sessionToken) !== null;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!checkAuth(cookies)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Validate file type (PDF only for resume)
		if (file.type !== 'application/pdf') {
			return json(
				{ error: 'Invalid file type. Only PDF files are allowed.' },
				{ status: 400 }
			);
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
		}

		// Get file extension
		const ext = file.name.split('.').pop();
		const fileName = `${formData.get('name') || 'file'}.${ext}`;

		// Read file as buffer
		const buffer = Buffer.from(await file.arrayBuffer());

		// Save to static directory
		const staticDir = join(process.cwd(), 'static');
		await writeFile(join(staticDir, fileName), buffer);

		return json({
			success: true,
			fileName,
			url: `/${fileName}`,
			size: file.size,
			type: file.type
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		return json({ error: 'Failed to upload file' }, { status: 500 });
	}
};
