/**
 * Build-time feature flags.
 *
 * Flip a flag here and the whole site follows: nav entry, route, and sitemap.
 * A disabled page 404s rather than merely hiding from the nav, so it is not
 * reachable by direct URL and does not stay indexed.
 */

/**
 * The blog. Off while there is nothing published but the placeholder post —
 * set to `true` to bring /blogs and /blogs/[slug] back.
 */
export const BLOG_ENABLED = false;
