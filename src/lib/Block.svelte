<script lang="ts">
	import Divider from './Divider.svelte';
	import HobbyCard from './HobbyCard.svelte';

	const hobbies = [
		{ icon: '🏀', title: 'Basketball', color: '#f87171' },
		{ icon: '🤖', title: 'AI/ML', color: '#818cf8' },
		{ icon: '💰', title: 'Crypto', color: '#fbbf24' },
		{ icon: '🏠', title: 'Home Automation', color: '#34d399' },
		{ icon: '🖨️', title: '3D printing', color: '#f472b6' },
		{ icon: '📽️', title: 'Cinema', color: '#fbbf24' },
		{ icon: '🎮', title: 'Gaming', color: '#a78bfa' }
	];
</script>

<Divider flipped={false} />
<article>
	<section class="content-section">
		<h3>
			<span class="code-comment">//</span> Experience
		</h3>
		<ol class="experience-list">
			<li class="fac glass-card">
				<a href="https://www.foundersandcoders.com/" target="_blank">
					FAC <span>- 10 months</span>
				</a>
			</li>
			<li class="rubber-cheese glass-card">
				<a href="https://www.rubbercheese.com" target="_blank">
					Rubber Cheese <span
					>- 2022
					- 2025</span
					>
				</a>
			</li>
			<li class="bsv glass-card">
				<a href="https://bsvblockchain.org" target="_blank">
					BSV (Open Source) - present
				</a>
			</li>
		</ol>
	</section>

	<section class="content-section">
		<h3>
			<span class="code-comment">//</span> Skills
		</h3>
		<ul class="skills-list">
			<li class="glass-pill">🚀 TS</li>
			<li class="glass-pill">⚛️ Svelte/Next.js</li>
			<li class="glass-pill">🎯 C#</li>
			<li class="glass-pill">🐘 PHP/Laravel</li>
			<li class="glass-pill">🐳 Docker</li>
			<li class="glass-pill">💻 Bash/Linux</li>
			<li class="glass-pill">📝 Vim</li>
			<li class="glass-pill">🎨 Figma</li>
			<li class="glass-pill">🐍 Python</li>
			<li class="glass-pill">📊 Pandas + NumPy</li>
		</ul>
	</section>

	<section class="content-section">
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
	</section>
</article>
<Divider flipped={true} />

<style>
	/* ===== LAYOUT ===== */
	article {
		padding: 3rem;
		width: 100%;
		box-sizing: border-box;
	}

	.content-section {
		margin-bottom: 3.5rem;
	}

	.content-section:last-child {
		margin-bottom: 0;
	}

	/* ===== TYPOGRAPHY ===== */
	h3 {
		font-family: 'JetBrains Mono Variable', monospace;
		margin-bottom: 2rem;
		color: var(--color);
	}

	.code-comment {
		color: var(--primary-color2);
		font-weight: bold;
	}

	/* ===== GLASS COMPONENTS ===== */
	.glass-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(12px) saturate(1.5);
		border-radius: 1rem;
		padding: 1.25rem;
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.glass-card:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		transition: opacity 1s ease;
		z-index: -1;
	}

	.glass-card:hover:before {
		opacity: 1;
	}

	.glass-pill {
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12px) saturate(1.5);
		border-radius: 1000px;
		padding: 0.7rem 1.3rem;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.glass-pill:hover {
		background: var(--secondary-color1);
		transform: scale(1.05);
		border-color: var(--secondary-color2);
		box-shadow: 0 0 15px rgba(0, 121, 255, 0.3);
	}

	/* ===== EXPERIENCE SECTION ===== */
	.experience-list {
		display: flex;
		width: 100%;
		gap: 1.5rem;
		padding-left: 0;
		list-style-type: none;
		margin: 0;
	}

	.experience-list li a {
		height: 100%;
		display: block;
		margin: -1.25rem;
		padding: 1.25rem;
		border-radius: 1rem;
	}

	.fac {
		position: relative;
		flex: 1.1;
		min-width: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent);
		overflow: hidden;
	}

	.fac:before {
		background: linear-gradient(
			135deg,
			transparent,
			transparent,
			var(--primary-color1),
			var(--primary-color2)
		);
	}

	.rubber-cheese {
		position: relative;
		flex: 2;
		min-width: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent);
		overflow: hidden;
	}

	.rubber-cheese:before {
		background: linear-gradient(
			135deg,
			transparent,
			transparent,
			var(--secondary-color1),
			var(--secondary-color2)
		);
	}

	.bsv {
		position: relative;
		flex: 0.8;
		min-width: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent);
		overflow: hidden;
	}

	.bsv:before {
		background: linear-gradient(
			135deg,
			transparent,
			transparent,
			var(--primary-color1),
			var(--secondary-color1)
		);
	}

	/* ===== SKILLS SECTION ===== */
	.skills-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		list-style-type: none;
		padding-left: 0;
		margin: 0;
	}

	/* ===== HOBBIES SECTION ===== */
	.hobbies-container {
		padding: 0;
	}

	.hobbies {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 2rem;
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	/* ===== MEDIA QUERIES ===== */
	@media (max-width: 768px) {
		article {
			padding: 2rem 1.5rem;
		}

		.content-section {
			margin-bottom: 2.5rem;
		}

		h3 {
			margin-bottom: 1.5rem;
		}

		.hobbies {
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 1.5rem;
		}

		.experience-list {
			flex-direction: column;
			gap: 1rem;
		}

		.glass-card {
			width: auto;
		}

		.skills-list {
			gap: 0.8rem;
		}

		.glass-pill {
			padding: 0.6rem 1rem;
		}
	}

	@media (max-width: 480px) {
		article {
			padding: 1.5rem 1rem;
		}

		.content-section {
			margin-bottom: 2rem;
		}

		.hobbies {
			gap: 1rem;
		}
	}
</style>
