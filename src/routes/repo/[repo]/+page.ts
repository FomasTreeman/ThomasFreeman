import { error } from '@sveltejs/kit';
import REPOS from '$lib/utils/repos';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const param = params.repo;

	if (Object.keys(REPOS).includes(param)) {
		return {
			param: param
		};
	} else throw error(404, "This repo doesn't exist");
}
