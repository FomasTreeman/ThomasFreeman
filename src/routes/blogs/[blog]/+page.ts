import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const post = await import(`../${params.blog}.md`);
	const content = post.default;

	return {
		content
	};
};
