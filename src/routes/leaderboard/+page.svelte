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
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        leaderboard = await response.json();
      } else {
        error = 'Failed to load leaderboard';
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      error = 'Failed to load leaderboard';
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
      case 1: return '#ffd700'; // Gold
      case 2: return '#c0c0c0'; // Silver
      case 3: return '#cd7f32'; // Bronze
      default: return '#ffffff';
    }
  }

  function getPositionEmoji(position: number): string {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${position}.`;
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
    <h1>🏆 Pizza Rush Leaderboard</h1>
    <p>Top pizza masters from around the world!</p>
    <div class="header-actions">
      <button on:click={loadLeaderboard} class="refresh-button" disabled={loading}>
        {#if loading}
          ⏳ Loading...
        {:else}
          🔄 Refresh
        {/if}
      </button>
      <a href="/play" class="play-button">🍕 Play Now</a>
    </div>
  </div>

  {#if loading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
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
      <a href="/play" class="play-button">Start Playing</a>
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
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    font-family: 'JetBrains Mono Variable', monospace;
    color: white;
  }

  .leaderboard-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .leaderboard-header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }

  .leaderboard-header p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }

  .refresh-button, .play-button, .retry-button {
    background: linear-gradient(45deg, #3498db, #2980b9);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    font-weight: bold;
    text-decoration: none;
    display: inline-block;
  }

  .play-button {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
  }

  .refresh-button:hover:not(:disabled), .play-button:hover, .retry-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
  }

  .play-button:hover {
    box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4);
  }

  .refresh-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .loading-state, .error-state, .empty-state {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 3rem;
    margin: 2rem auto;
    max-width: 500px;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .leaderboard-table {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    overflow: hidden;
    max-width: 1000px;
    margin: 0 auto;
  }

  .table-header {
    display: grid;
    grid-template-columns: 80px 1fr 120px 100px 120px;
    background: rgba(255, 255, 255, 0.2);
    padding: 1rem;
    font-weight: bold;
    font-size: 1.1rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  }

  .table-row {
    display: grid;
    grid-template-columns: 80px 1fr 120px 100px 120px;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    align-items: center;
  }

  .table-row:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .table-row.top-three {
    background: rgba(255, 215, 0, 0.1);
  }

  .table-row.top-three:hover {
    background: rgba(255, 215, 0, 0.2);
  }

  .col-rank, .col-score, .col-level, .col-date {
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
    color: #2ecc71;
  }

  .level-badge {
    background: rgba(52, 152, 219, 0.3);
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: bold;
  }

  .date-text {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .leaderboard-container {
      padding: 1rem;
    }

    .leaderboard-header h1 {
      font-size: 2rem;
    }

    .header-actions {
      flex-direction: column;
      gap: 0.5rem;
    }

    .table-header, .table-row {
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
    .table-header, .table-row {
      grid-template-columns: 50px 1fr 70px;
      padding: 0.6rem 0.3rem;
    }

    .col-level, .col-date {
      display: none;
    }

    .leaderboard-header h1 {
      font-size: 1.8rem;
    }
  }
</style>
