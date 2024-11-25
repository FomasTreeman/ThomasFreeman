<script>
	import Divider1 from './Divider.svelte';
	import Stack from './Stack.svelte';
</script>

<Divider1 flipped={false} />
<article>
	<h3>
		//   Experience
	</h3>
	<!-- <div class="timeline">
		<div class="timeline-dot"></div>
		<div class="timeline-dot"></div>
	</div> -->
	<ol class="experience-list">
		<li class="fac">FAC <span> - 10 months</span></li>
		<li class="rubber-cheese">Rubber Cheese <span> - 16 months</span></li>
	</ol>

	<br>

	<h3>
		//   Skills
	</h3>
	<ul class="skills-list">
		<li>JS</li>
		<li>Svelte</li>
		<li>React/Next.js</li>
		<li>C#</li>
		<li>PHP/Laravel</li>
		<li>Docker</li>
		<li>Bash</li>
		<li>Vim</li>
		<li>Figma</li>
		<li>Python</li>
		<li>Pandas + NumPy</li>
	</ul>
</article>

<Divider1 flipped={true} />

<style>
	article {
		margin-inline: var(--margin-left);
	}

	article {
		height: inherit;
		overscroll-behavior: auto;
	}

	li {
		border-radius: 1rem;
		background-color: red;
		padding: 1rem;
	}

	h3 {
		font-family: 'JetBrains Mono Variable';
	}

	.skills-list li {
		background-color: blue;
		border-radius: 1000px;
		padding-inline: 0.9rem;
		padding-block: 0.4rem;
	}

	/* .timeline {
		position: relative;
		border-bottom: 1px solid white;
	}

	.timeline-dot {
		position: absolute;
		background-color: white;
		border-radius: 1000px;
		width: 1rem;
		height: 1rem;
		bottom: -0.5rem;
	} */

	.experience-list {
		display: flex;
		width: 100%;
		gap: 2%;
	}

	.experience-list li {
		box-sizing: border-box;
		font-weight: 800;
	}

	.fac {
		width: 37.5%; 
		background-color: orange;
	}

	.rubber-cheese {
		width: 60.5%; 
		background-color: yellow;
		color: black;
	}

	ul, ol {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		list-style-type: none;
		padding-left: 0;
	}

	@media (max-width: 768px) {
		article {
			margin-right: 1rem;
			margin-left: 1rem;
		}
	}
</style>
