import { Base64 } from 'js-base64';
import { TOKEN } from '$env/static/private';
import PINNED from '$lib/utils/repos.js';
import type { Data } from '$lib/types.js';
import { getContent } from '$lib/db/content.js';
import { verifySession } from '$lib/auth/magic-link.js';

// Simple in-memory cache with 5 minute TTL
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
	const cached = cache.get(key);
	if (cached && cached.expires > Date.now()) {
		return cached.data as T;
	}
	cache.delete(key);
	return null;
}

function setCache(key: string, data: any): void {
	cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

interface GitHubRepo {
	full_name: string;
}

function loadCMSContent(isLoggedIn: boolean) {
	try {
		return {
			footer: JSON.parse(getContent('footer.content', isLoggedIn) || '{}'),
			journey: {
				header: JSON.parse(getContent('journey.header', isLoggedIn) || '{}'),
				experiences: JSON.parse(getContent('journey.experiences', isLoggedIn) || '[]')
			},
			hero: {
				title: getContent('homepage.hero.title', isLoggedIn) || 'Hi, I\'m Tom Freeman 🖖',
				subtitle: getContent('homepage.hero.subtitle', isLoggedIn) || 'Software Dev.',
				bio: getContent('about.bio', isLoggedIn) || 'I\'m a developer with a passion for creating beautiful and efficient applications.',
				resumeUrl: getContent('about.resume_url', isLoggedIn) || '/Tom_Freeman.pdf',
				resumeLabel: getContent('about.resume_label', isLoggedIn) || 'Resume'
			},
			contact: {
				email: getContent('contact.email', isLoggedIn) || 'tom@team-freeman.com'
			},
			socialLinks: JSON.parse(getContent('about.social_links', isLoggedIn) || '[]')
		};
	} catch (error) {
		return { header: null, footer: null, journey: null, hero: null, contact: null };
	}
}

/** @type {import('./$types').PageLoad} */
export async function load({ cookies }) {
	const sessionToken = cookies.get('cms_session');
	const isLoggedIn = verifySession(sessionToken || '') !== null;
	
	const cmsContent = loadCMSContent(isLoggedIn);
	
	// Load projects configuration from CMS
	let projectsConfig: any[] = [];
	try {
		const configContent = getContent('projects.config', isLoggedIn);
		if (configContent) {
			projectsConfig = JSON.parse(configContent);
		}
	} catch (error) {
		// Fallback to PINNED if config fails
		projectsConfig = Object.keys(PINNED).map(name => ({ name }));
	}
	
	// If no projects configured, use default PINNED
	if (projectsConfig.length === 0) {
		projectsConfig = Object.keys(PINNED).map(name => ({ name }));
	}
	
	const getRepos = async (): Promise<Data> => {
		try {
			// Check cache first
			const cacheKey = `repos:${JSON.stringify(projectsConfig.map(p => p.name))}`;
			const cached = getCached<any[]>(cacheKey);
			if (cached) {
				return { repos: cached, error: false };
			}
			
			const pinnedRepoNames = projectsConfig.map(p => p.name).filter(Boolean);

			// Just return project metadata, no README fetching
			const repos = projectsConfig.map((project: any) => {
				const repoName = project.name;
				if (!repoName) return null;
				
				const pinnedData = PINNED[repoName] || {};
				
				return {
					error: false,
					md: '', // README will be loaded on-demand
					name: repoName,
					url: `https://github.com/FomasTreeman/${repoName}`,
					summary: project.summary || pinnedData.summary,
					image: project.image,
					customTitle: project.customTitle,
					...pinnedData
				};
			}).filter(Boolean);
			
			// Cache the results
			setCache(cacheKey, repos);
			
			return {
				repos,
				error: false
			};
		} catch (err) {
			return { error: true, repos: [] };
		}
	};
	const reposData = await getRepos();
	return {
		error: reposData.error,
		repos: reposData.repos,
		cmsContent,
		isLoggedIn
	};
}
