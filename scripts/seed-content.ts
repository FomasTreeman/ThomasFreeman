import { setContent } from '../src/lib/db/content.js';

// Sample content to seed the database
const seedData = [
	{
		key: 'homepage.hero.title',
		value: 'Hi, I\'m Tom Freeman 🖖'
	},
	{
		key: 'homepage.hero.subtitle',
		value: 'Software Dev.'
	},
	{
		key: 'about.bio',
		value:
			'I am a passionate developer with expertise in modern web technologies. I love building elegant solutions to complex problems.'
	},
	{
		key: 'contact.email',
		value: 'tom@team-freeman.com'
	}
];

async function seed() {
	console.log('Seeding database with sample content...');

	for (const item of seedData) {
		try {
			setContent(item.key, item.value);
			console.log(`✓ Added: ${item.key}`);
		} catch (error) {
			console.error(`✗ Failed to add ${item.key}:`, error);
		}
	}

	console.log('\nSeeding complete!');
	console.log(`Total items: ${seedData.length}`);
}

seed();
