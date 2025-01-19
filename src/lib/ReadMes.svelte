<script lang="ts">
	import ReadMeCard from './ReadMeCard.svelte';
	import type { Data } from '$lib/types';
	import { onMount } from 'svelte';

	export let data: Data;

	let projectElements: NodeListOf<HTMLElement>;

	let gradients: { [key: string]: { x: string; y: string } } = {};

	function normalizeCoordinates(screenX: number, screenY: number, element: HTMLElement) {
		const rect = element.getBoundingClientRect();

		const relativeX = screenX - rect.left;
		const relativeY = screenY - rect.top;

		return { relativeX, relativeY };
	}

	function handleMouseMove(event: MouseEvent) {
		const { clientX, clientY } = event;
		projectElements.forEach((element) => {
			const { relativeX, relativeY } = normalizeCoordinates(clientX, clientY, element);
			if (!element.dataset.project) return;
			gradients[element.dataset.project] = { x: `${relativeX}px`, y: `${relativeY}px` };
			gradients = { ...gradients };
		});
	}

	onMount(() => {
		window.addEventListener('mousemove', handleMouseMove);
		projectElements = document.querySelectorAll('[data-project]');
	});
</script>

<h2 class="center title">My Projects</h2>
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
	h2.title {
		font-size: 2rem;
		margin-top: 5rem;
		max-width: max-content;
		padding-block: 1rem;
		padding-inline: 2rem;
		background: blue;
		mix-blend-mode: luminosity;
		border-radius: 1000px;
	}

	.grid {
		margin: 5rem;
		margin-inline: var(--margin-left);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
		gap: 1.3rem;
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
