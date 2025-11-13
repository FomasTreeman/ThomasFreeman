import { Base64 } from 'js-base64';
import { TOKEN } from '$env/static/private';
import PINNED from '$lib/utils/repos.js';
import type { Data } from '$lib/types.js';


interface GitHubRepo {
    full_name: string;
}

/** @type {import('./$types').PageLoad} */
export async function load() {
    const getRepos = async (): Promise<Data> => {
        try {
            const resp = await fetch(
                `https://api.github.com/users/FomasTreeman/repos?per_page=100&sort=updated`,
                {
                    headers: {
                        Accept: 'application/vnd.github+json',
                        Authorization: TOKEN
                    },
                    signal: AbortSignal.timeout(10000) // 10 second timeout
                }
            );

            if (!resp.ok) {
                let errorMessage = 'Failed to fetch repositories';
                if (resp.status === 401 || resp.status === 403) {
                    errorMessage = 'GitHub API authentication failed';
                } else if (resp.status === 429) {
                    errorMessage = 'GitHub API rate limit exceeded, please try later';
                } else if (resp.status >= 500) {
                    errorMessage = 'GitHub service temporarily unavailable';
                }
                console.error(`GitHub API error (${resp.status}):`, errorMessage);
                return { error: true, repos: [] };
            }

            const jsonResp = await resp.json() as GitHubRepo[];
            const repoNames = jsonResp.map((repo) => repo.full_name.split('/')[1]);
            const pinnedRepoNames = repoNames.filter((name: string) => Object.keys(PINNED).includes(name));
            
            return {
                repos: Promise.all(
                    pinnedRepoNames.map(async (repoName: string) => {
                        try {
                            const resp = await fetch(
                                `https://api.github.com/repos/FomasTreeman/${repoName}/readme`,
                                { signal: AbortSignal.timeout(10000) }
                            );
                            const json = await resp.json();
                            return {
                                error: !resp.ok,
                                md: resp.ok ? Base64.decode(json.content) : '',
                                name: repoName, 
                                url: `https://github.com/FomasTreeman/${repoName}`,
                                ...PINNED[repoName],
                            };
                        } catch (err) {
                            console.error(`Failed to fetch README for ${repoName}:`, err);
                            return {
                                error: true,
                                md: '',
                                name: repoName,
                                url: `https://github.com/FomasTreeman/${repoName}`,
                                ...PINNED[repoName],
                            };
                        }
                    })
                ),
                error: false
            };
        } catch (err) {
            console.error('Error fetching GitHub repositories:', err);
            return { error: true, repos: [] };
        }
    };
    return await getRepos();
}
