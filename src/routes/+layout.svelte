<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/jetbrains-mono';
	import { page } from '$app/stores';
	import { gameActive } from '$lib/stores';
	import Background from '$lib/Background.svelte';
	import Header from '../lib/Header.svelte';

	$: hideBackground = $page.route.id === '/play' || $page.route.id === '/play/leaderboard';
	$: hideHeader = $page.route.id === '/play' && $gameActive;
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
</div>

<style>
	main {
		min-height: 100%;
		padding-bottom: 0;
	}

	#app {
		overflow-x: hidden;
	}
</style>
