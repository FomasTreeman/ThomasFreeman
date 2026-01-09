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

export async function getAllContent(includePublishedOnly = false): Promise<ContentEntry[]> {
	const db = getDb();
	const query = includePublishedOnly
		? 'SELECT * FROM content WHERE is_draft = 0 ORDER BY display_order, key'
		: 'SELECT * FROM content ORDER BY display_order, key';
	const result = await db.execute(query);
	return result.rows as unknown as ContentEntry[];
}

export async function getContent(key: string, isLoggedIn = false): Promise<string | null> {
	const db = getDb();
	// If logged in, get latest version (draft or published)
	// If not logged in, only get published version
	const query = isLoggedIn
		? 'SELECT value FROM content WHERE key = ?'
		: 'SELECT value FROM content WHERE key = ? AND is_draft = 0';
	
	const result = await db.execute({ sql: query, args: [key] });
	const row = result.rows[0] as unknown as { value: string } | undefined;
	return row?.value ?? null;
}

export async function setContent(key: string, value: string, isDraft = true): Promise<void> {
	const db = getDb();
	// Get old value for history tracking
	const oldResult = await db.execute({ sql: 'SELECT value FROM content WHERE key = ?', args: [key] });
	const oldValue = (oldResult.rows[0] as unknown as { value: string } | undefined)?.value ?? null;
	const action = oldValue === null ? 'create' : 'update';

	// Update/insert content
	await db.execute({
		sql: `
			INSERT INTO content (key, value, is_draft, updated_at)
			VALUES (?, ?, ?, CURRENT_TIMESTAMP)
			ON CONFLICT(key) DO UPDATE SET
				value = excluded.value,
				is_draft = excluded.is_draft,
				updated_at = CURRENT_TIMESTAMP
		`,
		args: [key, value, isDraft ? 1 : 0]
	});

	// Record history
	await db.execute({
		sql: 'INSERT INTO content_history (key, old_value, new_value, action) VALUES (?, ?, ?, ?)',
		args: [key, oldValue, value, action]
	});
}

export async function deleteContent(key: string): Promise<boolean> {
	const db = getDb();
	// Get old value for history tracking
	const oldResult = await db.execute({ sql: 'SELECT value FROM content WHERE key = ?', args: [key] });
	const oldValue = (oldResult.rows[0] as unknown as { value: string } | undefined)?.value ?? null;

	// Delete content
	const result = await db.execute({ sql: 'DELETE FROM content WHERE key = ?', args: [key] });

	// Record history if something was deleted
	if (result.rowsAffected > 0 && oldValue !== null) {
		await db.execute({
			sql: 'INSERT INTO content_history (key, old_value, new_value, action) VALUES (?, ?, ?, ?)',
			args: [key, oldValue, null, 'delete']
		});
	}

	return result.rowsAffected > 0;
}

export async function contentExists(key: string): Promise<boolean> {
	const db = getDb();
	const result = await db.execute({ sql: 'SELECT 1 FROM content WHERE key = ? LIMIT 1', args: [key] });
	return result.rows.length > 0;
}

export async function publishContent(key: string): Promise<boolean> {
	const db = getDb();
	const result = await db.execute({
		sql: 'UPDATE content SET is_draft = 0, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
		args: [key]
	});
	return result.rowsAffected > 0;
}

export async function getContentHistory(key?: string, limit = 50): Promise<HistoryEntry[]> {
	const db = getDb();
	const query = key
		? 'SELECT * FROM content_history WHERE key = ? ORDER BY changed_at DESC LIMIT ?'
		: 'SELECT * FROM content_history ORDER BY changed_at DESC LIMIT ?';
	const result = key 
		? await db.execute({ sql: query, args: [key, limit] })
		: await db.execute({ sql: query, args: [limit] });
	return result.rows as unknown as HistoryEntry[];
}

export async function getAllHistory(limit = 100): Promise<HistoryEntry[]> {
	return getContentHistory(undefined, limit);
}
