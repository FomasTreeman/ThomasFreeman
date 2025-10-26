<script lang="ts">
	import ReadMeCard from './ReadMeCard.svelte';
	import type { Data } from '$lib/types';
	import { onMount } from 'svelte';

	let { data }: { data: Data } = $props();

	let gradients = $state<{ [key: string]: { x: string; y: string } }>({});

	function normalizeCoordinates(screenX: number, screenY: number, element: HTMLElement) {
		const rect = element.getBoundingClientRect();

		const relativeX = screenX - rect.left;
		const relativeY = screenY - rect.top;

		return { relativeX, relativeY };
	}

	function handleMouseMove(event: MouseEvent) {
		const { clientX, clientY } = event;
		// Query elements dynamically since they may not exist yet
		const elements = document.querySelectorAll<HTMLElement>('[data-project]');
		elements.forEach((element) => {
			const { relativeX, relativeY } = normalizeCoordinates(clientX, clientY, element);
			if (!element.dataset.project) return;
			gradients[element.dataset.project] = { x: `${relativeX}px`, y: `${relativeY}px` };
		});
	}

	onMount(() => {
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<div class="header-section">
	<h2 class="center title">My Projects</h2>
	<p class="subtitle">Building with blockchain, web3, and modern tech</p>
</div>
{#if data.error}
	<h2 class="center">Whoops error 😔</h2>
{:else}
	{#await data?.repos}
		<h2>Loading ...</h2>
	{:then repos}
		<section class="grid">
			{#each repos as repo, index}
				<ReadMeCard {repo} {index} gradientCenter={gradients[repo.name]} />
			{/each}
		</section>
	{/await}
{/if}

<style>
.header-section {
	text-align: center;
	margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

h2.title {
	font-size: clamp(1.75rem, 4vw, 2.5rem);
	margin-top: 0;
	margin-bottom: 0.75rem;
	max-width: max-content;
	padding-block: 0.875rem;
	padding-inline: 2rem;
	background: blue;
	mix-blend-mode: luminosity;
	border-radius: 1000px;
}

.subtitle {
	font-family: 'JetBrains Mono Variable', monospace;
	font-size: 1rem;
	opacity: 0.7;
	margin: 0;
	margin-top: 1rem;
}

.grid {
	margin-block: 0;
	margin-inline: clamp(1.5rem, 5vw, var(--margin-left));
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
	gap: clamp(1.5rem, 3vw, 2rem);
}

	@media only screen and (max-width: 1000px) {
		.grid {
			grid-template-columns: 1fr;
			margin-top: 0px;
			margin-inline: var(--margin-left);
			margin-bottom: 5rem;
		}
	}

	@media only screen and (max-width: 768px) {
		.grid {
			margin: 0px;
			margin-bottom: 5rem;
		}
	}

	.center {
		display: flex;
		justify-content: center;
	}

	@-webkit-keyframes -global-slide-in {
		0% {
			transform: translateY(1000px);
			opacity: 0;
		}
		100% {
			transform: translateY(0px);
			opacity: 1;
		}
	}
	@keyframes -global-slide-in {
		0% {
			transform: translateY(1000px);
			opacity: 0;
		}
		100% {
			transform: translateY(0px);
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.grid {
			gap: 25px;
		margin-bottom: 1.5rem;
	}
}

@supports (-webkit-appearance: none) {
	h2.title {
		mix-blend-mode: normal;
		background: rgba(1, 1, 1, 0.6);
		backdrop-filter: blur(20px) saturate(1.7);
	}
}
</style>
