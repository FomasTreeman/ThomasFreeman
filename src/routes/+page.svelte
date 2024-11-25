<script lang="ts">
	import About from '../lib/About.svelte';
	import Block from '../lib/Block.svelte';
	import ReadMes from '../lib/ReadMes.svelte';

	export let data;
</script>

<main>
	<section id="about">
		<About />
	</section>

	<section id="project">
		<Block />
	</section>
	
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

	section {
		position: relative;
		height: 100vh;
		scroll-margin: 70px;
	}

	section#project {
		height: auto;
		position: relative;
		margin: 0%;
		background-color: rgb(5, 4, 5);
		padding-block: 5rem;
		margin-bottom: 8rem;
		scroll-margin: 0px;
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
