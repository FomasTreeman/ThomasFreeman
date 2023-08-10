<script lang="ts">
	import Saos from 'saos';
	import ReadMeCard from './ReadMeCard.svelte';

	export let data;
</script>

{#await data.repos then repos}
	{#if repos?.error}
		<h1 class="center">Whoops error 😔</h1>
	{:else}
		<section class="grid">
			{#each repos as repo}
				<Saos
					animation={'fade-in 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}
					animation_out={'fade-out 0.6s cubic-bezier(0.550, 0.085, 0.680, 0.530) both'}
					top={250}
					bottom={250}
				>
					<ReadMeCard {repo} />
				</Saos>
			{/each}
		</section>
	{/if}
{/await}

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
		}
	}
	.center {
		display: flex;
		justify-content: center;
	}

	@-webkit-keyframes -global-fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes -global-fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@-webkit-keyframes -global-fade-out {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes -global-fade-out {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
