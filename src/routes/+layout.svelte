<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/jetbrains-mono';
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { gameActive } from '$lib/stores';
	import { useLoco, refreshLoco } from '$lib/scroll/loco';
	import Background from '$lib/Background.svelte';
	import Header from '../lib/Header.svelte';

	let container: HTMLElement;

	$: hideBackground = $page.route.id === '/play' || $page.route.id === '/play/leaderboard';
	$: hideHeader = $page.route.id === '/play' && $gameActive;

	// Ensure Locomotive updates after client-side navigations
	if (browser) {
		afterNavigate(() => {
			// Wait a tick for DOM changes then refresh
			requestAnimationFrame(() => refreshLoco());
		});
	}
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

	<!-- Main scroll container with Locomotive -->
	<main bind:this={container} data-scroll-container use:useLoco>
		<slot />
	</main>
</div>

<style>
	main[data-scroll-container] {
		/* Ensures Locomotive transforms the right element */
		min-height: 100%;
	}
</style>
