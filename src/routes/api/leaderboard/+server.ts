import { json } from '@sveltejs/kit';
import { put, list } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

interface LeaderboardEntry {
	name: string;
	score: number;
	level: number;
	date: string;
	id: string;
}

const LEADERBOARD_BLOB_NAME = 'pizza-rush-leaderboard.json';

async function readLeaderboard(): Promise<LeaderboardEntry[]> {
	try {
		const { blobs } = await list({
			token: BLOB_READ_WRITE_TOKEN,
			prefix: LEADERBOARD_BLOB_NAME
		});
		
		const leaderboardBlob = blobs.find(blob => blob.pathname === LEADERBOARD_BLOB_NAME);
		
		if (!leaderboardBlob) {
			return [];
		}
		
		// Try multiple cache-busting strategies
		const cacheBypassStrategies = [
			`${leaderboardBlob.url}?t=${Date.now()}&cache=${Math.random()}`,
			`${leaderboardBlob.url}?nocache=${Date.now()}`,
			`${leaderboardBlob.url}?v=${Date.now()}`
		];

		for (const url of cacheBypassStrategies) {
			try {
				const response = await fetch(url, {
					headers: {
						'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
						'Pragma': 'no-cache',
						'Expires': '0',
						'If-None-Match': '*'
					}
				});

				if (response.ok) {
					const text = await response.text();
					
					if (!text.trim()) {
						continue;
					}
					
					const data = JSON.parse(text);
					return Array.isArray(data) ? data : [];
				}
			} catch (fetchError) {
				continue;
			}
		}

		return [];
		
	} catch (error) {
		if (error instanceof Error && (
			error.message.includes('NotFound') || 
			error.message.includes('404') ||
			error.message.includes('does not exist')
		)) {
			return [];
		}
		
		console.error('Error reading leaderboard:', error);
		return [];
	}
}

async function writeLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
	await put(
		LEADERBOARD_BLOB_NAME, 
		JSON.stringify(entries, null, 2), 
		{ 
			access: 'public',
			contentType: 'application/json',
			token: BLOB_READ_WRITE_TOKEN,
			allowOverwrite: true
		}
	);
}

// GET - Retrieve leaderboard
export async function GET() {
	if (!BLOB_READ_WRITE_TOKEN) {
		return json({ error: 'Leaderboard service not configured' }, { status: 500 });
	}

	try {
		const leaderboard = await readLeaderboard();
		const sortedLeaderboard = leaderboard.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return b.level - a.level;
		});
		
		return json(sortedLeaderboard, {
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0'
			}
		});
	} catch (error) {
		console.error('Error fetching leaderboard:', error);
		return json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
	}
}

// POST - Add new score
export async function POST({ request }: { request: Request }) {
	if (!BLOB_READ_WRITE_TOKEN) {
		return json({ error: 'Leaderboard service not configured' }, { status: 500 });
	}

	try {
		const { name, score, level } = await request.json();
		
		if (!name || typeof score !== 'number' || typeof level !== 'number') {
			return json({ error: 'Invalid data provided' }, { status: 400 });
		}

		const leaderboard = await readLeaderboard();
		
		const newEntry: LeaderboardEntry = {
			name: name.trim().substring(0, 20),
			score,
			level,
			date: new Date().toISOString(),
			id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
		};

		leaderboard.push(newEntry);
		
		const sortedLeaderboard = leaderboard.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return b.level - a.level;
		}).slice(0, 100);

		await writeLeaderboard(sortedLeaderboard);

		// Brief delay for eventual consistency
		await new Promise(resolve => setTimeout(resolve, 500));

		return json({ success: true, entry: newEntry }, {
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0'
			}
		});
	} catch (error) {
		console.error('Error adding score:', error);
		return json({ error: 'Failed to add score' }, { status: 500 });
	}
}
