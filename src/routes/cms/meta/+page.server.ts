import { redirect } from '@sveltejs/kit';
import { verifySession } from '$lib/auth/magic-link.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionToken = cookies.get('cms_session');
	const email = await verifySession(sessionToken || '');

	if (!email) {
		throw redirect(302, '/cms/login');
	}

	return { email };
};
