<script lang="ts">
	const experiences = [
		{
			company: 'Founders and Coders',
			role: 'Full Stack Developer Training',
			period: '10 months',
			year: '2021-2022',
			description: 'Intensive full-stack JavaScript bootcamp focusing on test-driven development, pair programming, and agile methodologies. Built full-stack applications using modern web technologies and collaborative development practices.',
			skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'TDD', 'Git', 'Express'],
			achievements: [
				'Completed 16-week intensive coding bootcamp',
				'Built 4 full-stack applications using agile methodologies',
				'Mentored junior developers in pair programming'
			],
			color: { primary: 'var(--primary-color1)', secondary: 'var(--primary-color2)' },
			link: 'https://www.foundersandcoders.com/',
			current: false
		},
		{
			company: 'Rubber Cheese',
			role: 'Full Stack Developer',
			period: '2022 - 2025',
			year: '2022-2025',
			description: 'Built and maintained production PHP/Laravel applications for enterprise clients. Implemented new features, optimized performance, and modernized legacy codebases with Docker containerization.',
			skills: ['PHP', 'Laravel', 'Docker', 'MySQL', 'JavaScript', 'C#', 'Bash', 'Linux'],
			achievements: [
				'Reduced deployment time by 70% through Docker containerization',
				'Built and maintained 8+ production Laravel applications',
				'Implemented CI/CD pipelines for automated testing and deployment'
			],
			color: { primary: 'var(--primary-color1)', secondary: 'var(--primary-color2)' },
			link: 'https://www.rubbercheese.com',
			current: false
		},
		{
			company: 'BSV Blockchain',
			role: 'Open Source Contributor',
			period: 'Present',
			year: '2024-Present',
			description: 'Contributing to TypeScript SDK development and blockchain infrastructure. Building developer tools, writing comprehensive documentation, and implementing advanced cryptographic features for the BSV ecosystem.',
			skills: ['TypeScript', 'Blockchain', 'Testing', 'Documentation', 'Cryptography', 'SDK Development'],
			achievements: [
				'Contributed to core TypeScript SDK for BSV blockchain',
				'Authored technical documentation and developer guides',
				'Implemented wallet and transaction management features'
			],
			color: { primary: 'var(--primary-color1)', secondary: 'var(--secondary-color1)' },
			link: 'https://bsvblockchain.org',
			current: true
		}
	];

	// Locomotive Scroll now handles all scroll animations via data-scroll attributes
	// The IntersectionObserver has been removed in favor of Locomotive's .is-inview class
</script>

<div class="journey-wrapper" data-scroll-section>
	<div class="journey-section">
		<div class="journey-header">
			<h2 class="title" data-scroll data-scroll-speed="1">My Journey</h2>
			<p class="subtitle reveal-fade" data-scroll>From bootcamp to blockchain</p>
		</div>

		<div class="timeline">
			<div class="timeline-line"></div>
			{#each experiences as exp, index}
				<div
					class="timeline-item"
					data-scroll
					style="--item-index: {index}; transition-delay: calc({index} * 150ms);"
				>
					<div
						class="timeline-dot"
						class:current={exp.current}
						style="background: {exp.color.primary}">
					</div>
					<a href={exp.link} target="_blank" rel="noopener noreferrer" class="experience-card">
						<div class="card-header">
							<div>
								<h3>{exp.company}</h3>
								<p class="role">{exp.role}</p>
							</div>
							<span class="period">{exp.period}</span>
						</div>

						<p class="description">{exp.description}</p>

						{#if exp.achievements && exp.achievements.length > 0}
							<div class="achievements">
								<h4 class="achievements-title">Key Achievements</h4>
								<ul class="achievements-list">
									{#each exp.achievements as achievement}
										<li>{achievement}</li>
									{/each}
								</ul>
							</div>
						{/if}

						<div class="skills">
							{#each exp.skills as skill}
								<span class="skill-tag" style="border-color: {exp.color.secondary}">{skill}</span>
							{/each}
						</div>

						<div
							class="card-gradient"
							style="background: linear-gradient(135deg, transparent, {exp.color.primary}20, {exp.color.secondary}20)">
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.journey-wrapper {
		position: relative;
		background: linear-gradient(
			180deg,
			rgba(5, 4, 5, 0.3) 0%,
			rgb(5, 4, 5) 15%,
			rgb(5, 4, 5) 85%,
			rgba(5, 4, 5, 0.3) 100%
		);
		padding-block: 8rem 10rem;
		overflow: hidden;
		min-height: 100vh;
	}

	.journey-wrapper::before {
		content: '';
		position: absolute;
		top: 0;
		left: 20%;
		width: 500px;
		height: 500px;
		background: radial-gradient(
			circle,
			rgba(0, 121, 255, 0.05) 0%,
			transparent 70%
		);
		border-radius: 50%;
		pointer-events: none;
		animation: float 20s ease-in-out infinite;
	}

	.journey-wrapper::after {
		content: '';
		position: absolute;
		bottom: 10%;
		right: 20%;
		width: 400px;
		height: 400px;
		background: radial-gradient(
			circle,
			rgba(255, 138, 0, 0.04) 0%,
			transparent 70%
		);
		border-radius: 50%;
		pointer-events: none;
		animation: float 25s ease-in-out infinite reverse;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0) translateX(0);
		}
		33% {
			transform: translateY(-30px) translateX(20px);
		}
		66% {
			transform: translateY(20px) translateX(-20px);
		}
	}

	.journey-section {
		position: relative;
		z-index: 1;
	}

	.journey-header {
		text-align: center;
		margin-bottom: 4rem;
		padding-inline: 2rem;
	}

	.title {
		font-size: 3rem;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, var(--primary-color1), var(--secondary-color1), var(--primary-color2));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-weight: 800;
	}

	.subtitle {
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 1.1rem;
		opacity: 0.7;
		margin: 0;
	}

	.timeline {
		position: relative;
		max-width: 1100px;
		margin-inline: auto;
		padding: 2rem var(--margin-left);
		padding-left: calc(var(--margin-left) + 3rem);
	}

	.timeline-line {
		position: absolute;
		left: calc(var(--margin-left) + 1rem);
		top: 2rem;
		bottom: 2rem;
		width: 2px;
		background: linear-gradient(
			180deg,
			transparent,
			var(--secondary-color1) 10%,
			var(--secondary-color1) 90%,
			transparent
		);
		opacity: 0.3;
	}

	.timeline-item {
		position: relative;
		margin-bottom: 3rem;
		/* Items visible by default - animation is progressive enhancement */
		opacity: 1;
		transform: translateY(0);
		transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Optional: Add reveal animation if you want (requires adding reveal-up class to timeline-item) */
	.timeline-item.reveal-up {
		opacity: 0;
		transform: translateY(50px);
	}
	.timeline-item.reveal-up.is-inview {
		opacity: 1;
		transform: translateY(0);
	}

	.timeline-dot {
		position: absolute;
		left: calc(-2rem - 6px);
		top: 2rem;
		width: 16px;
		height: 16px;
		border: 3px solid var(--background-color);
		border-radius: 50%;
		box-shadow: 0 0 0 4px rgba(0, 121, 255, 0.2);
		z-index: 2;
		transition: all 0.3s ease;
	}

	.timeline-dot.current {
		background: var(--secondary-color1) !important;
		box-shadow: 0 0 0 4px rgba(0, 121, 255, 0.4), 0 0 20px rgba(0, 121, 255, 0.6);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			box-shadow: 0 0 0 4px rgba(0, 121, 255, 0.4), 0 0 20px rgba(0, 121, 255, 0.6);
		}
		50% {
			box-shadow: 0 0 0 8px rgba(0, 121, 255, 0.3), 0 0 30px rgba(0, 121, 255, 0.8);
		}
	}

	.experience-card {
		position: relative;
		display: block;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(12px) saturate(1.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		padding: 2.5rem;
		transition: all 0.3s ease;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
	}

	.experience-card:hover {
		transform: translateX(8px);
		border-color: rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.timeline-item:hover .timeline-dot {
		transform: scale(1.4);
		box-shadow: 0 0 0 8px rgba(0, 121, 255, 0.3);
	}

	.card-gradient {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
		z-index: 0;
	}

	.experience-card:hover .card-gradient {
		opacity: 1;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
		position: relative;
		z-index: 1;
		gap: 1rem;
	}

	h3 {
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 1.5rem;
		margin: 0 0 0.5rem 0;
		color: var(--color);
	}

	.role {
		font-size: 1rem;
		opacity: 0.8;
		margin: 0;
	}

	.period {
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 0.9rem;
		opacity: 0.6;
		white-space: nowrap;
	}

	.description {
		margin: 1rem 0;
		line-height: 1.6;
		opacity: 0.9;
		position: relative;
		z-index: 1;
		font-size: 0.95rem;
	}

	.achievements {
		margin: 1.5rem 0;
		position: relative;
		z-index: 1;
	}

	.achievements-title {
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 0.85rem;
		color: var(--secondary-color1);
		margin: 0 0 0.75rem 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		opacity: 0.9;
	}

	.achievements-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.achievements-list li {
		font-size: 0.9rem;
		line-height: 1.5;
		opacity: 0.85;
		padding-left: 1.2rem;
		position: relative;
	}

	.achievements-list li::before {
		content: '▹';
		position: absolute;
		left: 0;
		color: var(--secondary-color1);
		font-weight: bold;
	}

	.skills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		position: relative;
		z-index: 1;
	}

	.skill-tag {
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 0.85rem;
		padding: 0.4rem 0.8rem;
		border-radius: 1000px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid;
		transition: all 0.2s ease;
	}

	.skill-tag:hover {
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-2px);
	}

	@media (max-width: 768px) {
		.journey-wrapper {
			padding-block: 4rem 6rem;
		}

		.journey-header {
			margin-bottom: 2rem;
		}

		.title {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 0.9rem;
		}

		.timeline {
			padding: 1rem 1rem;
			padding-left: 3rem;
		}

		.timeline-line {
			left: 1rem;
		}

		.timeline-dot {
			left: calc(-2rem + 2px);
			width: 12px;
			height: 12px;
		}

		.timeline-item {
			margin-bottom: 2rem;
		}

		.experience-card {
			padding: 1.5rem;
		}

		.card-header {
			flex-direction: column;
		}

		h3 {
			font-size: 1.25rem;
		}

		.achievements {
			margin: 1rem 0;
		}

		.achievements-title {
			font-size: 0.8rem;
		}

		.achievements-list li {
			font-size: 0.85rem;
		}

		.description {
			font-size: 0.9rem;
		}

		.skill-tag {
			font-size: 0.8rem;
			padding: 0.35rem 0.7rem;
		}
	}
</style>
