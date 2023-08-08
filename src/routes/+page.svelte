<script lang="ts">
	import About from '../lib/About.svelte';
	import Background from '../lib/Background.svelte';
	import ProjectTemplate from '../lib/ProjectTemplate.svelte';
	import ReadMes from '../lib/ReadMes.svelte';
	import Routes from '../lib/Routes.svelte';
	import Stack from '../lib/Stack.svelte';
	// import Contact from "./lib/Contact.svelte";

	let dark = true;
	let nav = false;
	let scrollY: number;
	let innerHeight: number;
	let scroll: number;

	$: scroll = scrollY / innerHeight;
</script>

<main style={dark ? '--backgroundColor: black' : '--backgroundColor: white'}>
	<Background />
	{#if nav}
		<nav>
			<Routes />
		</nav>
	{/if}
	<button class="globe" on:click={() => (nav = !nav)}>
		<img src="globe.webp" alt="globe" style="animation-delay: calc({scroll} * -1s);" />
	</button>
	<section id="about">
		<About />
	</section>

	<section id="project">
		<ProjectTemplate />
	</section>

	<div class="stack">
		<Stack />
	</div>

	<section id="readmes">
		<h1 class="center title">MY PROJECTS.</h1>
		<ReadMes />
	</section>
</main>
<svelte:window bind:scrollY bind:innerHeight />

<style>
	:global(:root) {
		--margin-left: 5rem;
	}

	:global(.center) {
		display: block;
		text-align: center;
		margin-inline: auto;
	}

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

	section {
		position: relative;
		height: 50rem;
		scroll-margin: 70px;
	}

	section#about {
		padding-top: 3rem;
	}

	section#project {
		position: relative;
		margin: 0%;
		background-color: rgb(5, 4, 5);
		padding-block: 5rem;
		margin-bottom: 8rem;
		scroll-margin: 0px;
		scroll-snap-align: start;
	}

	.stack {
		width: 100vw;
		overflow-x: hidden;
	}

	.title {
		font-size: xx-large;
	}

	#readmes .title {
		margin-top: 5rem;
		max-width: max-content;
		padding: 1rem;
		border: 0.5rem solid var(--color);
	}

	img[alt='globe'] {
		position: relative;
		width: 100%;
		animation: rotate 1s linear infinite;
		animation-play-state: paused;
		z-index: 20;
	}
</style>
