<script lang="ts">
	import { onMount } from 'svelte';

	interface LeaderboardEntry {
		name: string;
		score: number;
		level: number;
		date: string;
		id: string;
	}

	let leaderboard: LeaderboardEntry[] = [];
	let loading = true;
	let error = '';

	async function loadLeaderboard() {
		try {
			loading = true;
			error = '';
			const response = await fetch(`/api/leaderboard?t=${Date.now()}`, {
				headers: {
					'Cache-Control': 'no-cache, no-store, must-revalidate',
					Pragma: 'no-cache',
					Expires: '0'
				}
			});

			if (response.ok) {
				const data = await response.json();
				if (data.error) {
					error = data.error;
				} else {
					leaderboard = data;
				}
			} else {
				const errorData = await response.json().catch(() => ({}));
				error = errorData.error || 'Failed to load leaderboard';
			}
		} catch (err) {
			error = 'Failed to connect to leaderboard service';
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getScoreColor(position: number): string {
		switch (position) {
			case 1:
				return 'var(--primary-color1)'; // Orange/Gold
			case 2:
				return 'var(--secondary-color2)'; // Light Blue
			case 3:
				return 'var(--primary-color2)'; // Yellow
			default:
				return 'var(--color)';
		}
	}

	function getPositionEmoji(position: number): string {
		switch (position) {
			case 1:
				return '🥇';
			case 2:
				return '🥈';
			case 3:
				return '🥉';
			default:
				return `${position}.`;
		}
	}

	onMount(() => {
		loadLeaderboard();
	});
</script>

<svelte:head>
	<title>Pizza Rush - Leaderboard</title>
</svelte:head>

<div class="leaderboard-container">
	<div class="leaderboard-header">
		<h1><span class="emoji">🏆</span> Pizza Rush Leaderboard</h1>
		<p>Top pizza masters from around the world!</p>
		<div class="header-actions">
			<button on:click={loadLeaderboard} class="refresh-button" disabled={loading}>
				{#if loading}
					⏳ Loading...
				{:else}
					🔄 Refresh
				{/if}
			</button>
			<a href="/play?autostart=true" class="play-button">🍕 Play Now</a>
		</div>
	</div>

	{#if loading}
		<div class="loading-state">
			<div class="loading-spinner" />
			<p>Loading leaderboard...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<h2>😢 Oops!</h2>
			<p>{error}</p>
			<button on:click={loadLeaderboard} class="retry-button">Try Again</button>
		</div>
	{:else if leaderboard.length === 0}
		<div class="empty-state">
			<h2>🍕 No scores yet!</h2>
			<p>Be the first to set a high score!</p>
			<a href="/play?autostart=true" class="play-button">Start Playing</a>
		</div>
	{:else}
		<div class="leaderboard-table">
			<div class="table-header">
				<div class="col-rank">Rank</div>
				<div class="col-name">Player</div>
				<div class="col-score">Score</div>
				<div class="col-level">Level</div>
				<div class="col-date">Date</div>
			</div>

			{#each leaderboard as entry, index}
				<div class="table-row" class:top-three={index < 3}>
					<div class="col-rank">
						<span class="rank-badge" style="color: {getScoreColor(index + 1)}">
							{getPositionEmoji(index + 1)}
						</span>
					</div>
					<div class="col-name">
						<span class="player-name">{entry.name}</span>
					</div>
					<div class="col-score">
						<span class="score-value">{entry.score.toLocaleString()}</span>
					</div>
					<div class="col-level">
						<span class="level-badge">Level {entry.level}</span>
					</div>
					<div class="col-date">
						<span class="date-text">{formatDate(entry.date)}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.leaderboard-container {
		position: relative;
		z-index: 1;
	}

	.leaderboard-header {
		position: relative;
		z-index: 1;
		text-align: center;
		margin-bottom: 3rem;
		padding: 2rem;
	}

	.leaderboard-header h1 {
		font-size: 3.5rem;
		font-weight: 800;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, var(--primary-color1), var(--primary-color2));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-shadow: none;
		margin-top: 7rem;
	}

	.leaderboard-header h1 .emoji {
		-webkit-text-fill-color: white;
	}

	.leaderboard-header p {
		font-size: 1.3rem;
		opacity: 0.9;
		margin-bottom: 2rem;
		font-family: 'Work Sans', sans-serif;
	}

	.header-actions {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		align-items: center;
	}

	.refresh-button,
	.play-button,
	.retry-button {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(15px);
		color: var(--color);
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 1rem 2rem;
		font-size: 1.1rem;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: 'JetBrains Mono Variable', monospace;
		font-weight: bold;
		text-decoration: none;
		display: inline-block;
		position: relative;
		overflow: hidden;
	}

	.play-button {
		background: linear-gradient(135deg, var(--primary-color1), var(--primary-color2));
		color: var(--background-color);
		border-color: var(--primary-color1);
	}

	.play-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s;
	}

	.play-button:hover::before {
		left: 100%;
	}

	.refresh-button:hover:not(:disabled),
	.retry-button:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--secondary-color1);
		box-shadow: 0 4px 20px rgba(0, 121, 255, 0.3);
		transform: translateY(-2px);
	}

	.play-button:hover {
		box-shadow: 0 8px 25px rgba(255, 138, 0, 0.4);
		transform: translateY(-2px);
	}

	.refresh-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.loading-state,
	.error-state,
	.empty-state {
		position: relative;
		z-index: 1;
		text-align: center;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		padding: 3rem;
		margin: 2rem auto;
		max-width: 500px;
	}

	.loading-spinner {
		width: 50px;
		height: 50px;
		border: 4px solid rgba(255, 255, 255, 0.2);
		border-top: 4px solid var(--primary-color1);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.leaderboard-table {
		position: relative;
		z-index: 1;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		overflow: hidden;
		max-width: 1000px;
		margin: 0 auto;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.table-header {
		display: grid;
		grid-template-columns: 80px 1fr 120px 120px 120px;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		padding: 1rem;
		font-weight: bold;
		font-size: 1.1rem;
		border-bottom: 2px solid rgba(255, 255, 255, 0.2);
		color: var(--primary-color1);
	}

	.table-row {
		display: grid;
		grid-template-columns: 80px 1fr 120px 120px 120px;
		padding: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		transition: all 0.3s ease;
		align-items: center;
	}

	.table-row:hover {
		background: rgba(255, 255, 255, 0.08);
		transform: translateX(2px);
	}

	.table-row.top-three {
		background: linear-gradient(90deg, rgba(255, 138, 0, 0.1), rgba(249, 220, 0, 0.05));
		border-left: 3px solid var(--primary-color1);
	}

	.table-row.top-three:hover {
		background: linear-gradient(90deg, rgba(255, 138, 0, 0.15), rgba(249, 220, 0, 0.08));
	}

	.col-rank,
	.col-score,
	.col-level,
	.col-date {
		text-align: center;
	}

	.col-name {
		text-align: left;
		padding-left: 1rem;
	}

	.rank-badge {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.player-name {
		font-weight: bold;
		font-size: 1.1rem;
	}

	.score-value {
		font-weight: bold;
		font-size: 1.2rem;
		color: var(--secondary-color1);
	}

	.level-badge {
		background: linear-gradient(135deg, rgba(0, 121, 255, 0.3), rgba(72, 190, 255, 0.2));
		border: 1px solid rgba(0, 121, 255, 0.4);
		padding: 0.3rem 0.8rem;
		border-radius: 12px;
		font-size: 0.9rem;
		font-weight: bold;
		color: var(--secondary-color1);
	}

	.date-text {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.leaderboard-container {
			padding-inline: 1rem;
		}

		.leaderboard-header h1 {
			font-size: 2rem;
			margin-top: 3rem;
		}

		.header-actions {
			flex-direction: column;
			gap: 0.5rem;
		}

		.table-header,
		.table-row {
			grid-template-columns: 60px 1fr 80px 70px 80px;
			padding: 0.8rem 0.5rem;
			font-size: 0.9rem;
		}

		.col-name {
			padding-left: 0.5rem;
		}

		.player-name {
			font-size: 1rem;
		}

		.score-value {
			font-size: 1rem;
		}

		.rank-badge {
			font-size: 1.2rem;
		}

		.level-badge {
			padding: 0.2rem 0.5rem;
			font-size: 0.8rem;
		}

		.date-text {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 480px) {
		.table-header,
		.table-row {
			grid-template-columns: 50px 1fr 70px;
			padding: 0.6rem 0.3rem;
		}

		.col-level,
		.col-date {
			display: none;
		}

		.leaderboard-header h1 {
			font-size: 1.8rem;
		}
	}
</style>
