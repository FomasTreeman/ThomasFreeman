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
		scroll-margin: 70px;
	}

	section#about {
		height: auto;
		position: relative;
		margin: 0;
		background: transparent;
		padding: 0;
		scroll-margin: 0px;
	}

	section#projects {
		scroll-margin: 100px;
		padding-block: 4rem;
		background: linear-gradient(
			180deg,
			transparent 0%,
			rgb(5, 4, 5) 5%,
			rgb(5, 4, 5) 95%,
			transparent 100%
		);
	}

	.no-max-height {
		height: auto;
	}

	@media (max-width: 768px) {
		section#projects {
			scroll-margin: 40px;
			padding-block: 2rem;
		}

		section#home {
			height: calc(100vh - 4rem);
			scroll-margin: -30px;
		}
	}
</style>
