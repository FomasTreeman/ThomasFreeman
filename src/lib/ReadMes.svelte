<script lang="ts">
	import Saos from 'saos';
	import ReadMeCard from './ReadMeCard.svelte';
	import type { Data } from '$lib/types';

	export let data: Data;
</script>

<h2 class="center title">MY PROJECTS.</h2>
{#if data.error}
	<h2 class="center">Whoops error 😔</h2>
{:else}
	{#await data?.repos}
		<h2>Loading ...</h2>
	{:then repos}
		<section class="grid">
			{#each repos as repo}
				<Saos
					animation={'slide-in 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}
					top={250}
					bottom={250}
					once
				>
					<ReadMeCard {repo} />
				</Saos>
			{/each}
		</section>
	{/await}
{/if}

<style>
	h2.title {
		font-size: 2rem;
		margin-top: 5rem;
		max-width: max-content;
		padding: 1rem;
		border: 0.5rem solid var(--color);
	}

	.grid {
		margin: 5rem;
		margin-inline: var(--margin-left);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
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
</style>
