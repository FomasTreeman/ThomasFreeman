import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

export default [
	// Generated and vendored output — never hand-edited, so never linted
	{
		ignores: [
			'.svelte-kit/**',
			'.vercel/**',
			'build/**',
			'dist/**',
			'node_modules/**',
			'static/**',
			'pnpm-lock.yaml'
		]
	},

	// Base JS recommended
	js.configs.recommended,

	// Svelte recommended — brings in svelte-eslint-parser, which the plugin
	// does not export as `svelte.parser`. Without this every .svelte file is
	// parsed as plain JS and fails on the first `<`.
	...svelte.configs['flat/recommended'],

	// TypeScript files
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				extraFileExtensions: ['.svelte']
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2020
			}
		},
		plugins: {
			'@typescript-eslint': ts
		},
		rules: {
			...ts.configs['recommended'].rules,
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			]
		}
	},

	// Svelte files — TypeScript inside <script lang="ts">
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tsParser,
				extraFileExtensions: ['.svelte'],
				svelteConfig
			},
			globals: {
				...globals.browser
			}
		},
		plugins: {
			'@typescript-eslint': ts
		},
		rules: {
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'no-undef': 'off',
			// the base rule cannot read TS type annotations and flags their params
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			// resolve() only matters when kit.paths.base is set; this app is served from root
			'svelte/no-navigation-without-resolve': 'off'
		}
	},

	// JavaScript files
	{
		files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2020
			}
		},
		rules: {
			'no-console': ['error', { allow: ['warn', 'error'] }]
		}
	},

	// Standalone tooling scripts — outside the app's tsconfig, so no type-aware
	// linting, and console output is the whole point of them.
	// Must come after the generic JS/TS blocks so it wins.
	{
		files: ['scripts/**/*.{ts,js}', '*.config.ts'],
		languageOptions: {
			parserOptions: {
				project: null
			}
		},
		rules: {
			'no-console': 'off'
		}
	},

	// Prettier config (must be last)
	prettier
];
