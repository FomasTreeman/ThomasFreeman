import { json } from '@sveltejs/kit';
import { verifySession } from '$lib/auth/magic-link.js';
import { getAllContent, getContent, setContent, deleteContent, publishContent } from '$lib/db/content.js';
import type { RequestHandler } from './$types';

async function checkAuth(cookies: any): Promise<boolean> {
	const sessionToken = cookies.get('cms_session');
	return (await verifySession(sessionToken)) !== null;
}

// GET - Retrieve all content or specific content by key
export const GET: RequestHandler = async ({ url, cookies }) => {
	if (!(await checkAuth(cookies))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const key = url.searchParams.get('key');

	try {
		if (key) {
			const value = await getContent(key);
			if (value === null) {
				return json({ error: 'Content not found' }, { status: 404 });
			}
			return json({ key, value });
		} else {
			const allContent = await getAllContent();
			return json({ content: allContent });
		}
	} catch (error) {
		console.error('GET /api/cms/content error:', error);
		return json({ error: 'Failed to fetch content', details: String(error) }, { status: 500 });
	}
};

// PUT - Update or create content (as draft by default)
export const PUT: RequestHandler = async ({ request, cookies }) => {
	if (!(await checkAuth(cookies))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { key, value, isDraft = true } = await request.json();

		if (!key || typeof value !== 'string') {
			return json({ error: 'Invalid data: key and value are required' }, { status: 400 });
		}

		await setContent(key, value, isDraft);
		return json({ success: true, key, value, isDraft });
	} catch (error) {
		console.error('PUT /api/cms/content error:', error);
		return json({ error: 'Failed to update content', details: String(error) }, { status: 500 });
	}
};

// POST - Publish content (remove draft flag)
export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!(await checkAuth(cookies))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { key } = await request.json();

		if (!key) {
			return json({ error: 'Key is required' }, { status: 400 });
		}

		const published = await publishContent(key);
		if (!published) {
			return json({ error: 'Content not found' }, { status: 404 });
		}

		return json({ success: true, key, published: true }, { status: 200 });
	} catch (error) {
		console.error('POST /api/cms/content error:', error);
		return json({ error: 'Failed to publish content', details: String(error) }, { status: 500 });
	}
};

// DELETE - Remove content by key
export const DELETE: RequestHandler = async ({ url, cookies }) => {
	if (!(await checkAuth(cookies))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const key = url.searchParams.get('key');

	if (!key) {
		return json({ error: 'Key parameter is required' }, { status: 400 });
	}

	try {
		const deleted = await deleteContent(key);
		if (!deleted) {
			return json({ error: 'Content not found' }, { status: 404 });
		}
		return json({ success: true, key });
	} catch (error) {
		console.error('DELETE /api/cms/content error:', error);
		return json({ error: 'Failed to delete content', details: String(error) }, { status: 500 });
	}
};
