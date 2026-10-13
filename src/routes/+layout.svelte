<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/jetbrains-mono';
	import { page } from '$app/stores';
	import { gameActive } from '$lib/stores';
	import Background from '$lib/Background.svelte';
	import Header from '../lib/Header.svelte';
	import { absoluteUrl } from '$lib/site-meta.js';

	export let data;

	// The social card shown when any page is shared. The copy and the site's
	// public address come from the CMS (`site.meta`, edited at /cms/meta); the
	// image is static/og-image.png, regenerated with scripts/generate-og-image.mjs
	// when the copy changes.
	$: meta = data.meta;
	$: ogImage = absoluteUrl(meta, '/og-image.png');
	// Vercel serves the site on several hostnames. The canonical link and
	// og:url always name the primary one, for this page, so crawlers and
	// share counts consolidate there.
	$: canonical = absoluteUrl(meta, $page.url.pathname);

	$: isCMSRoute = $page.route.id?.startsWith('/cms');
	$: hideBackground = $page.route.id === '/play' || $page.route.id === '/play/leaderboard' || isCMSRoute;
	$: hideHeader = ($page.route.id === '/play' && $gameActive) || isCMSRoute;
	$: showCMSButton = data?.isLoggedIn && !isCMSRoute;
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<meta property="og:site_name" content={meta.siteName} />
	<meta property="og:title" content={meta.title} />
	<meta property="og:type" content="website" />
	<meta property="og:description" content={meta.description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={meta.title} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<!-- Keep any fixed overlays/header outside the scroll container -->
<div id="app">
	<!-- Fixed overlays: Background and Header stay outside scroll container for proper positioning -->
	{#if !hideBackground}
		<Background />
	{/if}
	{#if !hideHeader}
		<Header />
	{/if}

	<!-- Main scroll container -->
	<main>
		<slot />
	</main>

	<!-- Floating CMS Button (only visible when logged in and not on CMS pages) -->
	{#if showCMSButton}
		<a href="/cms" class="floating-cms-btn" title="Back to CMS">
			⚙️ CMS
		</a>
	{/if}
</div>

<style>
	main {
		min-height: 100%;
		padding-bottom: 0;
		/* Contain child margins. Without this a page's first-child top margin
		   collapses out through main and offsets main itself, which still keeps
		   its min-height: 100% — every such page then scrolls by exactly that
		   margin with nothing below to see. */
		display: flow-root;
	}

	#app {
		overflow-x: hidden;
	}

	.floating-cms-btn {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background: var(--cms-accent-gradient);
		color: var(--cms-accent-contrast);
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		box-shadow: 0 4px 20px var(--cms-accent-shadow);
		font-weight: 700;
		font-size: 0.9rem;
		text-decoration: none;
		z-index: 9999;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.floating-cms-btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 30px var(--cms-accent-shadow-strong);
	}

	@media (max-width: 768px) {
		.floating-cms-btn {
			bottom: 1rem;
			right: 1rem;
			padding: 0.6rem 1.2rem;
			font-size: 0.85rem;
		}
	}
</style>
