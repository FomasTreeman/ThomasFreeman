<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import type { IRepo } from '$lib/types';

	export let repo: IRepo;
	let isMdToggled = false;
</script>

<a href={`/repo/${repo.name}`}>
	<article>
		<!-- image -->
		<div class="img-container">
			<img
				src={repo?.imageExt
					? `/repos/${repo.name}${repo.imageExt}`
					: 'https://media2.giphy.com/media/yKo3dHxkk3cLwFrIkp/200.gif'}
				alt="temp gif"
				loading="lazy"
			/>
		</div>
		<footer>
			<h2>// {repo.name.toLocaleLowerCase()}</h2>
			<p class="description">{repo?.summary || 'Read Me?'}</p>
			<span class="space-between">
				<span class="space-between">
					<a href={repo.url}>
						<button> 🔗 </button>
					</a>
					{#if repo?.production}
						<a href={repo.production}>
							<button> 👀 </button>
						</a>
					{/if}
				</span>
				<button on:click={() => (isMdToggled = !isMdToggled)}> ▼ </button>
			</span>
			<!-- insert md -->
			{#if isMdToggled}
				<hr />
				<SvelteMarkdown source={repo.md} />
			{/if}
		</footer>
	</article>
</a>

<style>
	article {
		max-width: calc(100% - 2rem);
		margin-inline: auto;
		margin-block: 2rem;
		background-color: #28282a;
		box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 0.75);
		-webkit-box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 0.75);
		-moz-box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 0.75);
	}

	footer {
		padding: 2rem;
	}
	.img-container {
		height: 15rem;
		overflow: hidden;
		background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	img {
		height: 100%;
		width: 100%;
		object-fit: contain;
		scale: 1;
		transition: scale 1s;
	}

	hr {
		margin-block: 2rem;
		opacity: 0.6;
		width: 100%;
	}

	h2 {
		margin-top: 0px;
	}

	.space-between {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	p.description {
		max-width: 20rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-family: 'JetBrains Mono Variable';
	}

	article:hover img {
		scale: 1.1;
	}
</style>
