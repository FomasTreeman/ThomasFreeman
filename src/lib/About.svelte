<script>
	import { onMount } from 'svelte';
	import ScrollDownPrompt from './ScrollDownPrompt.svelte';
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
		<Scene />
	</div>
</div>
<div class="wrapper">
	<div class="background">
		<h1>Hi, I'm Tom Freeman 🖖</h1>
		<p>
			As a software developer, I absolutely love diving into the world of technology and crafting
			innovative solutions that make life better. I'm super excited about the ever-changing tech
			scene and I'm at my best when I'm in a fast-paced environment that pushes me to explore new
			technologies. I can't wait to share my fresh ideas and learn from others, in this passionate
			community! <br />
		</p>
	</div>
	{#if shouldPromptScroll}
		<div class="absolute-wrapper">
			<ScrollDownPrompt />
		</div>
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
	}

	div.background {
		mix-blend-mode: luminosity;
		background-color: blue;
		border-radius: 1rem;
		text-align: center;
		padding: calc(var(--margin-left) / 2);
		max-width: 75%;
	}

	h1 {
		font-size: xxx-large;
		z-index: 1;
	}

	p {
		font-weight: 500;
		padding: calc(var(--margin-left) / 2);
	}

	div.model-wrapper {
		max-width: 100%;
	}
	.model {
		overflow: hidden;
		z-index: -1;
	}

	div.absolute-wrapper {
		position: absolute;
		bottom: 5rem;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: xx-large;
		}

		p {
			font-size: small;
		}
	}
</style>
