<script lang="ts">
	import About from '../lib/About.svelte';
	import BetBotPage from '../lib/BetBotPage.svelte';
	import ReadMes from '../lib/ReadMes.svelte';
	import Stack from '../lib/Stack.svelte';

	export let data;
</script>

<main>
	<section id="about">
		<About />
	</section>

	<section id="project">
		<BetBotPage />
	</section>

	<div class="stack">
		<Stack />
	</div>
	<section id="readmes" class="no-max-height">
		<h1 class="center title">MY PROJECTS.</h1>
		<ReadMes {data} />
	</section>
</main>

<style>
	:global(:root) {
		--margin-left: 5rem;
	}

	:global(.center) {
		display: block;
		text-align: center;
		margin-inline: auto;
	}

	section {
		position: relative;
		height: calc(100vh + 76px);
		scroll-margin: 70px;
	}

	/* section#about {
		padding-top: 3rem;
	} */

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
		margin-top: 5rem;
		max-width: max-content;
		padding: 1rem;
		border: 0.5rem solid var(--color);
	}

	.no-max-height {
		height: auto;
	}
</style>
