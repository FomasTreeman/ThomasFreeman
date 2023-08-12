<script lang="ts">
	import type { IRepo } from '$lib/types';
	export let data;

	const repo = data.repos.find((obj) => obj.name === data.param) as IRepo; // handled in page.ts;
	console.log(repo);
</script>

<main class="wrapper">
	<a href="/" class="return">← back to home</a>
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
		margin: 5rem;
		padding: 5rem;
		background-color: var(--background-color);
	}

	main.wrapper :not(:first-child):not(:nth-child(2)) {
		font-family: 'JetBrains Mono Variable';
		padding: 1rem 0rem 0rem 1rem;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
