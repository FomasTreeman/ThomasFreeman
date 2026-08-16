import { expect, test } from '@playwright/test';
import { BLOG_ENABLED } from '../src/lib/constants/features.js';

test.describe('public pages', () => {
	test('home page renders and is titled', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Tom Freeman/);
		await expect(page.locator('#home')).toBeVisible();
	});

	test('nav links reach every public section', async ({ page }) => {
		await page.goto('/');
		// Blog and Resources are conditional, so only assert on what the nav
		// actually offers rather than a hardcoded list that drifts from it.
		const labels = await page.locator('nav li:not(.home-items) a').allInnerTexts();
		expect(labels).toContain('Play');

		for (const label of labels) {
			await page.goto('/');
			await page.getByRole('link', { name: label, exact: true }).click();
			await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase()}s?$`));
		}
	});

	test('the nav offers Blog only when the blog is enabled', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('nav').getByRole('link', { name: 'Blog', exact: true })).toHaveCount(
			BLOG_ENABLED ? 1 : 0
		);
	});

	test('resources page renders', async ({ page }) => {
		await page.goto('/resources');
		await expect(page.getByRole('heading', { name: 'Resources', level: 1 })).toBeVisible();
	});

	test('the nav hides Resources while none are published', async ({ page }) => {
		await page.goto('/resources');
		const published = await page.locator('a.card').count();
		await expect(page.locator('nav').getByRole('link', { name: 'Resources' })).toHaveCount(
			published > 0 ? 1 : 0
		);
	});

	test('blog routes follow the flag', async ({ page }) => {
		const listing = await page.goto('/blogs');
		expect(listing?.status()).toBe(BLOG_ENABLED ? 200 : 404);

		if (BLOG_ENABLED) {
			await page.locator('a.blog-card').first().click();
			// Regression: the listing used to build an underscore slug for a
			// hyphenated filename, so this navigation 500d
			await expect(page.locator('section.content')).toBeVisible();
		} else {
			// disabled means genuinely unreachable, not merely unlinked
			const post = await page.goto('/blogs/btc-as-money');
			expect(post?.status()).toBe(404);
		}
	});

	test('an unknown blog slug is a 404, not a 500', async ({ page }) => {
		const response = await page.goto('/blogs/does-not-exist');
		expect(response?.status()).toBe(404);
	});

	test('sitemap and robots are served', async ({ page }) => {
		const sitemap = await page.goto('/sitemap.xml');
		expect(sitemap?.status()).toBe(200);
		const xml = (await sitemap?.text()) ?? '';
		expect(xml).toContain('<urlset');
		// a disabled blog 404s, so advertising it to crawlers would be a dead link
		expect(xml.includes('/blogs')).toBe(BLOG_ENABLED);

		const robots = await page.goto('/robots.txt');
		expect(robots?.status()).toBe(200);
		expect(await robots?.text()).toContain('Sitemap:');
	});
});

test.describe('CMS access control', () => {
	for (const path of ['/cms', '/cms/projects', '/cms/resources']) {
		test(`${path} redirects an anonymous visitor to login`, async ({ page }) => {
			await page.goto(path);
			await expect(page).toHaveURL(/\/cms\/login/);
		});
	}

	for (const path of [
		'/api/cms/content',
		'/api/images',
		'/api/history',
		'/api/repos',
		'/api/cms/link-metadata?url=https://example.com'
	]) {
		test(`${path} is 401 without a session`, async ({ request }) => {
			const response = await request.get(path);
			expect(response.status()).toBe(401);
		});
	}

	test('the login page does not send an email just by being loaded', async ({ page }) => {
		await page.goto('/cms/login');
		// Regression: the magic link used to be sent from `load`, so any GET of
		// this page mailed the admin. Sending is now a form action.
		await expect(page.getByRole('button', { name: /Email me a login link/i })).toBeVisible();
		await expect(page.getByText(/Login link sent/i)).toHaveCount(0);
	});
});
