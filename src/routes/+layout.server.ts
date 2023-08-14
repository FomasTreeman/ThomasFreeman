
import { Base64 } from 'js-base64';
import { TOKEN } from '$env/static/private';
import PINNED from '$lib/utils/repos.js';
import type { Data } from '$lib/types.js';


/** @type {import('./$types').PageLoad} */
export async function load() {
    let error: boolean;
    const getRepos = async (): Promise<Data> => {
        const resp = await fetch(
            `https://api.github.com/users/FomasTreeman/repos?per_page=100&sort=updated`,
            {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: TOKEN
                }
            }
        );
        const jsonResp = await resp.json();
        error = resp.status !== 200
        if (error) return { error, repos: [] };
        const repoNames = jsonResp.map((repo: any) => repo.full_name.split('/')[1]);
        const pinnedRepoNames = repoNames.filter((name: string) => Object.keys(PINNED).includes(name));
        return {
            repos: Promise.all(
                pinnedRepoNames.map(async (repoName: string) => {
                    const resp = await fetch(`https://api.github.com/repos/FomasTreeman/${repoName}/readme`);
                    const json = await resp.json();
                    return {
                        error: resp.status === 200,
                        md: resp.status === 200 ? Base64.decode(json.content) : '',
                        name: repoName,
                        url: `https://github.com/FomasTreeman/${repoName}`,
                        ...PINNED[repoName],
                    };
                })
            ),
            error: error
        };
    };
    return await getRepos();
}