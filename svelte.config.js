import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		mdsvex({
			extensions: ['.md']
			// layout: {
			// 	blog: 'src/routes/blog/[blog]/+page.svelte'
			// }
		}),
		vitePreprocess()
	],
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter(),
	}
};

export default config;
