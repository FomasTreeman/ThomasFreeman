import { getDb } from './init.js';

export interface ContentEntry {
	id: number;
	key: string;
	value: string;
	updated_at: string;
	is_draft: number;
	display_order: number;
}

export interface HistoryEntry {
	id: number;
	key: string;
	old_value: string | null;
	new_value: string | null;
	action: 'update' | 'delete' | 'create';
	changed_at: string;
}

export function getAllContent(includePublishedOnly = false): ContentEntry[] {
	const db = getDb();
	try {
		const query = includePublishedOnly
			? 'SELECT * FROM content WHERE is_draft = 0 ORDER BY display_order, key'
			: 'SELECT * FROM content ORDER BY display_order, key';
		const stmt = db.prepare(query);
		return stmt.all() as ContentEntry[];
	} finally {
		db.close();
	}
}

export function getContent(key: string, isLoggedIn = false): string | null {
	const db = getDb();
	try {
		// If logged in, get latest version (draft or published)
		// If not logged in, only get published version
		const query = isLoggedIn
			? 'SELECT value FROM content WHERE key = ?'
			: 'SELECT value FROM content WHERE key = ? AND is_draft = 0';
		const stmt = db.prepare(query);
		const result = stmt.get(key) as { value: string } | undefined;
		return result?.value ?? null;
	} finally {
		db.close();
	}
}

export function setContent(key: string, value: string, isDraft = true): void {
	const db = getDb();
	try {
		// Get old value for history tracking
		const oldStmt = db.prepare('SELECT value FROM content WHERE key = ?');
		const oldResult = oldStmt.get(key) as { value: string } | undefined;
		const oldValue = oldResult?.value ?? null;
		const action = oldValue === null ? 'create' : 'update';

		// Update/insert content
		const stmt = db.prepare(`
			INSERT INTO content (key, value, is_draft, updated_at)
			VALUES (?, ?, ?, CURRENT_TIMESTAMP)
			ON CONFLICT(key) DO UPDATE SET
				value = excluded.value,
				is_draft = excluded.is_draft,
				updated_at = CURRENT_TIMESTAMP
		`);
		stmt.run(key, value, isDraft ? 1 : 0);

		// Record history
		const historyStmt = db.prepare(`
			INSERT INTO content_history (key, old_value, new_value, action)
			VALUES (?, ?, ?, ?)
		`);
		historyStmt.run(key, oldValue, value, action);
	} finally {
		db.close();
	}
}

export function deleteContent(key: string): boolean {
	const db = getDb();
	try {
		// Get old value for history tracking
		const oldStmt = db.prepare('SELECT value FROM content WHERE key = ?');
		const oldResult = oldStmt.get(key) as { value: string } | undefined;
		const oldValue = oldResult?.value ?? null;

		// Delete content
		const stmt = db.prepare('DELETE FROM content WHERE key = ?');
		const result = stmt.run(key);

		// Record history if something was deleted
		if (result.changes > 0 && oldValue !== null) {
			const historyStmt = db.prepare(`
				INSERT INTO content_history (key, old_value, new_value, action)
				VALUES (?, ?, ?, ?)
			`);
			historyStmt.run(key, oldValue, null, 'delete');
		}

		return result.changes > 0;
	} finally {
		db.close();
	}
}

export function contentExists(key: string): boolean {
	const db = getDb();
	try {
		const stmt = db.prepare('SELECT 1 FROM content WHERE key = ? LIMIT 1');
		const result = stmt.get(key);
		return result !== undefined;
	} finally {
		db.close();
	}
}

export function publishContent(key: string): boolean {
	const db = getDb();
	try {
		const stmt = db.prepare(`
			UPDATE content
			SET is_draft = 0, updated_at = CURRENT_TIMESTAMP
			WHERE key = ?
		`);
		const result = stmt.run(key);
		return result.changes > 0;
	} finally {
		db.close();
	}
}

export function getContentHistory(key?: string, limit = 50): HistoryEntry[] {
	const db = getDb();
	try {
		const query = key
			? 'SELECT * FROM content_history WHERE key = ? ORDER BY changed_at DESC LIMIT ?'
			: 'SELECT * FROM content_history ORDER BY changed_at DESC LIMIT ?';
		const stmt = db.prepare(query);
		const results = key ? stmt.all(key, limit) : stmt.all(limit);
		return results as HistoryEntry[];
	} finally {
		db.close();
	}
}

export function getAllHistory(limit = 100): HistoryEntry[] {
	return getContentHistory(undefined, limit);
}
