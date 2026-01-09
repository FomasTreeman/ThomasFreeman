import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load .env file
config();

// Get env vars from command line or .env
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
	console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
	console.error('Add them to your .env file or export them:');
	console.error('  export TURSO_DATABASE_URL="libsql://..."');
	console.error('  export TURSO_AUTH_TOKEN="..."');
	process.exit(1);
}

async function initDatabase() {
	console.log('🔧 Initializing Turso database...\n');
	
	const client = createClient({
		url: TURSO_DATABASE_URL,
		authToken: TURSO_AUTH_TOKEN
	});

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
		console.log('✓ Created indexes');

		console.log('\n✅ Database initialized successfully!');
		console.log('\nYou can now:');
		console.log('  1. Run: pnpm dev');
		console.log('  2. Or seed data: node --loader ts-node/esm scripts/seed-structured-content.ts');
		
	} catch (error) {
		console.error('❌ Error initializing database:', error);
		process.exit(1);
	}
}

initDatabase();
