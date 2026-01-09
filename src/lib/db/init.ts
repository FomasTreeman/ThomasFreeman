import { createClient } from '@libsql/client';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';

// Create Turso client
let client: ReturnType<typeof createClient> | null = null;

export function getDb() {
	if (!client) {
		client = createClient({
			url: TURSO_DATABASE_URL,
			authToken: TURSO_AUTH_TOKEN
		});
	}
	return client;
}

export async function initDb() {
	const db = getDb();

	// Create content table
	await db.execute(`
		CREATE TABLE IF NOT EXISTS content (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			key TEXT UNIQUE NOT NULL,
			value TEXT NOT NULL,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			is_draft INTEGER DEFAULT 0,
			display_order INTEGER DEFAULT 0
		)
	`);

	// Create sessions table for auth
	await db.execute(`
		CREATE TABLE IF NOT EXISTS sessions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			token TEXT UNIQUE NOT NULL,
			email TEXT NOT NULL,
			expires_at DATETIME NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Create magic_links table for temporary login links
	await db.execute(`
		CREATE TABLE IF NOT EXISTS magic_links (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			token TEXT UNIQUE NOT NULL,
			email TEXT NOT NULL,
			expires_at DATETIME NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Create content_history table for tracking changes
	await db.execute(`
		CREATE TABLE IF NOT EXISTS content_history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			key TEXT NOT NULL,
			old_value TEXT,
			new_value TEXT,
			action TEXT NOT NULL,
			changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Create indexes for faster lookups
	await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_key ON content(key)`);
	await db.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`);
	await db.execute(`CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token)`);
	await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_history_key ON content_history(key)`);
	await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_history_changed_at ON content_history(changed_at)`);
	await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_is_draft ON content(is_draft)`);
}

// Auto-initialize on first import
initDb().catch(() => {
	// Silent fail - database will be initialized on first use
});
