
import { Base64 } from 'js-base64';
import { TOKEN } from '$env/static/private';
import type { PinnedData, Repo, RepoError } from '$lib/types.js';

const PINNED: { [key: string]: Partial<PinnedData> } = {
    'Comms': {
        production: 'https://comm-a.vercel.app/',
        imageExt: '.png',
        description: 'My quick rough messaging app for testing new frameworks'
    },
    'Rich_System_Site': {
        imageExt: '.png',
        description: 'A betting bot dashboard'
    },
    'KodiTV': {},
    'home-page': {
        imageExt: '.png',
        description: 'My responsive home page for chrome'
    },

};


/** @type {import('./$types').PageLoad} */
export function load() {
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
        const pinnedRepos = repoNames.filter((name: string) => Object.keys(PINNED).includes(name));
        return Promise.all(
            pinnedRepos.map(async (repoName: string) => {
                const resp = await fetch(`https://api.github.com/repos/FomasTreeman/${repoName}/readme`);
                const json = await resp.json();
                if (resp.status !== 200) console.log(json) // temp
                return resp.status === 200 ?
                    {
                        md: Base64.decode(json.content),
                        name: repoName,
                        url: `https://github.com/FomasTreeman/${repoName}`,
                        ...PINNED[repoName],
                    } :
                    {
                        md: '',
                        name: repoName,
                        url: `https://github.com/FomasTreeman/${repoName}`,
                        ...PINNED[repoName],
                    };
            })
        );
    };
    return {
        repos: getRepos(),
    };
}