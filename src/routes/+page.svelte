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
	<section id="home" data-scroll-section>
		<About />
	</section>

	<!-- Journey/Timeline section -->
	<section id="about" data-scroll-section>
		<Block />
	</section>

	<!-- Projects section -->
	<section id="projects" class="no-max-height" data-scroll-section>
		<ReadMes {data} />
	</section>
	
	<!-- Footer section -->
	<div data-scroll-section>
		<Footer />
	</div>
</main>

<style>
	/* Section spacing variables for consistent rhythm */
	:root {
		--section-y: clamp(64px, 8vw, 128px);
		--header-offset: clamp(64px, 7vw, 96px);
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
		scroll-margin-top: calc(var(--header-offset) + 16px);
	}

	section#about {
		height: auto;
		position: relative;
		margin: 0;
		background: transparent;
		padding-block: var(--section-y);
		scroll-margin-top: calc(var(--header-offset) + 16px);
	}

	section#projects {
		scroll-margin-top: calc(var(--header-offset) + 16px);
		padding-block: var(--section-y);
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
