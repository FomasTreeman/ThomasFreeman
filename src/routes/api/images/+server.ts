import { json } from '@sveltejs/kit';
import { verifySession } from '$lib/auth/magic-link.js';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - List all images in /static/repos
export async function GET({ cookies }) {
	// Verify user is logged in
	const sessionToken = cookies.get('cms_session');
	const session = verifySession(sessionToken || '');
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const reposDir = join(process.cwd(), 'static', 'repos');
		
		if (!existsSync(reposDir)) {
			return json({ images: [] });
		}

		const files = await readdir(reposDir);
		
		// Filter for image files only
		const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
		const images = files.filter(file => 
			imageExtensions.some(ext => file.toLowerCase().endsWith(ext))
		);

		return json({ images });
	} catch (error) {
		return json({ error: 'Failed to list images' }, { status: 500 });
	}
}

// DELETE - Delete an image
export async function DELETE({ url, cookies }) {
	// Verify user is logged in
	const sessionToken = cookies.get('cms_session');
	const session = verifySession(sessionToken || '');
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const fileName = url.searchParams.get('file');
	
	if (!fileName) {
		return json({ error: 'No file name provided' }, { status: 400 });
	}

	try {
		const filePath = join(process.cwd(), 'static', 'repos', fileName);
		
		if (!existsSync(filePath)) {
			return json({ error: 'File not found' }, { status: 404 });
		}

		await unlink(filePath);

		return json({ 
			success: true,
			message: 'Image deleted successfully' 
		});
	} catch (error) {
		return json({ error: 'Failed to delete image' }, { status: 500 });
	}
}
