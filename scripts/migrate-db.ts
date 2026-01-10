import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { DEFAULT_JOURNEY } from '../src/lib/constants/defaults.js';

// Load .env file (or use environment-specific .env file passed via dotenv-cli)
config();

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
	console.error('❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
	console.error('Add them to your .env file or use environment-specific files:');
	console.error('  pnpm db:migrate:staging  (uses .env.staging)');
	console.error('  pnpm db:migrate:production  (uses .env.production)');
	process.exit(1);
}

// Command-line arguments
const args = process.argv.slice(2);
const skipSeed = args.includes('--skip-seed');
const forceReseed = args.includes('--force-reseed');

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

async function initSchema(client: ReturnType<typeof createClient>) {
	console.log('📐 Initializing database schema...\n');

	try {
		// Create content table
		await client.execute(`
			CREATE TABLE IF NOT EXISTS content (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				key TEXT UNIQUE NOT NULL,
				value TEXT NOT NULL,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				is_draft INTEGER DEFAULT 0,
				display_order INTEGER DEFAULT 0
			)
		`);
		console.log('✓ Created content table');

		// Create sessions table
		await client.execute(`
			CREATE TABLE IF NOT EXISTS sessions (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				token TEXT UNIQUE NOT NULL,
				email TEXT NOT NULL,
				expires_at DATETIME NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`);
		console.log('✓ Created sessions table');

		// Create magic_links table
		await client.execute(`
			CREATE TABLE IF NOT EXISTS magic_links (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				token TEXT UNIQUE NOT NULL,
				email TEXT NOT NULL,
				expires_at DATETIME NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`);
		console.log('✓ Created magic_links table');

		// Create content_history table
		await client.execute(`
			CREATE TABLE IF NOT EXISTS content_history (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				key TEXT NOT NULL,
				old_value TEXT,
				new_value TEXT,
				action TEXT NOT NULL,
				changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`);
		console.log('✓ Created content_history table');

		// Create indexes
		await client.execute(`CREATE INDEX IF NOT EXISTS idx_content_key ON content(key)`);
		await client.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`);
		await client.execute(`CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token)`);
		await client.execute(`CREATE INDEX IF NOT EXISTS idx_content_history_key ON content_history(key)`);
		await client.execute(`CREATE INDEX IF NOT EXISTS idx_content_history_changed_at ON content_history(changed_at)`);
		await client.execute(`CREATE INDEX IF NOT EXISTS idx_content_is_draft ON content(is_draft)`);
		console.log('✓ Created indexes\n');
	} catch (error) {
		console.error('❌ Error initializing schema:', error);
		throw error;
	}
}

async function seedContent(client: ReturnType<typeof createClient>) {
	console.log('🌱 Seeding database with structured content...\n');

	let seeded = 0;
	let skipped = 0;
	let errors = 0;

	for (let i = 0; i < structuredContent.length; i++) {
		const item = structuredContent[i];
		try {
			if (forceReseed) {
				// Force update all content
				await client.execute({
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
				console.log(`✓ Updated: ${item.key} (order: ${i})`);
				seeded++;
			} else {
				// Only insert if key doesn't exist (preserves existing content)
				const result = await client.execute({
					sql: `
						INSERT INTO content (key, value, is_draft, display_order, updated_at)
						VALUES (?, ?, 0, ?, CURRENT_TIMESTAMP)
						ON CONFLICT(key) DO NOTHING
					`,
					args: [item.key, item.value, i]
				});

				// Check if actually inserted
				if (result.rowsAffected && result.rowsAffected > 0) {
					console.log(`✓ Added: ${item.key} (order: ${i})`);
					seeded++;
				} else {
					console.log(`⊘ Skipped: ${item.key} (already exists)`);
					skipped++;
				}
			}

			// Show preview of the content
			const preview = item.value.substring(0, 60).replace(/\n/g, ' ');
			console.log(`  Preview: ${preview}...\n`);
		} catch (error) {
			console.error(`✗ Failed to add ${item.key}:`, error);
			errors++;
		}
	}

	console.log('\n📊 Seeding summary:');
	console.log(`  Total items: ${structuredContent.length}`);
	console.log(`  Seeded: ${seeded}`);
	console.log(`  Skipped: ${skipped}`);
	console.log(`  Errors: ${errors}`);
}

async function migrate() {
	console.log('🚀 Starting database migration...');
	console.log(`📍 Database: ${TURSO_DATABASE_URL}\n`);

	const client = createClient({
		url: TURSO_DATABASE_URL,
		authToken: TURSO_AUTH_TOKEN
	});

	try {
		// Step 1: Initialize schema
		await initSchema(client);

		// Step 2: Seed content (if not skipped)
		if (!skipSeed) {
			await seedContent(client);
		} else {
			console.log('⊘ Skipping seed (--skip-seed flag provided)\n');
		}

		console.log('\n✅ Migration completed successfully!');
		console.log('\nNext steps:');
		console.log('  • Run: pnpm dev');
		console.log('  • Or deploy your application');

	} catch (error) {
		console.error('\n❌ Migration failed:', error);
		process.exit(1);
	}
}

// Show usage if --help is passed
if (args.includes('--help') || args.includes('-h')) {
	console.log(`
Database Migration Tool
=======================

Usage:
  pnpm db:migrate:staging      # Migrate staging database
  pnpm db:migrate:production    # Migrate production database

Options:
  --skip-seed        Skip seeding content (only initialize schema)
  --force-reseed     Force update all content (overwrites existing data)
  --help, -h         Show this help message

Examples:
  # Full migration (schema + seed)
  pnpm db:migrate:staging

  # Only initialize schema
  pnpm db:migrate:staging --skip-seed

  # Force update all content
  pnpm db:migrate:production --force-reseed
	`);
	process.exit(0);
}

migrate();
