<script lang="ts">
	import type { IRepo } from '$lib/types';

	export let repo: IRepo;
	export let index: number;
	export let gradientCenter = { x: '50%', y: '100%' };

	const colours = [
		{
			overlay: '#A05801',
			before: '#FF8B00'
		},
		{
			overlay: '#9B8901',
			before: '#F9DC02'
		},
		{
			overlay: '#286A8E',
			before: '#47BFFF'
		},
		{
			overlay: '#024A9B',
			before: '#0279FF'
		}
	];
</script>

<a href={`/repo/${repo.name}`} data-project={repo.name}>
	<article
		style="--overlay-color: {colours[index % colours.length].overlay};
               --background-color: {colours[index % colours.length].before};
               background-image: radial-gradient(circle at {gradientCenter.x} {gradientCenter.y}, #39a05000, var(--overlay-color));"
	>
		<div class="img-container">
			<img src={`repos/${repo.name.toLowerCase()}.webp`} alt="temp gif" loading="lazy" />
			<h3>// {repo.name.toLocaleLowerCase()}</h3>
		</div>
		<footer>
			<h3>// {repo.name.toLocaleLowerCase()}</h3>
			<hr />
			<p class="description">{repo?.summary || 'Read Me?'}</p>
		</footer>
	</article>
</a>

<style>
	article {
		border-radius: 1rem;
		padding: 1.5rem;
		font-family: 'JetBrains Mono Variable';
		transition: background-color 0.3s ease;
		background-color: var(--background-color);
		position: relative; /* Ensure positioning for overlap */
		z-index: 1; /* Ensure articles stack correctly */
		height: calc(100% - 3rem);
	}

	article .img-container {
		width: 100%;
		height: 300px;
		position: relative;
	}

	article .img-container h3 {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -75%;
		font-weight: 900;
		font-size: 2.5rem;
		visibility: hidden;
		opacity: 0;
		transition: all 0.3s ease;
		color: white;
	}

	article:hover .img-container h3 {
		animation-delay: 0.3s;
		animation: fadeInFromUnderneath 0.6s ease forwards;
		visibility: visible;
		opacity: 1;
	}

	@keyframes fadeInFromUnderneath {
		0% {
			transform: translateY(40px); /* Start 20px below the original position */
		}
		100% {
			transform: translateY(0); /* Move to the original position */
		}
	}

	article:hover footer h3 {
		visibility: hidden;
		opacity: 0;
	}

	article img {
		position: absolute;
		width: 75%;
		height: 75%;
		object-fit: contain;
		top: 50%;
		left: 50%;
		translate: -50% -45%;
	}

	article footer h3 {
		visibility: visible;
		opacity: 1;
		transition: all 0.3s ease;
		font-size: 1.5rem !important;
	}

	article hr {
		opacity: 0.5;
		border: 1px solid white;
	}

	article footer p {
		margin-bottom: 0;
		font-size: 1rem !important;
	}

	@media (max-width: 768px) {
		article .img-container {
			height: 150px;
		}

		article .img-container img {
			width: 100%;
			height: 100%;
		}
	}
</style>
