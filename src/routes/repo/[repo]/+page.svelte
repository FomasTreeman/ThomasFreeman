<script lang="ts">
	import type { IRepo } from '$lib/types';
	export let data;

	const repo = data.repos.find((obj) => obj.name === data.param) as IRepo; // handled in page.ts;
	console.log(repo);
</script>

<main class="wrapper">
	<h1>// {repo.name}</h1>
	<nav>
		<details open>
			<summary>Stack</summary>
			{#each repo.stack as stackElement}
				<mark>{stackElement}</mark>
			{/each}
		</details>
		<div>
			<a href={repo.url}>
				<button>🔗</button>
			</a>
			{#if repo.production}
				<a href={repo.production}>
					<button>👀</button>
				</a>
			{/if}
		</div>
	</nav>
	<!-- <img
		src={repo.imageExt
			? `/repos/${repo.name}${repo.imageExt}`
			: 'https://media2.giphy.com/media/yKo3dHxkk3cLwFrIkp/200.gif'}
		alt="temp gif"
	/> -->
	<p>{repo.description}</p>
</main>

<style>
	main.wrapper {
		margin: 5rem;
		padding: 5rem;
		background-color: var(--background-color);
	}

	main.wrapper :not(:first-child) {
		font-family: 'JetBrains Mono Variable';
	}

	nav {
		display: flex;
		justify-content: space-between;
	}

	mark {
		margin-inline: 0.5rem;
	}
	/* details {
		margin-top: 1rem;
		margin-left: 0px;
		display: flex;
		gap: 1rem;
	} */
</style>
