<script lang="ts">
	import About from '../lib/About.svelte';
	import Journey from '../lib/Journey.svelte';
	import ReadMes from '../lib/ReadMes.svelte';
	import Footer from '../lib/Footer.svelte';

	export let data;
</script>

<!-- Home/Hero section with R2D2 -->
<section id="home">
	<About 
		heroData={data?.cmsContent?.hero} 
		contactData={data?.cmsContent?.contact}
		socialLinks={data?.cmsContent?.socialLinks}
	/>
</section>

<!-- Journey/Timeline section -->
<section id="about">
	<Journey journeyData={data?.cmsContent?.journey} />
</section>

<!-- Projects section -->
<section id="projects" class="no-max-height">
	<ReadMes {data} />
</section>

<!-- Footer section -->
<div class="footer-container">
	<Footer footerData={data?.cmsContent?.footer} />
</div>

<style>
	:global(h1) {
		font-size: clamp(2rem, 5vw, 3.5rem);
	}
	:global(h2) {
		font-size: clamp(1.5rem, 3.5vw, 2rem);
	}
	:global(h3) {
		font-size: clamp(1.25rem, 2.5vw, 1.5rem);
	}
	:global(p) {
		font-size: clamp(0.95rem, 1.5vw, 1rem);
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
	}

	section#projects {
		position: relative;
		padding-block: clamp(3rem, 5vw, 4.5rem);
		background: rgb(5, 4, 5);
		overflow: visible;
	}

	.no-max-height {
		height: auto;
	}

	.footer-container {
		padding-block: clamp(2.5rem, 4vw, 3.5rem);
		min-height: auto;
	}

	@media (max-width: 768px) {
		section {
			scroll-margin-top: 0;
		}

		section#projects {
			padding-block: 2rem;
			padding-inline: 1.25rem;
		}

		section#home {
			height: calc(100vh - 4rem);
		}

		.footer-container {
			padding-block: 2rem;
		}
	}
</style>
