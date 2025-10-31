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
		padding: clamp(3rem, 6vw, 4.5rem) clamp(2rem, 4vw, 3rem);
		text-align: center;
		width: calc(100% - (var(--margin-left) * 2));
		max-width: 900px;
		margin-top: clamp(3rem, 6vw, 5rem);
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
			margin-top: 3rem;
			margin-bottom: 0;
			padding: 2.5rem 1.5rem;
		}

		footer h3 {
			font-size: 1.35rem;
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
