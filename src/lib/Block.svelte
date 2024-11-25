<script lang="ts">
	import Divider from './Divider.svelte';
	import HobbyCard from './HobbyCard.svelte';

	const hobbies = [
		{ icon: '🏀', title: 'Basketball', color: '#f87171' },
		{ icon: '🤖', title: 'AI/ML', color: '#818cf8' },
		{ icon: '🏠', title: 'Home Automation', color: '#34d399' },
		{ icon: '🖨️', title: '3D printing', color: '#f472b6' },
		{ icon: '📽️', title: 'Cinema', color: '#fbbf24' },
		{ icon: '🎮', title: 'Gaming', color: '#a78bfa' }
	];
</script>

<Divider flipped={false} />
<article>
	<h3>
		<span class="code-comment">//</span> Experience
	</h3>
	<ol class="experience-list">
		<li class="fac glass-card">FAC <span>- 10 months</span></li>
		<li class="rubber-cheese glass-card">Rubber Cheese <span>- 16 months</span></li>
	</ol>

	<br />

	<h3>
		<span class="code-comment">//</span> Skills
	</h3>
	<ul class="skills-list">
		<li class="glass-pill">🚀 JS</li>
		<li class="glass-pill">⚡ Svelte</li>
		<li class="glass-pill">⚛️ React/Next.js</li>
		<li class="glass-pill">🎯 C#</li>
		<li class="glass-pill">🐘 PHP/Laravel</li>
		<li class="glass-pill">🐳 Docker</li>
		<li class="glass-pill">💻 Bash</li>
		<li class="glass-pill">📝 Vim</li>
		<li class="glass-pill">🎨 Figma</li>
		<li class="glass-pill">🐍 Python</li>
		<li class="glass-pill">📊 Pandas + NumPy</li>
	</ul>

	<br />

	<h3>
		<span class="code-comment">//</span> Hobbies
	</h3>
	<div class="hobbies-container">
		<ul class="hobbies">
			{#each hobbies as hobby}
				<HobbyCard {...hobby} />
			{/each}
		</ul>
	</div>
</article>
<Divider flipped={true} />

<style>
	:root {
		--primary-bg: #0f172a;
		--glass-bg: rgba(255, 255, 255, 0.1);
		--accent-0: #024A9B;
		--accent-1: #0279ff;
		--accent-2: #ff8b00;
		--accent-3: #f9dc02;
		--text: #e2e8f0;
	}
	article {
		padding: 2rem;
	}

	h3 {
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		color: white;
	}

	.code-comment {
		color: yellow;
		font-weight: bold;
	}

	.glass-card {
		background: var(--glass-bg);
		backdrop-filter: blur(8px);
		border-radius: 1rem;
		padding: 1rem;
	}

	.glass-pill {
		background: var(--glass-bg);
		backdrop-filter: blur(8px);
		border-radius: 1000px;
		padding: 0.6rem 1.2rem;
		transition: all 0.3s ease;
	}

	.glass-pill:hover {
		background: var(--accent-1);
		transform: scale(1.05);
	}

	.skills-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		list-style-type: none;
		padding-left: 0;
	}

	.experience-list {
		display: flex;
		width: 100%;
		gap: 2%;
		padding-left: 0;
		list-style-type: none;
	}

	.fac {
		position: relative; /* Enable positioning for pseudo-elements */
		width: 37.5%;
		background: linear-gradient(135deg, var(--glass-bg), transparent);
		overflow: hidden; /* Ensure that pseudo-elements stay within bounds */
	}

	.rubber-cheese {
		position: relative;
		width: 60.5%;
		background: linear-gradient(135deg, var(--glass-bg), transparent);
		overflow: hidden;
	}

	.fac:before,
	.rubber-cheese:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		z-index: 1; /* Place it above the background */
		transition: opacity 1s ease; /* Transition background color */
	}

	.fac:before {
		background: linear-gradient(
			135deg,
			transparent,
			transparent,
			var(--accent-2),
			var(--accent-3)
		); /* Color on hover */
	}

	.rubber-cheese:before {
		background: linear-gradient(
			135deg,
			transparent,
			transparent,
			var(--accent-0),
			var(--accent-1)
		); /* Color on hover */
	}

	.fac:hover:before,
	.rubber-cheese:hover:before {
		opacity: 1;
	}

	.hobbies-container {
		padding: 1rem 0;
	}

	.hobbies {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 2rem;
		list-style-type: none;
		padding: 0;
	}

	@media (max-width: 768px) {

		.hobbies {
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 1rem;
		}
	}

	@media (max-width: 480px) {
		.experience-list {
			flex-direction: column;
			gap: 1rem;
		}

		.fac,
		.rubber-cheese {
			width: 100%;
		}
	}
</style>
