import Database from 'better-sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'data', 'dashboard.db');
const db = new Database(dbPath);

try {
	// Add is_draft column (defaults to 0 = published)
	db.exec(`
		ALTER TABLE content ADD COLUMN is_draft INTEGER DEFAULT 0;
	`);

	console.log('✓ Added is_draft column to content table');

	// Create index for faster draft queries
	db.exec(`
		CREATE INDEX IF NOT EXISTS idx_content_is_draft ON content(is_draft);
	`);

	console.log('✓ Created index on is_draft column');
	console.log('Migration complete!');
} catch (error: any) {
	if (error.message.includes('duplicate column name')) {
		console.log('Column already exists, skipping migration');
	} else {
		console.error('Migration failed:', error);
		process.exit(1);
	}
} finally {
	db.close();
}
