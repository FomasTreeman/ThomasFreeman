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

		// Scroll animation observer for header elements only
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-in');
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -100px 0px'
			}
		);

		// Observe header elements
		const headerElements = document.querySelectorAll('.header-section .scroll-animate');
		headerElements.forEach((el) => observer.observe(el));

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			observer.disconnect();
		};
	});
</script>

<div class="header-section">
	<h2 class="center title scroll-animate">My Projects</h2>
	<p class="subtitle scroll-animate">Building with blockchain, web3, and modern tech</p>
</div>
{#if data.error}
	<h2 class="center">Whoops error 😔</h2>
{:else}
	{#await data?.repos}
		<h2>Loading ...</h2>
	{:then repos}
		<section class="grid">
			{#each repos as repo, index}
				<ReadMeCard {repo} {index} gradientCenter={gradients[repo.name]} animationDelay={index * 0.1} />
			{/each}
		</section>
	{/await}
{/if}

<style>
/* Scroll animation styles */
.scroll-animate {
	opacity: 0;
	transform: translateY(60px);
	transition:
		opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
		transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	transition-delay: var(--delay, 0s);
}

:global(.scroll-animate.animate-in) {
	opacity: 1;
	transform: translateY(0);
}

.header-section {
	text-align: center;
	margin-bottom: clamp(2rem, 4vw, 3rem);
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
	gap: clamp(1.25rem, 2.5vw, 1.75rem);
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
			margin-inline: 0;
			margin-bottom: 2rem;
		}

		.header-section {
			margin-bottom: 1.5rem;
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
			gap: 1rem;
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
