<script lang="ts">
	import type { IRepo } from '$lib/types';
	import { onMount } from 'svelte';

	export let repo: IRepo;
	export let index: number;
	export let gradientCenter = { x: '50%', y: '100%' };
	export let animationDelay = 0;

	let cardElement: HTMLAnchorElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-in');
						observer.disconnect(); // Only animate once
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -100px 0px'
			}
		);

		if (cardElement) {
			observer.observe(cardElement);
		}

		return () => observer.disconnect();
	});

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

<a href={`/repo/${repo.name}`} data-project={repo.name} class="scroll-animate" style="--delay: {animationDelay}s;" bind:this={cardElement}>
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
/* Scroll animation styles */
a.scroll-animate {
	display: block;
	text-decoration: none;
	color: inherit;
	opacity: 0;
	transform: translateY(60px);
	transition:
		opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
		transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	transition-delay: var(--delay, 0s);
}

:global(a.scroll-animate.animate-in) {
	opacity: 1;
	transform: translateY(0);
}

article {
	border-radius: 1.25rem;
	padding: clamp(1.25rem, 2.5vw, 1.75rem);
	font-family: 'JetBrains Mono Variable';
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	background-color: var(--background-color);
	position: relative;
	z-index: 1;
	height: calc(100% - 2.5rem);
	border: 1px solid rgba(255, 255, 255, 0.05);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
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
