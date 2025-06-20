<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/jetbrains-mono';
	import { page } from '$app/stores';
	import { gameActive } from '$lib/stores';
	import Background from '$lib/Background.svelte';
	import Header from '../lib/Header.svelte';

	$: hideBackground = $page.route.id === '/play' || $page.route.id === '/leaderboard';
	$: hideHeader = $page.route.id === '/play' && $gameActive;
</script>

{#if !hideBackground}
	<Background />
{/if}
{#if !hideHeader}
	<Header />
{/if}
<slot />
