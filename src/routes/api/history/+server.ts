import { json } from '@sveltejs/kit';
import { getContentHistory, getAllHistory } from '$lib/db/content.js';
import { verifySession } from '$lib/auth/magic-link.js';

export async function GET({ url, cookies }) {
	// Verify user is logged in
	const sessionToken = cookies.get('cms_session');
	const session = verifySession(sessionToken || '');
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const key = url.searchParams.get('key');
	const limit = parseInt(url.searchParams.get('limit') || '50');

	try {
		const history = key 
			? getContentHistory(key, limit)
			: getAllHistory(limit);
		
		return json({ history });
	} catch (error) {
		console.error('Error fetching history:', error);
		return json({ error: 'Failed to fetch history' }, { status: 500 });
	}
}
