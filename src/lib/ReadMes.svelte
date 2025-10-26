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

<h2 class="center title glass" data-scroll data-scroll-speed="0.7">My Projects</h2>
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
	padding-block: 0.75rem;
	padding-inline: 1.5rem;
	border-radius: 12px;
	position: relative;
}

.grid {
	margin-block: 3rem 5rem;
	margin-inline: var(--margin-left);
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
	gap: clamp(18px, 2.5vw, 28px);
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

</style>
