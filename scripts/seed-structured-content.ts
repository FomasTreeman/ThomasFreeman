import { setContent } from '../src/lib/db/content.js';
import { DEFAULT_JOURNEY } from '../src/lib/constants/defaults.js';

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
		value: JSON.stringify(DEFAULT_JOURNEY.header, null, 2)
	},
	{
		key: 'journey.experiences',
		value: JSON.stringify(DEFAULT_JOURNEY.experiences, null, 2)
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
