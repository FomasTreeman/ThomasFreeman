<script lang="ts">
	import showdown from 'showdown';
	import scrollIntoView from './utils/scroll';
	import ReadMeTitle from './ReadMeTitle.svelte';
	import Saos from 'saos';
	import type { Data, Repo, RepoError } from '$lib/types';
	import { SyncLoader } from 'svelte-loading-spinners';

	/** @type {import('./$types').PageData} */
	export let data;

	async function getHtml() {
		return new showdown.Converter();
	}

	function renderHtml(html: string) {
		return html.slice(0, 1000);
	}

	let promise = getHtml();
</script>

{#await data.repos}
	<SyncLoader size="60" color="#FF3E00" unit="px" duration="1s" />
{:then repos}
	{#if repos?.error}
		<h1 class="center">Whoops error 😔</h1>
	{:else}
		<div class="center">
			<ol class="project-links">
				{#each data.pinned as repo}
					<a href={`#${repo}`} on:click|preventDefault={scrollIntoView}>{repo}</a>
				{/each}
			</ol>
		</div>
		{#each repos as repo}
			<Saos
				animation={'fade-in 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}
				animation_out={'fade-out 0.6s cubic-bezier(0.550, 0.085, 0.680, 0.530) both'}
				top={250}
				bottom={250}
			>
				<article id={repo.name} class="project-article">
					<!-- <article id="md" class="article"> -->
					{#await promise}
						<h1>Loading...</h1>
					{:then converter}
						<header>
							{#if data.productions[repo.name]}
								<a href={data.productions[repo.name]} class="prod-link">
									<ReadMeTitle {repo} />
								</a>
							{:else}
								<ReadMeTitle {repo} />
							{/if}
						</header>
						{@html renderHtml(converter.makeHtml(repo.md))}
					{:catch}
						<h1>page in development</h1>
					{/await}
					<!-- </article> -->
				</article>
			</Saos>
		{/each}
	{/if}
{/await}

<style>
	.project-article {
		background-color: black;
		mix-blend-mode: luminosity;
		max-width: 76%;
		padding: 3rem;
		box-shadow: 10px 10px 10px rgba(59, 52, 21, 0.375);
		margin-inline: auto;
		margin-block: 4rem;
	}

	.center {
		display: flex;
		justify-content: center;
	}

	.project-links {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		gap: 2rem;
		padding: 0px;
	}

	.project-links > * {
		list-style: none;
		background-color: white;
		border-radius: 5px;
		padding: 1rem;
		-webkit-box-shadow: rgb(255, 128, 128) 5px 5px 15px 5px, rgb(255, 228, 136) -9px 5px 15px 5px,
			rgb(140, 255, 133) -7px -5px 15px 5px, rgb(128, 199, 255) 12px -5px 15px 5px,
			rgb(228, 136, 255) 12px 10px 15px 7px, rgb(255, 97, 107) -10px 10px 15px 7px,
			rgb(142, 92, 255) -10px -7px 27px 1px, 5px 5px 15px 5px rgba(0, 0, 0, 0);
		box-shadow: rgb(255, 128, 128) 5px 5px 15px 5px, rgb(255, 228, 136) -9px 5px 15px 5px,
			rgb(140, 255, 133) -7px -5px 15px 5px, rgb(128, 199, 255) 12px -5px 15px 5px,
			rgb(228, 136, 255) 12px 10px 15px 7px, rgb(255, 97, 107) -10px 10px 15px 7px,
			rgb(142, 92, 255) -10px -7px 27px 1px, 5px 5px 15px 5px rgba(0, 0, 0, 0);
	}

	a {
		z-index: 20;
	}

	a.prod-link {
		font-weight: 800;
		font-size: 3rem;
		color: greenyellow;
		text-decoration-line: underline;
	}

	a.prod-link:hover {
		mix-blend-mode: lighten;
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

	@media (max-width: 768px) {
		.project-article {
			max-width: 100%;
			padding: 2rem;
			/* temporary solution for image */
			overflow-x: hidden;
			margin: 0px;
			margin-block: 4rem;
		}

		.project-links {
			margin-inline: 2rem;
		}
	}
</style>
