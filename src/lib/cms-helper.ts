import { getContent } from './db/content.js';

/**
 * Load content from CMS with optional fallback
 * @param key - Content key (e.g., 'homepage.title')
 * @param fallback - Default value if content not found
 * @returns Content value or fallback
 */
export async function loadContent(key: string, fallback: string = ''): Promise<string> {
	try {
		return (await getContent(key)) ?? fallback;
	} catch (error) {
		return fallback;
	}
}

/**
 * Load multiple content items at once
 * @param keys - Array of content keys
 * @returns Object with keys and their values
 */
export async function loadContentBatch(keys: string[]): Promise<Record<string, string>> {
	const result: Record<string, string> = {};

	for (const key of keys) {
		try {
			result[key] = (await getContent(key)) ?? '';
		} catch (error) {
			result[key] = '';
		}
	}

	return result;
}
