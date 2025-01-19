import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	console.log('------------------------------' + params.blog);
	const post = await import(`../${params.blog}.md`);
	// const { title, date } = post.metadata;
	const content = post.default;

	return {
		content,
		// title,
		// date
	};
};
