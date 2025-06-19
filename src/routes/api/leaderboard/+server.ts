import { json } from '@sveltejs/kit';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface LeaderboardEntry {
	name: string;
	score: number;
	level: number;
	date: string;
	id: string;
}

const LEADERBOARD_FILE = join(process.cwd(), 'static', 'leaderboard.json');

function readLeaderboard(): LeaderboardEntry[] {
	try {
		const data = readFileSync(LEADERBOARD_FILE, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading leaderboard:', error);
		return [];
	}
}

function writeLeaderboard(entries: LeaderboardEntry[]): void {
	try {
		writeFileSync(LEADERBOARD_FILE, JSON.stringify(entries, null, 2));
	} catch (error) {
		console.error('Error writing leaderboard:', error);
	}
}

// GET - Retrieve leaderboard
export async function GET() {
	const leaderboard = readLeaderboard();
	// Sort by score descending, then by level descending
	const sortedLeaderboard = leaderboard.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return b.level - a.level;
	});
	
	return json(sortedLeaderboard);
}

// POST - Add new score
export async function POST({ request }) {
	try {
		const { name, score, level } = await request.json();
		
		if (!name || typeof score !== 'number' || typeof level !== 'number') {
			return json({ error: 'Invalid data provided' }, { status: 400 });
		}

		const leaderboard = readLeaderboard();
		
		const newEntry: LeaderboardEntry = {
			name: name.trim().substring(0, 20), // Limit name length
			score,
			level,
			date: new Date().toISOString(),
			id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
		};

		leaderboard.push(newEntry);
		
		// Keep only top 100 scores to prevent file from growing too large
		const sortedLeaderboard = leaderboard.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return b.level - a.level;
		}).slice(0, 100);

		writeLeaderboard(sortedLeaderboard);

		return json({ success: true, entry: newEntry });
	} catch (error) {
		console.error('Error adding score:', error);
		return json({ error: 'Failed to add score' }, { status: 500 });
	}
}
