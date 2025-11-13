import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	// Base JS recommended
	js.configs.recommended,
	
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
			'no-console': ['error', { allow: ['warn', 'error'] }]
		}
	},
	
	// Svelte files
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelte.parser,
			parserOptions: {
				parser: tsParser,
				project: './tsconfig.json'
			},
			globals: {
				...globals.browser
			}
		},
		plugins: {
			svelte,
			'@typescript-eslint': ts
		},
		rules: {
			...svelte.configs.recommended.rules,
			...ts.configs['recommended'].rules,
			'no-console': ['error', { allow: ['warn', 'error'] }]
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
	
	// Allow console in debug endpoint
	{
		files: ['**/api/leaderboard/debug/**/*.ts'],
		rules: {
			'no-console': 'off'
		}
	},
	
	// Prettier config (must be last)
	prettier
];
