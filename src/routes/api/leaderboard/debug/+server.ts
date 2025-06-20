import { json } from '@sveltejs/kit';
import { list, head } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

const LEADERBOARD_BLOB_NAME = 'pizza-rush-leaderboard.json';

export async function GET() {
	try {
		if (!BLOB_READ_WRITE_TOKEN) {
			return json({ error: 'BLOB_READ_WRITE_TOKEN not configured' }, { status: 500 });
		}

		console.log('Debug: Checking blob status...');

		// Get list of blobs
		const { blobs } = await list({
			token: BLOB_READ_WRITE_TOKEN,
			prefix: LEADERBOARD_BLOB_NAME
		});

		const leaderboardBlob = blobs.find(blob => blob.pathname === LEADERBOARD_BLOB_NAME);

		if (!leaderboardBlob) {
			return json({ 
				exists: false, 
				message: 'Leaderboard blob not found',
				allBlobs: blobs.map(b => ({ pathname: b.pathname, size: b.size, uploadedAt: b.uploadedAt }))
			});
		}

		// Get head info for more details
		const headInfo = await head(leaderboardBlob.url, {
			token: BLOB_READ_WRITE_TOKEN
		});

		// Try to fetch current content
		let currentContent = null;
		let contentError = null;
		try {
			const response = await fetch(`${leaderboardBlob.url}?debug=${Date.now()}`, {
				headers: {
					'Cache-Control': 'no-cache, no-store, must-revalidate',
					'Pragma': 'no-cache'
				}
			});
			if (response.ok) {
				const text = await response.text();
				currentContent = {
					length: text.length,
					preview: text.substring(0, 200),
					isValidJson: (() => {
						try { JSON.parse(text); return true; } catch { return false; }
					})(),
					entriesCount: (() => {
						try { 
							const parsed = JSON.parse(text); 
							return Array.isArray(parsed) ? parsed.length : 'not an array';
						} catch { return 'invalid json'; }
					})()
				};
			} else {
				contentError = `HTTP ${response.status}: ${response.statusText}`;
			}
		} catch (err) {
			contentError = err instanceof Error ? err.message : 'Unknown error';
		}

		return json({
			exists: true,
			blob: {
				pathname: leaderboardBlob.pathname,
				url: leaderboardBlob.url,
				size: leaderboardBlob.size,
				uploadedAt: leaderboardBlob.uploadedAt
			},
			headInfo: {
				size: headInfo.size,
				contentType: headInfo.contentType,
				uploadedAt: headInfo.uploadedAt
			},
			currentContent,
			contentError,
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Debug endpoint error:', error);
		return json({ 
			error: 'Debug check failed', 
			details: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString()
		}, { status: 500 });
	}
}
