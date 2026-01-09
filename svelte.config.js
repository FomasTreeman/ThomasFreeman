import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		mdsvex({
			extensions: ['.md']
			// layout: {
			// 	blog: 'src/routes/blog/[blog]/+page.svelte'
			// }
		})
	],
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter()
	},
	onwarn: (warning, handler) => {
		// Suppress non-critical warnings
		if (
			warning.code === 'a11y-click-events-have-key-events' ||
			warning.code === 'a11y-no-static-element-interactions' ||
			warning.code === 'css-unused-selector' ||
			warning.code === 'self_closing_tag' ||
			warning.code === 'event_directive_deprecated' ||
			warning.code === 'state_referenced_locally'
		) {
			return;
		}
		handler(warning);
	}
};

export default config;
