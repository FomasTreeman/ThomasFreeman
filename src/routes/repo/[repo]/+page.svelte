<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import type { IRepo } from '$lib/types';
	export let data;
</script>

{#await data.repos then repos}
	{@const repo = repos.find((obj: IRepo) => obj.name === data.param) as IRepo}

	<main class="wrapper">
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
		<details open>
			<summary>Stack</summary>
			<ul>
				{#each repo.stack as stackElement}
					<mark>{stackElement}</mark>
				{/each}
			</ul>
		</details>
		<p><SvelteMarkdown source={repo.description} /></p>
		<br />
		<div class="md-wrapper">
			<SvelteMarkdown source={repo.md} />
		</div>
	</main>
{/await}

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
		margin-top: 5.7rem;
		margin-bottom: 2.5rem;
		padding: 5rem;
		background-color: var(--background-color);
		max-width: 100vw;
		border-radius: 1rem;
	}

	image {
		width: 100%;
	}

	main.wrapper > :not(a.return):not(h1):not(div.link-list):not(.md-wrapper) {
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

	.md-wrapper {
		margin-top: 1rem;
		border: 3px solid white;
		padding: 1rem;
	}

	@media (max-width: 768px) {
		main.wrapper {
			margin-inline: 0rem;
			margin-top: 0;
			margin-bottom: 2rem;
			padding: 2rem;
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
