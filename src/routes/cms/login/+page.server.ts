import { fail } from '@sveltejs/kit';
import { createMagicLink } from '$lib/auth/magic-link.js';
import { CMS_ADMIN_EMAIL } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Auto-send magic link on page load
	const baseUrl = `${url.protocol}//${url.host}`;
	const success = await createMagicLink(CMS_ADMIN_EMAIL, baseUrl);

	return {
		success,
		email: CMS_ADMIN_EMAIL
	};
};

export const actions = {
	resend: async ({ url }) => {
		const baseUrl = `${url.protocol}//${url.host}`;
		const success = await createMagicLink(CMS_ADMIN_EMAIL, baseUrl);

		if (!success) {
			return fail(500, { error: 'Failed to send login link' });
		}

		return {
			success: true,
			message: 'Login link sent!'
		};
	}
} satisfies Actions;
