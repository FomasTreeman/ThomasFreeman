<script lang="ts">
	import showdown from 'showdown';
	import { SyncLoader } from 'svelte-loading-spinners';
	import type { Repo } from '$lib/types';

	export let repo: Repo;
	let isMdToggled = false;

	async function getHtml() {
		return new showdown.Converter();
	}

	function renderHtml(html: string) {
		return html.slice(0, 1000);
	}

	let promise = getHtml();
	$: console.log(repo);
</script>

<article>
	<!-- image -->
	<div class="img-container">
		<img
			src={repo?.imageExt
				? `${repo.name}${repo.imageExt}`
				: 'https://media2.giphy.com/media/yKo3dHxkk3cLwFrIkp/200.gif'}
			alt="temp gif"
		/>
	</div>
	<footer>
		<h2>// {repo.name.toLocaleLowerCase()}</h2>
		<p class="description">{repo?.description || 'Read Me?'}</p>
		<span class="space-between">
			<button>
				<a href={repo.url} class="link-parent"> 🔗 </a>
			</button>
			<button on:click={() => (isMdToggled = !isMdToggled)}> ▼ </button>
		</span>
		<!-- insert md -->
		{#if isMdToggled}
			{#await promise}
				<SyncLoader size="60" color="#FF3E00" unit="px" duration="1s" />
			{:then converter}
				<hr />
				{@html renderHtml(converter.makeHtml(repo.md))}
			{/await}
		{/if}
	</footer>
</article>

<style>
	article {
		margin: 1rem;
		background-color: #28282a;
		box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 0.75);
		-webkit-box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 0.75);
		-moz-box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 0.75);
	}

	footer {
		padding: 2rem;
	}
	.img-container {
		max-width: 100%;
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
		left: 50%;
		transition: scale 1s;
		position: relative;
		transform: translateX(-50%);
		transform-origin: left;
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
	}

	p.description {
		max-width: 20rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	article:hover img {
		scale: 1.3;
	}
	@media only screen and (max-width: 1000px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
