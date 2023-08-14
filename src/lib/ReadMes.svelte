<script lang="ts">
	import Saos from 'saos';
	import ReadMeCard from './ReadMeCard.svelte';
	import type { Data } from '$lib/types';

	export let data: Data;
</script>

{#if data.error}
	<h1 class="center">Whoops error 😔</h1>
{:else}
	{#await data?.repos}
		<h1>Loading ...</h1>
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
	.grid {
		margin: 5rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		/* grid-template-columns: repeat(minmax(250px, 1fr), auto-fit); */
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
