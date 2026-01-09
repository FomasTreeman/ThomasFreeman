import { redirect, fail } from '@sveltejs/kit';
import { verifySession, deleteSession } from '$lib/auth/magic-link.js';
import { getAllContent } from '$lib/db/content.js';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionToken = cookies.get('cms_session');
	const email = await verifySession(sessionToken || '');

	if (!email) {
		throw redirect(302, '/cms/login');
	}

	try {
		const content = await getAllContent();
		return {
			email,
			content
		};
	} catch (error) {
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
			await deleteSession(sessionToken);
		}
		cookies.delete('cms_session', { path: '/' });
		throw redirect(302, '/cms/login');
	}
} satisfies Actions;
