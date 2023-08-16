<script lang="ts">
	import ToolTipWrapper from './ToolTipWrapper.svelte';
	import type { IRepo } from '$lib/types';

	export let repo: IRepo;
</script>

<a href={`/repo/${repo.name}`} on:click|self>
	<article>
		<!-- image -->
		<div class="img-container">
			<img
				src={repo?.imageExt
					? `/repos/${repo.name}${repo.imageExt}`
					: 'https://media3.giphy.com/media/3o72FkiKGMGauydfyg/200.gif'}
				alt="temp gif"
				loading="lazy"
			/>
		</div>
		<footer>
			<h3>// {repo.name.toLocaleLowerCase()}</h3>
			<p class="description">{repo?.summary || 'Read Me?'}</p>
		</footer>
	</article>
</a>

<style>
	article {
		transition: all 1s;
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
	}

	h2 {
		margin-top: 0px;
		transition: color 250ms;
	}

	p.description {
		/* max-width: 100%;
		text-overflow: ellipsis;
		white-space: pre; */
		font-family: 'JetBrains Mono Variable';
		transition: color 250ms;
	}

	article:hover {
		scale: 0.99;
		box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 0.75);
		color: var(--link-color-hover);
		transition: all 500ms;
	}
</style>
