import { getContent } from './db/content.js';

/**
 * Load content from CMS with optional fallback
 * @param key - Content key (e.g., 'homepage.title')
 * @param fallback - Default value if content not found
 * @returns Content value or fallback
 */
export function loadContent(key: string, fallback: string = ''): string {
	try {
		return getContent(key) ?? fallback;
	} catch (error) {
		return fallback;
	}
}

/**
 * Load multiple content items at once
 * @param keys - Array of content keys
 * @returns Object with keys and their values
 */
export function loadContentBatch(keys: string[]): Record<string, string> {
	const result: Record<string, string> = {};

	for (const key of keys) {
		try {
			result[key] = getContent(key) ?? '';
		} catch (error) {
			result[key] = '';
		}
	}

	return result;
}
