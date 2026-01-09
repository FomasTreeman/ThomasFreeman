import { redirect, fail } from '@sveltejs/kit';
import { verifySession, deleteSession } from '$lib/auth/magic-link.js';
import { getAllContent } from '$lib/db/content.js';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionToken = cookies.get('cms_session');
	const email = verifySession(sessionToken || '');

	if (!email) {
		throw redirect(302, '/cms/login');
	}

	try {
		const content = getAllContent();
		return {
			email,
			content
		};
	} catch (error) {
		console.error('Error loading content:', error);
		return {
			email,
			content: []
		};
	}
};

export const actions = {
	logout: async ({ cookies }) => {
		const sessionToken = cookies.get('cms_session');
		if (sessionToken) {
			deleteSession(sessionToken);
		}
		cookies.delete('cms_session', { path: '/' });
		throw redirect(302, '/cms/login');
	}
} satisfies Actions;
