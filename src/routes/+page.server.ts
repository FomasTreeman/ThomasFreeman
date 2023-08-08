
import { Base64 } from 'js-base64';
import { TOKEN } from '$env/static/private';
import type { Data, Repo, RepoError } from '$lib/types.js';

const productions = {
    Comms: 'https://comm-a.vercel.app/',
    'Weather-TM': 'https://fac27.github.io/Weather-TM/'
};

const pinned = [
    'Rich_System_Site',
    'home-page',
    'Comms',
    'KodiTV'
    // 'Weather-TM',
];

/** @type {import('./$types').PageLoad} */
export function load(): Data {
    const getRepos = async (): Promise<Repo[] | RepoError> => {
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
        if (resp.status !== 200) console.log(jsonResp) // temp
        if (resp.status !== 200) return { error: jsonResp.message };
        const repoNames = jsonResp.map((repo: any) => repo.full_name.split('/')[1]);
        const pinnedRepos = repoNames.filter((name: string) => pinned.includes(name));
        return Promise.all(
            pinnedRepos.map(async (repoName: string) => {
                const resp = await fetch(`https://api.github.com/repos/FomasTreeman/${repoName}/readme`);
                const json = await resp.json();
                if (resp.status !== 200) console.log(json) // temp
                return resp.status === 200 ?
                    {
                        md: Base64.decode(json.content),
                        name: repoName,
                        url: `https://github.com/FomasTreeman/${repoName}`
                    } :
                    {
                        md: '',
                        name: repoName,
                        url: `https://github.com/FomasTreeman/${repoName}`
                    };
            })
        );
    };
    return {
        repos: getRepos(),
        pinned,
        productions
    };
}