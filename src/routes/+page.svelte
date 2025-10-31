<script lang="ts">
	import About from '../lib/About.svelte';
	import Block from '../lib/Block.svelte';
	import ReadMes from '../lib/ReadMes.svelte';
	import Footer from '../lib/Footer.svelte';

	export let data;
</script>

<main>
	<!-- EXISTING SECTIONS: Now enhanced with data-scroll-section -->
	
	<!-- Home/Hero section with R2D2 -->
	<section id="home">
		<About />
	</section>

	<!-- Journey/Timeline section -->
	<section id="about">
		<Block />
	</section>

	<!-- Projects section -->
	<section id="projects" class="no-max-height">
		<ReadMes {data} />
	</section>
	
	<!-- Footer section -->
	<div class="footer-container">
		<Footer />
	</div>
</main>

<style>
	/* Section spacing variables for consistent rhythm */
	:root {
		--section-padding-y: clamp(3rem, 8vw, 6rem);
		--section-gap: clamp(2rem, 5vw, 4rem);
		--header-offset: clamp(64px, 7vw, 96px);
		--content-max-width: 1400px;
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

	.footer-container {
		padding-bottom: clamp(3rem, 6vw, 5rem);
		min-height: clamp(3rem, 6vw, 5rem);
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

		.footer-container {
			padding-bottom: 7rem;
			min-height: 7rem;
		}
	}
</style>
