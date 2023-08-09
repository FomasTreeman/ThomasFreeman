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
		<img src="https://media2.giphy.com/media/yKo3dHxkk3cLwFrIkp/200.gif" alt="temp gif" />
	</div>
	<footer>
		<h3>// {repo.name.toLocaleLowerCase()}</h3>
		<p class="description">Read Me?</p>
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
	}

	img {
		/* object-fit: contain; */
		width: 100%;
		transition: scale 1s;
	}

	h3 {
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
