<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import type { IRepo } from '$lib/types';
	import { afterNavigate } from '$app/navigation';
	export let data;

	// Data now comes directly from server load function
	const repo = data as IRepo;

	let mainElement: HTMLElement;

	// Reset scroll when navigating to this page (fixes issue where clicking from homepage preserves scroll)
	afterNavigate(() => {
		// Scroll to show the main content, accounting for fixed navigation
		if (mainElement) {
			mainElement.scrollIntoView({ behavior: 'instant', block: 'start' });
		}
	});
</script>

<main class="wrapper" bind:this={mainElement}>
	<a href="/" class="return">← back to home</a>
	<h1>// {repo.name}</h1>
	<div class="link-list">
		<a href={repo.url}>
			<button>🔗</button>
		</a>
		{#if repo.production}
			<a href={repo.production}>
				<button>👀</button>
			</a>
		{/if}
	</div>
	{#if repo.stack}
		<details open>
			<summary>Stack</summary>
			<ul>
				{#each repo.stack as stackElement}
					<mark>{stackElement}</mark>
				{/each}
			</ul>
		</details>
	{/if}
	{#if repo.description}
		<div class="description-wrapper">
			<SvelteMarkdown source={repo.description} />
		</div>
	{/if}
</main>

<style>
	a.return {
		color: rgb(209, 209, 209);
		opacity: 0.7;
		transition: all 0.3s ease;
	}

	a.return:hover {
		opacity: 0.9;
		transition: all 0.3s ease;
	}

	main.wrapper {
		position: relative;
		margin-inline: 5rem;
		margin-top: 7.5rem;
		top: 7.5rem;
		margin-bottom: 2.5rem;
		padding: 5rem;
		background-color: var(--background-color);
		max-width: 100vw;
		border-radius: 1rem;
	}

	main.wrapper > :not(a.return):not(h1):not(div.link-list):not(.description-wrapper) {
		font-family: 'JetBrains Mono Variable';
		padding: 1rem 0rem 0rem 1rem;
	}

	div.link-list {
		position: absolute;
		right: 4rem;
		top: 4rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		/* align-items: center; */
	}

	ul {
		list-style: none;
		margin-left: 0px;
		display: flex;
		flex-wrap: wrap;
		margin-top: 0px;
	}

	mark {
		margin-inline: 0.5rem;
		margin-top: 1rem;
	}

	.description-wrapper {
		margin-top: 2rem;
		padding: 1rem;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		main.wrapper {
			margin-inline: 0rem;
			margin-top: 0;
			margin-bottom: 2rem;
			padding: 2rem;
			padding-bottom: 5rem; /* Add space for bottom navigation */
		}

		div.link-list {
			top: 1rem;
			right: 1rem;
		}

		h1 {
			font-size: xx-large;
		}
	}
</style>
