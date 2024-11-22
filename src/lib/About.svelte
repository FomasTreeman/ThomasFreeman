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
	<div class="isolate">
		<div class="background" />
		<div class="inner">
			<h1>Hi, I'm Tom Freeman 🖖</h1>
			<h2>Full Stack Developer</h2>
			<p>23 year old with a passion for creating beautiful and efficient applications.</p>
			<a href="/Tom_Freeman.pdf" download class="tracer-border">
				<svg
					stroke="currentColor"
					fill="currentColor"
					stroke-width="0"
					viewBox="0 0 384 512"
					class="mr-2"
					height="18"
					width="18"
					xmlns="http://www.w3.org/2000/svg"
					data-darkreader-inline-stroke=""
					style="--darkreader-inline-stroke: currentColor; --darkreader-inline-fill: currentColor;"
					data-darkreader-inline-fill=""
					><path
						d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm76.45 211.36l-96.42 95.7c-6.65 6.61-17.39 6.61-24.04 0l-96.42-95.7C73.42 337.29 80.54 320 94.82 320H160v-80c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v80h65.18c14.28 0 21.4 17.29 11.27 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"
					/></svg
				>
				<p>Resume</p>
			</a>
		</div>
	</div>
	{#if shouldPromptScroll}
		<div class="absolute-wrapper">
			<ScrollDownPrompt />
		</div>
	{/if}
</div>

<style>
	.tracer-border {
		padding: 7px 15px;
		margin: 0px;
		background-color: transparent;
		vertical-align: middle;
		display: flex;
		position: relative;
		align-items: center;
		gap: 0.6rem;
		border-radius: 1000px;
		background: linear-gradient(0deg, #000, #272727);
		transition: all 0.5s ease;
	}

	.tracer-border:hover {
		background: transparent;
		color: black;
	}

	.tracer-border p {
		margin: 0;
	}

	.tracer-border:before,
	.tracer-border:after {
		content: '';
		position: absolute;
		left: -2px;
		top: -2px;
		width: calc(100% + 4px);
		height: calc(100% + 4px);
		z-index: -1;
		border-radius: 1000px;
		background: linear-gradient(66deg, #ff8b00, #0c79fe, #f9dc02, #47bfff);
		background-size: 400% 400%;

		-webkit-animation: steam 3s ease infinite;
		-moz-animation: steam 3s ease infinite;
		animation: steam 3s ease infinite;
	}

	@-webkit-keyframes steam {
		0% {
			background-position: 0% 47%;
		}
		50% {
			background-position: 100% 54%;
		}
		100% {
			background-position: 0% 47%;
		}
	}
	@-moz-keyframes steam {
		0% {
			background-position: 0% 47%;
		}
		50% {
			background-position: 100% 54%;
		}
		100% {
			background-position: 0% 47%;
		}
	}
	@keyframes steam {
		0% {
			background-position: 0% 47%;
		}
		50% {
			background-position: 100% 54%;
		}
		100% {
			background-position: 0% 47%;
		}
	}

	.tracer-border:after {
		filter: blur(50px);
	}

	div.wrapper {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	div.background {
		mix-blend-mode: luminosity;
		background-color: blue;
		position: absolute;
		height: 100%;
		width: 100%;
		border-radius: 1rem;
	}

	.isolate {
		position: relative;
	}

	.inner {
		z-index: 2;
		position: relative;
		text-align: center;
		padding-inline: calc(var(--margin-left) / 4 * 3);
		padding-block: var(--margin-left);
	}

	.inner > h1 {
		font-size: xxx-large;
		z-index: 1;
		margin-block: 0;
	}

	.inner > h2 {
		margin-block: 0;
		opacity: 0.8;
	}

	.inner > p {
		margin-top: 1.5rem;
		font-weight: 500;
		/* padding: calc(var(--margin-left) / 2); */
		opacity: 0.9;
		margin-bottom: 0;
	}

	.inner > a {
		width: fit-content;
		margin-top: 2rem;
		margin-inline: auto;
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
			padding: 0px;
		}
		div.background {
			padding-top: 14px;
		}
	}
</style>
