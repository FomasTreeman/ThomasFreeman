<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/jetbrains-mono';
	import Background from '$lib/Background.svelte';
	import Header from '../lib/Header.svelte';
	import Footer from '../lib/Footer.svelte';
	import globe from '../globe.svg';

	let nav = false;
	let scrollY: number;
	let innerHeight: number;
	let scroll: number;
	// let scrollYLast: number;

	// const scrollYBufferSize = 50; //px;
	// $: {
	// 	if (scrollYLast === undefined) scrollYLast = scrollY;
	// 	console.log('scrolled', scrollYLast, scrollY + scrollYBufferSize);
	// 	if (scrollY >= scrollYLast + scrollYBufferSize || scrollY <= scrollYLast - scrollYBufferSize) {
	// 		scrollYLast = scrollY;
	// 		scroll = scrollY / innerHeight;
	// 		console.log('change');
	// 	}
	// }
	$: scroll = scrollY / innerHeight;
</script>

<Background />

{#if nav}
	<nav>
		<Header />
	</nav>
{/if}
<button class="globe-wrapper" on:click={() => (nav = !nav)}>
	<img
		class="globe"
		loading="eager"
		src={globe}
		alt="Menu - globe"
		style="animation-delay: calc({scroll} * -1s);"
	/>
</button>

<slot />
<Footer />

<svelte:window bind:scrollY bind:innerHeight />

<style>
	.globe-wrapper {
		position: fixed;
		right: 0px;
		top: 0px;
		width: 5rem;
		height: 5rem;
		background-color: transparent;
		margin: 1rem;
		padding: 0px;
		border: none;
		border-radius: 50%;
		padding-bottom: -2px; /* weird */
		z-index: 100;
	}
	.globe {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
		border-radius: 50%;
		animation: rotate 1s linear infinite;
		animation-play-state: paused;
	}

	nav {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 5rem;
		z-index: 100;
	}
</style>
