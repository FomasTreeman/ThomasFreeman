import PINNED from '$lib/utils/repos.js';
import type { Data, IRepo } from '$lib/types.js';
import { getContentMany } from '$lib/db/content.js';
import { verifySession } from '$lib/auth/magic-link.js';

interface ProjectConfig {
	name: string;
	summary?: string;
	description?: string;
	image?: string;
	customTitle?: string;
	production?: string;
	externalLinks?: IRepo['externalLinks'];
}

const CMS_KEYS = [
	'footer.content',
	'journey.header',
	'journey.experiences',
	'homepage.hero.title',
	'homepage.hero.subtitle',
	'about.bio',
	'about.resume_url',
	'about.resume_label',
	'contact.email',
	'about.social_links',
	'projects.config'
];

/**
 * Parse a JSON content value, falling back to `fallback` if the stored value is
 * missing or malformed. Per-key so that one bad entry cannot blank the page.
 */
function parseJSON<T>(raw: string | undefined, fallback: T): T {
	if (!raw) return fallback;
	try {
		return JSON.parse(raw) as T;
	} catch {
		console.error('Malformed JSON in CMS content; falling back to default');
		return fallback;
	}
}

function buildCMSContent(values: Map<string, string>) {
	return {
		footer: parseJSON(values.get('footer.content'), {}),
		journey: {
			header: parseJSON(values.get('journey.header'), {}),
			experiences: parseJSON(values.get('journey.experiences'), [])
		},
		hero: {
			title: values.get('homepage.hero.title') || "Hi, I'm Tom Freeman 🖖",
			subtitle: values.get('homepage.hero.subtitle') || 'Software Dev.',
			bio:
				values.get('about.bio') ||
				"I'm a developer with a passion for creating beautiful and efficient applications.",
			resumeUrl: values.get('about.resume_url') || '/Tom_Freeman.pdf',
			resumeLabel: values.get('about.resume_label') || 'Resume'
		},
		contact: {
			email: values.get('contact.email') || 'tom@team-freeman.com'
		},
		socialLinks: parseJSON(values.get('about.social_links'), [])
	};
}

function buildRepos(projectsConfig: ProjectConfig[]): Data {
	const repos = projectsConfig
		.filter((project) => Boolean(project?.name))
		.map((project) => {
			const pinnedData = PINNED[project.name] || {};

			return {
				...pinnedData,
				error: false,
				name: project.name,
				url: `https://github.com/FomasTreeman/${project.name}`,
				summary: project.summary || pinnedData.summary,
				description: project.description || pinnedData.description || '',
				image: project.image,
				customTitle: project.customTitle,
				production: project.production || pinnedData.production,
				externalLinks: project.externalLinks || pinnedData.externalLinks || []
			};
		});

	return { repos, error: false };
}

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	const sessionToken = cookies.get('cms_session');
	const isLoggedIn = (await verifySession(sessionToken || '')) !== null;

	let values = new Map<string, string>();
	try {
		values = await getContentMany(CMS_KEYS, isLoggedIn);
	} catch (error) {
		// The site still renders from the defaults below, so degrade rather than 500
		console.error('Failed to load CMS content:', error);
	}

	const defaultProjects = Object.keys(PINNED).map((name) => ({ name }));
	const projectsConfig = parseJSON<ProjectConfig[]>(values.get('projects.config'), defaultProjects);

	return {
		...buildRepos(projectsConfig.length > 0 ? projectsConfig : defaultProjects),
		cmsContent: buildCMSContent(values),
		isLoggedIn
	};
}
