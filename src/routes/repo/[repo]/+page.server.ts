import { error } from '@sveltejs/kit';
import type { IRepo } from '$lib/types.js';

export async function load({ params, parent }) {
	const repoName = params.repo;

	// Get parent data (includes all repos)
	const parentData = await parent();
	const repos = await parentData.repos;
	const repo = repos.find((r: IRepo) => r.name === repoName);

	if (!repo) {
		throw error(404, "This repo doesn't exist");
	}

	// Return the repo data directly - no README fetching
	return repo;
}
