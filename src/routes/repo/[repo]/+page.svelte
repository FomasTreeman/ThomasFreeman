<script lang="ts">
	import type { IRepo } from '$lib/types';
	export let data;

	const repo = data.repos.find((obj) => obj.name === data.param) as IRepo; // handled in page.ts;
	console.log(repo);
</script>

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
		position: relative;
		margin: 5rem;
		padding: 5rem;
		background-color: var(--background-color);
	}

	@media (max-width: 768px) {
		main.wrapper {
			margin: 0rem;
			margin-top: 4rem;
			padding: 2rem;
		}

		div.link-list {
			top: 2rem;
			right: 2rem;
		}
	}

	main.wrapper > :not(a.return):not(h1):not(div.link-list) {
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
