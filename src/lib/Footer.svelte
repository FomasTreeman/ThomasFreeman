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
		width: calc(100% - 14rem);
		margin-bottom: 1.5rem;
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
			width: calc(100% - 4rem);
			margin: 0;
		}
	}
</style>
