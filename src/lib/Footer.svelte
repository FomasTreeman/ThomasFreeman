<footer>
	<div class="background" />
	<h3>Available for select freelance opportunities</h3>
	<p>Have an exciting project you need help with❓</p>
	<p>
		Send me an <a href="mailto:tom@team-freeman.com"> email </a> or contact me via instant message❗
	</p>
	🦙
</footer>

<style>
	.background {
		position: absolute;
		width: 100%;
		height: 100%;
		background: blue;
		mix-blend-mode: luminosity;
		z-index: -1;
		border-radius: 1rem;
		top: 0;
		left: 0%;
	}

	footer {
		margin-inline: auto;
		position: relative;
		padding: 2rem;
		text-align: center;
		font-size: large;
		width: calc(100% - (var(--margin-left) * 2));
		margin-bottom: 1.5rem;
		box-sizing: border-box;
	}
	footer :not(h3) {
		font-family: 'JetBrains Mono Variable';
		font-size: medium;
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
			width: 100%;
			margin: 0;
			margin-bottom: 6.5rem;
		}
	}

	@supports (-webkit-appearance: none) {
		footer .background {
			mix-blend-mode: normal;
			background: rgba(1, 1, 1, 0.6);
			backdrop-filter: blur(20px) saturate(1.7);
		}
	}
</style>
