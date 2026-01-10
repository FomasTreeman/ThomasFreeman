<script lang="ts">
	interface Props {
		footerData?: any;
	}

	let { footerData = null }: Props = $props();

	const footer = footerData || {
		heading: 'Available for select freelance opportunities',
		paragraphs: [
			'Have an exciting project you need help with❓',
			'Send me an <a href="mailto:tom@team-freeman.com">email</a> or contact me via instant message❗'
		],
		emoji: '🦙'
	};
</script>

<footer>
	<div class="background glass-bg" />
	<h3>{footer.heading}</h3>
	{#each footer.paragraphs as paragraph}
		<p>{@html paragraph}</p>
	{/each}
	{footer.emoji}
</footer>

<style>
	.background {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		border-radius: 1rem;
		top: 0;
		left: 0%;
	}

	footer {
		margin-inline: auto;
		position: relative;
		padding: clamp(3rem, 6vw, 4.5rem) clamp(2rem, 4vw, 3rem);
		text-align: center;
		width: calc(100% - (var(--margin-left) * 2));
		max-width: 900px;
		margin-bottom: 0;
		box-sizing: border-box;
	}

	footer h3 {
		font-size: clamp(1.5rem, 3vw, 2rem);
		margin-bottom: 1rem;
		line-height: 1.3;
	}

	footer p {
		font-family: 'JetBrains Mono Variable';
		font-size: clamp(0.95rem, 2vw, 1.05rem);
		line-height: 1.6;
		margin-block: 0.75rem;
		opacity: 0.9;
	}

	a {
		text-decoration: underline;
		color: rgb(79, 192, 229);
	}

	a:hover {
		color: blue;
	}

	@media (max-width: 768px) {
		footer {
			width: calc(100% - 2rem);
			margin-inline: 1rem;
			margin-top: 0;
			margin-bottom: 6rem;
			padding: 2.5rem 1.5rem;
		}

		footer h3 {
			font-size: 1.35rem;
		}
	}

</style>
