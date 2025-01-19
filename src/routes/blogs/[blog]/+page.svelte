<script lang="ts">
	export let data;
</script>

<section class="content">
	<svelte:component this={data.content} />
</section>

<style>
	.content {
		position: relative;
		margin-inline: 5rem;
		margin-top: 6.6rem;
		margin-bottom: 2.5rem;
		padding-bottom: 2.5rem;
		padding-top: 1.75rem;
		padding-inline: 4rem;
		background-color: var(--background-color);
		max-width: 100vw;
		border-radius: 1rem;

		@media (max-width: 768px) {
			margin: 0;
			margin-bottom: 1.5rem;
			border-radius: 0 0 1rem 1rem;
		}
	}
</style>
