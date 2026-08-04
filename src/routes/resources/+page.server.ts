import { getContent } from '$lib/db/content.js';
import { RESOURCES_KEY } from '$lib/constants/content-keys.js';
import type { IResource } from '$lib/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { isLoggedIn } = await parent();

	let resources: IResource[] = [];
	try {
		const raw = await getContent(RESOURCES_KEY, isLoggedIn);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) resources = parsed;
		}
	} catch (error) {
		// An empty list renders a sensible empty state, so degrade rather than 500
		console.error('Failed to load resources:', error);
	}

	return { resources };
};
