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
		margin: 0%;
		background-color: rgb(5, 4, 5);
		padding-block: 5rem;
		margin-bottom: 8rem;
		scroll-margin: 0px;
	}

	section#projects {
		scroll-margin: 100px;
	}

	.no-max-height {
		height: auto;
	}

	@media (max-width: 768px) {
		section#about {
			padding-block: 1.5rem;
		}

		section#projects {
			scroll-margin: 40px;
		}

		section#home {
			height: calc(100vh - 4rem);
			scroll-margin: -30px;
		}
	}
</style>
