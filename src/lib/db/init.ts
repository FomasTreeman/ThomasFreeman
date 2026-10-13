import { createClient } from '@libsql/client';
// Dynamic rather than static env: a static import fails the *build* when the
// variable is absent, which is what broke every Vercel preview deploy (the
// preview environment has no Turso credentials). Read at runtime instead and
// let callers degrade to their defaults.
import { env } from '$env/dynamic/private';

// Create Turso client
let client: ReturnType<typeof createClient> | null = null;

/** True when the Turso credentials are present in this deployment. */
export function isDbConfigured(): boolean {
	return Boolean(env.TURSO_DATABASE_URL && env.TURSO_AUTH_TOKEN);
}

export function getDb() {
	if (!client) {
		if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
			throw new Error('Database not configured: set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
		}
		client = createClient({
			url: env.TURSO_DATABASE_URL,
			authToken: env.TURSO_AUTH_TOKEN
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

// Auto-initialize on first import. Skipped outright when the credentials are
// missing so an unconfigured deployment does not log a stack trace per boot.
if (isDbConfigured()) {
	initDb().catch(() => {
		// Silent fail - database will be initialized on first use
	});
}
