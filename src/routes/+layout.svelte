<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/jetbrains-mono';
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import Header from '../lib/Header.svelte';

	// Hide background on play page to avoid visual interference with the game
	$: hideBackground = $page.route.id === '/play';
</script>

{#if !hideBackground}
	<Background />
{/if}
<Header />
<slot />
