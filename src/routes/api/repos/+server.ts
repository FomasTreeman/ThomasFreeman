import { json } from '@sveltejs/kit';
import { TOKEN } from '$env/static/private';
import { verifySession } from '$lib/auth/magic-link.js';

export async function GET({ cookies }) {
	// Verify user is logged in
	const sessionToken = cookies.get('cms_session');
	const session = await verifySession(sessionToken || '');
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const resp = await fetch(
			`https://api.github.com/users/FomasTreeman/repos?per_page=100&sort=updated`,
			{
				headers: {
					Accept: 'application/vnd.github+json',
					Authorization: TOKEN
				},
				signal: AbortSignal.timeout(10000)
			}
		);

	if (!resp.ok) {
		return json({ error: `Failed to fetch repositories: ${resp.status}` }, { status: resp.status });
	}

		const repos = await resp.json();
		const repoList = repos.map((repo: any) => ({
			name: repo.name,
			full_name: repo.full_name,
			description: repo.description,
			updated_at: repo.updated_at
		}));

	return json({ repos: repoList });
	} catch (error) {
		return json({ error: 'Failed to fetch repositories' }, { status: 500 });
	}
}
