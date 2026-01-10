import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { DEFAULT_JOURNEY } from '../src/lib/constants/defaults.js';

// Load .env file
config();

const db = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!
});

// Structured content ordered by site structure: Hero -> About -> Journey -> Projects -> Footer
const structuredContent = [
	// === HERO SECTION (Homepage top) ===
	{
		key: 'homepage.hero.title',
		value: 'Hi, I\'m Tom Freeman 🖖'
	},
	{
		key: 'homepage.hero.subtitle',
		value: 'Software Dev.'
	},
	
	// === ABOUT SECTION ===
	{
		key: 'about.bio',
		value: 'I\'m a developer with a passion for creating beautiful and efficient applications.'
	},
	{
		key: 'about.social_links',
		value: JSON.stringify(
			[
				{
					name: 'FAC',
					url: 'https://www.foundersandcoders.com/',
					icon: '/contact/fac.webp',
					type: 'image'
				},
				{
					name: 'GitHub',
					url: 'https://github.com/FomasTreeman',
					type: 'icon_github'
				},
				{
					name: 'LinkedIn',
					url: 'https://www.linkedin.com/in/fomas-treeman/',
					type: 'icon_linkedin'
				},
				{
					name: 'Email',
					url: 'mailto:tom@team-freeman.com',
					type: 'icon_email'
				}
			],
			null,
			2
		)
	},
	{
		key: 'about.resume_url',
		value: '/Tom_Freeman.pdf'
	},
	{
		key: 'about.resume_label',
		value: 'Resume'
	},
	
	// === JOURNEY SECTION ===
	{
		key: 'journey.header',
		value: JSON.stringify(DEFAULT_JOURNEY.header, null, 2)
	},
	{
		key: 'journey.experiences',
		value: JSON.stringify(DEFAULT_JOURNEY.experiences, null, 2)
	},
	
	// === PROJECTS SECTION ===
	{
		key: 'projects.config',
		value: JSON.stringify(
			[
				{
					name: 'DID',
					summary: 'A decentralized identity service using blockchain technology.',
					image: 'did.webp',
					color: {
						overlay: '#A05801',
						before: '#FF8B00',
						name: 'Orange'
					}
				},
				{
					name: 'Trade-o-matic',
					summary: 'A trading bot testing different strategies across various markets',
					image: 'trade-o-matic.webp',
					color: {
						overlay: '#9B8901',
						before: '#F9DC02',
						name: 'Yellow'
					}
				},
				{
					name: 'Comms',
					summary: 'My quick rough messaging app for testing new frameworks',
					image: 'comms.webp',
					color: {
						overlay: '#286A8E',
						before: '#47BFFF',
						name: 'Light Blue'
					}
				},
				{
					name: 'Rich_System_Site',
					summary: 'A betting bot dashboard',
					image: 'rich_system_site.webp',
					color: {
						overlay: '#024A9B',
						before: '#0279FF',
						name: 'Blue'
					}
				},
				{
					name: 'KodiTV',
					summary: 'My kodi auto-play plugin',
					image: 'koditv.webp',
					color: {
						overlay: '#A05801',
						before: '#FF8B00',
						name: 'Orange'
					}
				},
				{
					name: 'home-page',
					summary: 'My responsive home page for chrome',
					image: 'home-page.webp',
					color: {
						overlay: '#9B8901',
						before: '#F9DC02',
						name: 'Yellow'
					}
				},
				{
					name: 'boids',
					summary: "My BOID's simulation",
					image: 'boids.webp',
					color: {
						overlay: '#8E2862',
						before: '#FF47C7',
						name: 'Pink'
					}
				},
				{
					name: 'renude',
					summary: 'My Vinted inspired clothing app',
					image: 'renude.webp',
					color: {
						overlay: '#024A9B',
						before: '#0279FF',
						name: 'Blue'
					}
				}
			],
			null,
			2
		)
	},
	
	// === CONTACT / FOOTER ===
	{
		key: 'contact.email',
		value: 'tom@team-freeman.com'
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
	}
];

async function seed() {
	console.log('Seeding database with structured content...\n');

	for (let i = 0; i < structuredContent.length; i++) {
		const item = structuredContent[i];
		try {
			// Insert or update content with display_order
			await db.execute({
				sql: `
					INSERT INTO content (key, value, is_draft, display_order, updated_at)
					VALUES (?, ?, 0, ?, CURRENT_TIMESTAMP)
					ON CONFLICT(key) DO UPDATE SET
						value = excluded.value,
						is_draft = 0,
						display_order = excluded.display_order,
						updated_at = CURRENT_TIMESTAMP
				`,
				args: [item.key, item.value, i]
			});
			console.log(`✓ Added: ${item.key} (order: ${i})`);

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
