import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path - relative to project root
const DB_PATH = join(__dirname, '../../../data/dashboard.db');

export function getDb() {
	const db = new Database(DB_PATH);
	db.pragma('journal_mode = WAL');
	return db;
}

export function initDb() {
	const db = getDb();

	// Create content table
	db.exec(`
		CREATE TABLE IF NOT EXISTS content (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			key TEXT UNIQUE NOT NULL,
			value TEXT NOT NULL,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Create sessions table for auth
	db.exec(`
		CREATE TABLE IF NOT EXISTS sessions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			token TEXT UNIQUE NOT NULL,
			email TEXT NOT NULL,
			expires_at DATETIME NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Create magic_links table for temporary login links
	db.exec(`
		CREATE TABLE IF NOT EXISTS magic_links (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			token TEXT UNIQUE NOT NULL,
			email TEXT NOT NULL,
			expires_at DATETIME NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Create content_history table for tracking changes
	db.exec(`
		CREATE TABLE IF NOT EXISTS content_history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			key TEXT NOT NULL,
			old_value TEXT,
			new_value TEXT,
			action TEXT NOT NULL,
			changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Create index for faster lookups
	db.exec(`CREATE INDEX IF NOT EXISTS idx_content_key ON content(key)`);
	db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`);
	db.exec(`CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token)`);
	db.exec(`CREATE INDEX IF NOT EXISTS idx_content_history_key ON content_history(key)`);
	db.exec(`CREATE INDEX IF NOT EXISTS idx_content_history_changed_at ON content_history(changed_at)`);

	db.close();
	console.log('Database initialized successfully');
}

// Auto-initialize on first import
try {
	initDb();
} catch (error) {
	console.error('Failed to initialize database:', error);
}
