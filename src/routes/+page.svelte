<script lang="ts">
	import About from '../lib/About.svelte';
	import Block from '../lib/Block.svelte';
	import ReadMes from '../lib/ReadMes.svelte';
	import Footer from '../lib/Footer.svelte';

	export let data;
</script>

<main>
	<section id="home">
		<About />
	</section>

	<section id="about">
		<Block />
	</section>

	<section id="projects" class="no-max-height">
		<ReadMes {data} />
	</section>
</main>

<Footer />

<style>
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

	section {
		position: relative;
		height: 100vh;
		min-height: min(100svh, 900px);
		scroll-margin-top: 20px;
		scroll-behavior: smooth;
	}

	section#about {
		height: auto;
		position: relative;
		margin: 0;
		background: transparent;
		padding-block: 0;
		scroll-margin-top: 20px;
	}

	section#projects {
		position: relative;
		scroll-margin-top: 20px;
		padding-block: var(--section-padding-y);
		background: rgb(5, 4, 5);
		overflow: visible;
	}

	.no-max-height {
		height: auto;
	}

	@media (max-width: 768px) {
		section {
			scroll-margin-top: 0;
		}

		section#about {
			scroll-margin-top: 0;
		}

		section#projects {
			scroll-margin-top: 0;
			padding-block: 2rem;
			padding-inline: 1.25rem;
		}

		section#home {
			height: calc(100vh - 4rem);
			scroll-margin-top: 0;
		}
	}
</style>
