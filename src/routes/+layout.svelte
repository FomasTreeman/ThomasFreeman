<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/jetbrains-mono';
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import Header from '../lib/Header.svelte';

	$: hideBackground = $page.route.id === '/play' || $page.route.id === '/leaderboard';
</script>

{#if !hideBackground}
	<Background />
{/if}
<Header />
<slot />
