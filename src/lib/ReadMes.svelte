<script lang="ts">
	import ReadMeCard from './ReadMeCard.svelte';
	import type { Data } from '$lib/types';
	import { onMount, onDestroy } from 'svelte';

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
				<!-- <Saos
					animation={'slide-in 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}
					top={250}
					bottom={250}
					once
				> -->
				<ReadMeCard {repo} {index} gradientCenter={gradients[repo.name]} />
				<!-- </Saos> -->
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
		background-color: blue;
		mix-blend-mode: luminosity;
		border-radius: 1000px;
		/* box-shadow: 2px 1px 100px 59px rgba(77, 77, 77, 0.53);
		-webkit-box-shadow: 2px 1px 100px 59px rgba(77, 77, 77, 0.53);
		-moz-box-shadow: 2px 1px 100px 59px rgba(77, 77, 77, 0.53); */
		/* border: 0.5rem solid var(--color); */
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
			gap: 0;
			margin-bottom: 1.5rem;
		}
	}
</style>
