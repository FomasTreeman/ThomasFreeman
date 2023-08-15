<script>
	import { onMount } from 'svelte';
	import ScrollDownPrompt from './ScrollDownPrompt.svelte';
	// import ThreeD from './ThreeD.svelte';
	import Scene from './Scene.svelte';

	let shouldPromptScroll = false;
	onMount(() => {
		setTimeout(() => {
			shouldPromptScroll = true;
		}, 2000);
	});
</script>

<div class="model-wrapper">
	<div class="model">
		<!-- <ThreeD /> -->
		<Scene />
	</div>
</div>
<div class="wrapper">
	<h1>Hi, I'm Tom Freeman 🖖</h1>
	<p>
		As a software developer, I relish the opportunity to create groundbreaking technologies that
		solve complex problems and improve people's lives. I am fascinated by the constantly evolving
		tech industry and thrive in fast-paced environments that challenges me to learn and apply new
		technologies. I look forward to sharing my unique perspective and learning from others as I
		embark on a successful and rewarding career in software development. <a
			href="https://fac-portfolio.vercel.app/"
		>
			🎊 Click the 🌍 for extras. Visit my FAC portfolio briefly too 📛
		</a>
	</p>
	{#if shouldPromptScroll}
		<ScrollDownPrompt />
	{/if}
</div>

<style>
	div.wrapper {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		/* max-width: 50%; */
	}

	h1 {
		font-size: xxx-large;
		z-index: 1;
	}

	p {
		text-align: center;
		max-width: 75%;
		font-weight: 500;
		mix-blend-mode: luminosity;
		border-radius: 1rem;
		padding: 2rem;
		background-color: blue;
	}

	a {
		opacity: 0.8;
	}
	a:hover {
		opacity: 1;
	}

	div.model-wrapper {
		max-width: 100%;
	}
	.model {
		/* height: 5rem;
		width: 15rem; */
		/* margin-left: 40%; */
		overflow: hidden;
		z-index: -1;
	}

	@media (max-width: 768px) {
		/* .model {
			width: 10rem;
			height: 10rem;
		} */

		h1 {
			font-size: x-large;
		}

		p {
			font-size: small;
		}
	}
</style>
