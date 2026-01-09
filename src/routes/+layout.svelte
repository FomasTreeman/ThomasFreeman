<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/jetbrains-mono';
	import { page } from '$app/stores';
	import { gameActive } from '$lib/stores';
	import Background from '$lib/Background.svelte';
	import Header from '../lib/Header.svelte';

	export let data;

	$: isCMSRoute = $page.route.id?.startsWith('/cms');
	$: hideBackground = $page.route.id === '/play' || $page.route.id === '/play/leaderboard' || isCMSRoute;
	$: hideHeader = ($page.route.id === '/play' && $gameActive) || isCMSRoute;
	$: showCMSButton = data?.isLoggedIn && !isCMSRoute;
</script>

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
	}

	#app {
		overflow-x: hidden;
	}

	.floating-cms-btn {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
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
		box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
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
