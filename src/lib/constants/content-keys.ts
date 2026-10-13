/**
 * Keys in the `content` table that have a dedicated editor rather than being
 * edited as raw JSON on the CMS home page.
 */
export const RESOURCES_KEY = 'resources.links';
export const PROJECTS_KEY = 'projects.config';
/**
 * Unsaved projects edits, written by the editor's Preview button. The site uses
 * it instead of PROJECTS_KEY while logged in. It is its own key because the
 * content table holds one row per key, so a draft of PROJECTS_KEY itself would
 * hide the live projects from everyone until published.
 */
export const PROJECTS_PREVIEW_KEY = 'projects.config.preview';
/** Site-wide title, description and social-card copy. See `$lib/site-meta`. */
export const SITE_META_KEY = 'site.meta';

export const DEDICATED_KEYS = [PROJECTS_KEY, PROJECTS_PREVIEW_KEY, RESOURCES_KEY, SITE_META_KEY];
