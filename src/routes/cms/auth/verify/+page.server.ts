import { redirect } from '@sveltejs/kit';
import { verifyMagicLink, createSession } from '$lib/auth/magic-link.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		throw redirect(302, '/cms/login');
	}

	const email = await verifyMagicLink(token);

	if (!email) {
		throw redirect(302, '/cms/login?error=invalid');
	}

	// Create session
	const sessionToken = await createSession(email);

	// Set session cookie (7 days)
	cookies.set('cms_session', sessionToken, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});

	throw redirect(302, '/cms');
};
