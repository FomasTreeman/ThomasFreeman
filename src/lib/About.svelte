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
	<h1>Hi, I'm Tom Freeman 🖖</h1>
	<p>
		As a software developer, I relish the opportunity to create groundbreaking technologies that
		solve complex problems and improve people's lives. I am fascinated by the constantly evolving
		tech industry and thrive in fast-paced environments that challenges me to learn and apply new
		technologies. I look forward to sharing my unique perspective and learning from others as I
		embark on a successful and rewarding career in software development. <br />
	</p>
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
		padding: calc(var(--margin-left) / 2);
		background-color: blue;
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
