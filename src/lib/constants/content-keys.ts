/**
 * Keys in the `content` table that have a dedicated editor rather than being
 * edited as raw JSON on the CMS home page.
 */
export const RESOURCES_KEY = 'resources.links';
export const PROJECTS_KEY = 'projects.config';
/** Site-wide title, description and social-card copy. See `$lib/site-meta`. */
export const SITE_META_KEY = 'site.meta';

export const DEDICATED_KEYS = [PROJECTS_KEY, RESOURCES_KEY, SITE_META_KEY];
