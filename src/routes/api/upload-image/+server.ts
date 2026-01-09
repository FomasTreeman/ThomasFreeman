import { json } from '@sveltejs/kit';
import { verifySession } from '$lib/auth/magic-link.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST({ request, cookies }) {
	// Verify user is logged in
	const sessionToken = cookies.get('cms_session');
	const session = verifySession(sessionToken || '');
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		
		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Validate file is an image
		if (!file.type.startsWith('image/')) {
			return json({ error: 'File must be an image' }, { status: 400 });
		}

		// Get the file name
		const fileName = file.name;
		
		// Ensure /static/repos directory exists
		const reposDir = join(process.cwd(), 'static', 'repos');
		if (!existsSync(reposDir)) {
			await mkdir(reposDir, { recursive: true });
		}

		// Save file
		const filePath = join(reposDir, fileName);
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		await writeFile(filePath, buffer);

		return json({ 
			success: true, 
			fileName,
			message: 'Image uploaded successfully' 
		});
	} catch (error) {
		return json({ error: 'Failed to upload image' }, { status: 500 });
	}
}
