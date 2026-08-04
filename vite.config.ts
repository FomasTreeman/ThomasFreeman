import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// vitest 2 bundles its own (older) vite types, so the Plugin[] promise that
	// sveltekit() returns does not structurally match this defineConfig's
	// PluginOption. Runtime is fine; the cast is purely to bridge the two type
	// trees. Removable once vitest is on the same vite major.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugins: [sveltekit()] as any,
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
