<script lang="ts">
	import '../app.css';
	import Background from '$lib/Background.svelte';
	import Routes from '../lib/Routes.svelte';

	let nav = false;
	let scrollY: number;
	let innerHeight: number;
	let scroll: number;

	$: scroll = scrollY / innerHeight;
</script>

<Background />

{#if nav}
	<nav>
		<Routes />
	</nav>
{/if}
<button class="globe" on:click={() => (nav = !nav)}>
	<img src="globe.webp" alt="globe" style="animation-delay: calc({scroll} * -1s);" />
</button>

<slot />

<svelte:window bind:scrollY bind:innerHeight />

<style>
	.globe {
		position: fixed;
		right: 0px;
		margin: 1rem;
		width: 5rem;
		height: 5rem;
		padding: 0px;
		background-color: transparent;
		z-index: 100;
		border-radius: 50%;
	}

	nav {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 5rem;
		z-index: 100;
	}
	img[alt='globe'] {
		position: relative;
		width: 100%;
		animation: rotate 1s linear infinite;
		animation-play-state: paused;
		z-index: 20;
	}
</style>
