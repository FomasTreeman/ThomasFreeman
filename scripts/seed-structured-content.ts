import { setContent } from '../src/lib/db/content.js';

// Structured content with nested JSON blocks
const structuredContent = [
	{
		key: 'header.navigation',
		value: JSON.stringify(
			{
				homeItems: [
					{ id: 'home', text: 'Home' },
					{ id: 'about', text: 'About' },
					{ id: 'projects', text: 'Projects' }
				],
				otherItems: [{ id: 'play', text: 'Play', href: '/play' }]
			},
			null,
			2
		)
	},
	{
		key: 'footer.content',
		value: JSON.stringify(
			{
				heading: 'Available for select freelance opportunities',
				paragraphs: [
					'Have an exciting project you need help with❓',
					'Send me an <a href="mailto:tom@team-freeman.com">email</a> or contact me via instant message❗'
				],
				emoji: '🦙'
			},
			null,
			2
		)
	},
	{
		key: 'journey.header',
		value: JSON.stringify(
			{
				title: 'My Journey',
				subtitle: 'From bootcamp to blockchain'
			},
			null,
			2
		)
	},
	{
		key: 'journey.experiences',
		value: JSON.stringify(
			[
				{
					company: 'Founders and Coders',
					role: 'Full Stack Developer Training',
					period: '10 months',
					year: '2021-2022',
					description:
						'Intensive full-stack JavaScript bootcamp focusing on test-driven development, pair programming, and agile methodologies. Built full-stack applications using modern web technologies and collaborative development practices.',
					skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'TDD', 'Git', 'Express'],
					achievements: [
						'Completed 16-week intensive coding bootcamp',
						'Built 4 full-stack applications using agile methodologies',
						'Mentored junior developers in pair programming'
					],
					link: 'https://www.foundersandcoders.com/',
					current: false
				},
				{
					company: 'Rubber Cheese',
					role: 'Full Stack Developer',
					period: '2022 - 2025',
					year: '2022-2025',
					description:
						'Built and maintained production PHP/Laravel applications for enterprise clients. Implemented new features, optimized performance, and modernized legacy codebases with Docker containerization.',
					skills: ['PHP', 'Laravel', 'Docker', 'MySQL', 'JavaScript', 'C#', 'Bash', 'Linux'],
					achievements: [
						'Reduced deployment time by 70% through Docker containerization',
						'Built and maintained 8+ production Laravel applications',
						'Implemented CI/CD pipelines for automated testing and deployment'
					],
					link: 'https://www.rubbercheese.com',
					current: false
				},
				{
					company: 'BSV Blockchain',
					role: 'Open Source Contributor',
					period: 'Present',
					year: '2024-Present',
					description:
						'Contributing to TypeScript SDK development and blockchain infrastructure. Building developer tools, writing comprehensive documentation, and implementing advanced cryptographic features for the BSV ecosystem.',
					skills: [
						'TypeScript',
						'Blockchain',
						'Testing',
						'Documentation',
						'Cryptography',
						'SDK Development'
					],
					achievements: [
						'Contributed to core TypeScript SDK for BSV blockchain',
						'Authored technical documentation and developer guides',
						'Implemented wallet and transaction management features'
					],
					link: 'https://bsvblockchain.org',
					current: true
				}
			],
			null,
			2
		)
	}
];

async function seed() {
	console.log('Seeding database with structured content...\n');

	for (const item of structuredContent) {
		try {
			setContent(item.key, item.value);
			console.log(`✓ Added: ${item.key}`);

			// Show preview of the content
			const preview = item.value.substring(0, 80).replace(/\n/g, ' ');
			console.log(`  Preview: ${preview}...\n`);
		} catch (error) {
			console.error(`✗ Failed to add ${item.key}:`, error);
		}
	}

	console.log('Seeding complete!');
	console.log(`Total items: ${structuredContent.length}`);
}

seed();
