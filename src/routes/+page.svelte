<script lang="ts">
	import About from '../lib/About.svelte';
	import Block from '../lib/Block.svelte';
	import ReadMes from '../lib/ReadMes.svelte';
	import Footer from '../lib/Footer.svelte';
	// Example sections showcasing different scroll effects
	import SectionFade from '../lib/components/sections/SectionFade.svelte';
	import SectionParallaxBg from '../lib/components/sections/SectionParallaxBg.svelte';
	import SectionTransforms from '../lib/components/sections/SectionTransforms.svelte';

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

	<!-- EXAMPLE SECTIONS: Remove/keep based on your preference -->
	<!-- These demonstrate different Locomotive Scroll effects you can use -->
	
	<!-- Example 1: Simple fade transitions between sections -->
	<SectionFade title="Section Fade Effect" bg="#0f0f0f" />
	
	<!-- Example 2: Parallax background (image optional, shows placeholder) -->
	<SectionParallaxBg heading="Parallax Depth" speed={-2} />
	
	<!-- Example 3: Different transform effects side-by-side -->
	<SectionTransforms />
	
	<!-- Example 4: Another fade separator with different color -->
	<SectionFade title="Try Different Colors" bg="#1a1a2e" />
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
