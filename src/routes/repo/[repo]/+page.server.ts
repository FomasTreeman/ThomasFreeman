import { error } from '@sveltejs/kit';
import { Base64 } from 'js-base64';
import { TOKEN } from '$env/static/private';

// Simple in-memory cache with 10 minute TTL for READMEs
const readmeCache = new Map<string, { md: string; expires: number }>();
const README_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function load({ params, parent }) {
	const repoName = params.repo;
	
	// Get parent data (includes all repos)
	const parentData = await parent();
	const repos = await parentData.repos;
	const repo = repos.find((r: any) => r.name === repoName);
	
	if (!repo) {
		throw error(404, "This repo doesn't exist");
	}
	
	// Check cache first
	const cached = readmeCache.get(repoName);
	if (cached && cached.expires > Date.now()) {
		console.log(`Using cached README for ${repoName}`);
		return {
			...repo,
			md: cached.md
		};
	}
	
	// Fetch README from GitHub
	try {
		const resp = await fetch(
			`https://api.github.com/repos/FomasTreeman/${repoName}/readme`,
			{
				headers: {
					Accept: 'application/vnd.github+json',
					Authorization: TOKEN
				},
				signal: AbortSignal.timeout(10000)
			}
		);
		
		if (resp.ok) {
			const json = await resp.json();
			const md = Base64.decode(json.content);
			
			// Cache the README
			readmeCache.set(repoName, { md, expires: Date.now() + README_CACHE_TTL });
			
			return {
				...repo,
				md
			};
		} else {
			console.error(`Failed to fetch README for ${repoName}: ${resp.status}`);
			return {
				...repo,
				md: '# README not available\n\nCould not load the README for this project.'
			};
		}
	} catch (err) {
		console.error(`Error fetching README for ${repoName}:`, err);
		return {
			...repo,
			md: '# README not available\n\nCould not load the README for this project.'
		};
	}
}
