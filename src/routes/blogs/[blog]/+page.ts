import { error } from '@sveltejs/kit';
import { BLOG_ENABLED } from '$lib/constants/features.js';
import type { PageLoad } from './$types';

/** Turn a slug back into a display title: btc-as-money -> "Btc as money". */
function titleFromSlug(slug: string): string {
	const words = slug.replace(/[-_]+/g, ' ').trim();
	return words.charAt(0).toUpperCase() + words.slice(1);
}

export const load: PageLoad = async ({ params }) => {
	if (!BLOG_ENABLED) throw error(404, 'Not found');

	try {
		const post = await import(`../${params.blog}.md`);
		return {
			content: post.default,
			title: post.metadata?.title ?? titleFromSlug(params.blog)
		};
	} catch {
		// A slug with no matching .md file is a missing page, not a server fault
		throw error(404, 'That post does not exist');
	}
};
