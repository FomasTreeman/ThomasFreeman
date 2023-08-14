import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},// attempt to fix .glb static file
	resolve: {
		alias: {
			$img: mode === "production" ? "./static/img" : "../img",
		},
	},
}));
