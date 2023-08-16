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
		<ReadMes {data} />
	</section>
</main>

<style>
	:global(:root) {
		--margin-left: 5rem;
	}
	:global(h1) {
		font-size: 3.5rem;
	}
	:global(h2) {
		font-size: 2rem;
	}
	:global(h3) {
		font-size: 1.5rem;
	}
	:global(p) {
		font-size: 1rem;
	}
	:global(.center) {
		display: block;
		text-align: center;
		margin-inline: auto;
	}

	main {
		scroll-snap-type: y mandatory;
	}

	section {
		position: relative;
		height: 100vh;
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
		scroll-snap-stop: always;
	}

	.stack {
		width: 100vw;
		overflow-x: hidden;
	}

	.no-max-height {
		height: auto;
	}

	@media (min-width: 1440px) {
		:global(:root) {
			--margin-left: 8rem;
		}
		:global(h1) {
			font-size: 4.5rem !important;
		}
		:global(h2) {
			font-size: 3rem !important;
		}
		:global(h3) {
			font-size: 2.5rem;
		}
		:global(p) {
			font-size: 1.5rem;
		}
	}
</style>
