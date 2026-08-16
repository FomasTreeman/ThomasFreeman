import { error } from '@sveltejs/kit';
import { BLOG_ENABLED } from '$lib/constants/features.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// Hiding the nav entry alone would leave the listing reachable by URL and
	// indexable, so a disabled blog is a genuine 404.
	if (!BLOG_ENABLED) throw error(404, 'Not found');
	return {};
};
