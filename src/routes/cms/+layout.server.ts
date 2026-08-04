import { redirect } from '@sveltejs/kit';
import { verifySession } from '$lib/auth/magic-link.js';
import type { LayoutServerLoad } from './$types';

/**
 * Single auth gate for the whole CMS.
 *
 * /cms and /cms/resources each had their own guard but /cms/projects had
 * none, so it rendered its shell to anonymous visitors (its data calls 401,
 * but the page itself was reachable). Guarding at the layout means any new
 * CMS route is covered by default.
 */
export const load: LayoutServerLoad = async ({ cookies, url }) => {
	// The login page lives under /cms, so it has to stay reachable
	if (url.pathname.startsWith('/cms/login') || url.pathname.startsWith('/cms/auth')) {
		return { email: null };
	}

	const email = await verifySession(cookies.get('cms_session') || '');
	if (!email) {
		throw redirect(302, '/cms/login');
	}

	return { email };
};
