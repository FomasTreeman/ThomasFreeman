import { fail, redirect } from '@sveltejs/kit';
import { adminEmail, createMagicLink, verifySession } from '$lib/auth/magic-link.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	// Check if already logged in
	const sessionToken = cookies.get('cms_session');
	const email = await verifySession(sessionToken || '');

	if (email) {
		throw redirect(302, '/cms');
	}

	return {
		email: adminEmail(),
		invalidLink: url.searchParams.get('error') === 'invalid'
	};
};

export const actions = {
	send: async ({ url }) => {
		const baseUrl = `${url.protocol}//${url.host}`;
		const result = await createMagicLink(adminEmail(), baseUrl);

		if (!result.ok) {
			return result.reason === 'unauthorized'
				? fail(403, { error: 'That address is not authorized to access the CMS.' })
				: fail(500, { error: 'Could not send the login link. Please try again.' });
		}

		return {
			sent: true,
			message: 'Login link sent! Check your inbox — it expires in 15 minutes.'
		};
	}
} satisfies Actions;
