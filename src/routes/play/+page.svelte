<script lang="ts">
  import { onMount } from 'svelte';

  interface Order {
    id: number;
    ingredients: string[];
    timeLeft: number;
    completed: boolean;
  }

  interface Pizza {
    ingredients: string[];
  }

  let gameState = {
    score: 0,
    lives: 3,
    level: 1,
    combo: 0,
    activeOrders: [] as Order[],
    currentPizza: { ingredients: [] } as Pizza,
    gameRunning: true,
    gameStarted: false,
    isPaused: false,
    showNameInput: false,
    isSubmittingScore: false
  };

  let playerName = '';
  let nameInputError = '';

  // Reactive statements for better state management
  $: gameStatusText = gameState.isPaused ? 'PAUSED' : (gameState.gameRunning ? 'PLAYING' : 'STOPPED');

  const INGREDIENTS = [
    { name: 'dough', emoji: '🫓', required: true },
    { name: 'sauce', emoji: '🍅', required: true },
    { name: 'cheese', emoji: '🧀', required: true },
    { name: 'pepperoni', emoji: '🍕', required: false },
    { name: 'mushrooms', emoji: '🍄', required: false },
    { name: 'olives', emoji: '🫒', required: false },
    { name: 'peppers', emoji: '🌶️', required: false }
  ];

  const ORDER_TEMPLATES = [
    ['dough', 'sauce', 'cheese'],
    ['dough', 'sauce', 'cheese', 'pepperoni'],
    ['dough', 'sauce', 'cheese', 'mushrooms'],
    ['dough', 'sauce', 'cheese', 'pepperoni', 'mushrooms'],
    ['dough', 'sauce', 'cheese', 'olives'],
    ['dough', 'sauce', 'cheese', 'peppers'],
    ['dough', 'sauce', 'cheese', 'pepperoni', 'olives'],
    ['dough', 'sauce', 'cheese', 'mushrooms', 'peppers']
  ];

  let orderIdCounter = 1;
  let gameInterval: ReturnType<typeof setInterval>;
  let orderInterval: ReturnType<typeof setInterval>;

  let celebrationEffect = false;

  function startGame() {
    gameState = {
      ...gameState,
      gameStarted: true,
      gameRunning: true,
      isPaused: false,
      score: 0,
      lives: 3,
      level: 1,
      combo: 0,
      activeOrders: [],
      currentPizza: { ingredients: [] }
    };

    // Generate initial order
    generateOrder();

    // Start game loop
    gameInterval = setInterval(() => {
      updateGame();
    }, 100);

    // Generate new orders periodically
    orderInterval = setInterval(() => {
      if (gameState.activeOrders.length < 3) {
        generateOrder();
      }
    }, 8000 - (gameState.level * 500)); // Orders come faster at higher levels
  }

  function generateOrder(): void {
    const template = ORDER_TEMPLATES[Math.floor(Math.random() * ORDER_TEMPLATES.length)];
    const order: Order = {
      id: orderIdCounter++,
      ingredients: [...template],
      timeLeft: 30 + (Math.random() * 20), // 30-50 seconds
      completed: false
    };
    
    gameState = {
      ...gameState,
      activeOrders: [...gameState.activeOrders, order]
    };
  }

  function updateGame(): void {
    if (!gameState.gameRunning || gameState.isPaused) return;

    // Update order timers
    let livesLost = 0;
    const updatedOrders = gameState.activeOrders.map(order => {
      if (!order.completed) {
        const newTimeLeft = order.timeLeft - 0.1;
        if (newTimeLeft <= 0) {
          // Order expired, lose a life and reset combo
          livesLost++;
          return null;
        }
        // Return updated order with new time
        return { ...order, timeLeft: newTimeLeft };
      }
      return order;
    }).filter(Boolean) as Order[];

    // Update game state with new orders and handle life loss
    if (livesLost > 0) {
      const newLives = gameState.lives - livesLost;
      gameState = {
        ...gameState,
        lives: newLives,
        combo: 0,
        activeOrders: updatedOrders
      };
      
      if (newLives <= 0) {
        endGame();
        return;
      }
    } else {
      // Just update the orders with new times
      gameState = {
        ...gameState,
        activeOrders: updatedOrders
      };
    }

    // Check for level progression
    if (gameState.score >= gameState.level * 100) {
      gameState = {
        ...gameState,
        level: gameState.level + 1
      };
    }
  }

  function playSound(type: 'success' | 'error' | 'click') {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'success':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.1); // G3
        break;
      case 'click':
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        break;
    }
    
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  function addIngredient(ingredientName: string): void {
    if (!gameState.gameRunning || gameState.isPaused) return;
    
    if (!gameState.currentPizza.ingredients.includes(ingredientName)) {
      gameState = {
        ...gameState,
        currentPizza: {
          ...gameState.currentPizza,
          ingredients: [...gameState.currentPizza.ingredients, ingredientName]
        }
      };
      playSound('click');
    }
  }

  function servePizza(): void {
    if (!gameState.gameRunning || gameState.isPaused || gameState.currentPizza.ingredients.length === 0) return;

    // Check if current pizza matches any active order
    const matchingOrder = gameState.activeOrders.find(order => 
      !order.completed && 
      arraysEqual(order.ingredients.sort(), gameState.currentPizza.ingredients.sort())
    );

    if (matchingOrder) {
      // Successful order completion
      matchingOrder.completed = true;
      const newCombo = gameState.combo + 1;
      const timeBonus = Math.floor(matchingOrder.timeLeft * 2);
      const comboBonus = newCombo * 10;
      
      gameState = {
        ...gameState,
        combo: newCombo,
        score: gameState.score + 50 + timeBonus + comboBonus,
        currentPizza: { ingredients: [] }
      };
      
      // Play success sound and show celebration
      playSound('success');
      celebrationEffect = true;
      setTimeout(() => {
        celebrationEffect = false;
      }, 1000);
      
      // Remove completed order after a short delay
      setTimeout(() => {
        gameState = {
          ...gameState,
          activeOrders: gameState.activeOrders.filter(order => order.id !== matchingOrder.id)
        };
      }, 1000);
    } else {
      // Wrong pizza, lose a life and reset combo
      const newLives = gameState.lives - 1;
      gameState = {
        ...gameState,
        lives: newLives,
        combo: 0,
        currentPizza: { ingredients: [] }
      };
      
      playSound('error');
      if (newLives <= 0) {
        endGame();
      }
    }
  }

  function clearPizza(): void {
    if (gameState.isPaused) return;
    gameState = {
      ...gameState,
      currentPizza: { ingredients: [] }
    };
  }

  function arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every(val => b.includes(val));
  }

  function endGame(): void {
    gameState = { ...gameState, gameRunning: false, isPaused: false, showNameInput: true };
    clearInterval(gameInterval);
    clearInterval(orderInterval);
  }

  async function submitScore() {
    if (!playerName.trim()) {
      nameInputError = 'Please enter your name';
      return;
    }

    if (playerName.trim().length < 2) {
      nameInputError = 'Name must be at least 2 characters';
      return;
    }

    gameState = { ...gameState, isSubmittingScore: true };
    nameInputError = '';

    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName.trim(),
          score: gameState.score,
          level: gameState.level
        })
      });

      if (response.ok) {
        gameState = { ...gameState, showNameInput: false, isSubmittingScore: false };
        playSound('success');
      } else {
        nameInputError = 'Failed to submit score. Please try again.';
        gameState = { ...gameState, isSubmittingScore: false };
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      nameInputError = 'Failed to submit score. Please try again.';
      gameState = { ...gameState, isSubmittingScore: false };
    }
  }

  function skipLeaderboard() {
    gameState = { ...gameState, showNameInput: false };
  }

  function resetGame(): void {
    gameState = {
      ...gameState,
      gameStarted: false,
      gameRunning: false,
      isPaused: false,
      showNameInput: false,
      isSubmittingScore: false,
      score: 0,
      lives: 3,
      level: 1,
      combo: 0,
      activeOrders: [],
      currentPizza: { ingredients: [] }
    };
    playerName = '';
    nameInputError = '';
    clearInterval(gameInterval);
    clearInterval(orderInterval);
  }

  function getIngredientEmoji(name: string): string {
    return INGREDIENTS.find(ing => ing.name === name)?.emoji || '❓';
  }

  function pauseGame(): void {
    if (!gameState.gameRunning) return;
    gameState = { ...gameState, isPaused: true };
    playSound('click');
  }

  function resumeGame(): void {
    if (!gameState.gameRunning) return;
    gameState = { ...gameState, isPaused: false };
    playSound('click');
  }

  onMount(() => {
    // Add keyboard event listener for pause/resume
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && gameState.gameStarted) {
        event.preventDefault();
        if (gameState.isPaused) {
          resumeGame();
        } else {
          pauseGame();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
      clearInterval(orderInterval);
    };
  });
</script>

<div class="game-container">
  {#if !gameState.gameStarted}
    <!-- Start Screen -->
    <div class="start-screen">
      <h1>🍕 Pizza Rush! 🍕</h1>
      <p>Make pizzas to match customer orders!</p>
      <div class="start-buttons">
        <button on:click={startGame} class="start-button">Start Game</button>
        <a href="/leaderboard" class="leaderboard-link">🏆 View Leaderboard</a>
      </div>
      <div class="instructions">
        <h3>How to Play:</h3>
        <ul>
          <li>Click ingredients to add them to your pizza</li>
          <li>Match the customer orders exactly</li>
          <li>Serve pizzas before time runs out</li>
          <li>Don't make mistakes or you'll lose lives!</li>
          <li>Press SPACEBAR or click Pause to pause the game</li>
        </ul>
      </div>
    </div>
  {:else}
    <!-- Game Screen -->
    <div class="game-ui">
      <div class="stats">
        <div class="stat-item">Score: {gameState.score}</div>
        <div class="stat-item">Lives: {'❤️'.repeat(gameState.lives)}</div>
        <div class="stat-item">Level: {gameState.level}</div>
        <div class="stat-item">Combo: {gameState.combo > 0 ? `🔥 ${gameState.combo}` : '0'}</div>
        <div class="stat-item status-indicator" class:paused={gameState.isPaused}>
          Status: <span class="status-text">{gameStatusText}</span>
        </div>
        <div class="stat-item">
          {#if gameState.isPaused}
            <button on:click={resumeGame} class="pause-play-button play">
              ▶️ Resume
            </button>
          {:else}
            <button on:click={pauseGame} class="pause-play-button pause">
              ⏸️ Pause
            </button>
          {/if}
        </div>
      </div>

      <!-- Active Orders -->
      <div class="orders-section">
        <h3>Customer Orders:</h3>
        <div class="orders-list">
          {#each gameState.activeOrders as order (order.id)}
            <div class="order-card" class:completed={order.completed}>
              <div class="order-ingredients">
                {#each order.ingredients as ingredient}
                  <span class="ingredient-icon">{getIngredientEmoji(ingredient)}</span>
                {/each}
              </div>
              <div class="order-timer">
                <div class="timer-bar">
                  <div 
                    class="timer-fill" 
                    style="width: {Math.max(0, (order.timeLeft / 50) * 100)}%"
                  ></div>
                </div>
                <span class="timer-text">{Math.ceil(order.timeLeft)}s</span>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Current Pizza -->
      <div class="pizza-section">
        <h3>Your Pizza:</h3>
        <div class="current-pizza" class:celebration={celebrationEffect}>
          {#if gameState.currentPizza.ingredients.length === 0}
            <div class="empty-pizza">Click ingredients to start making a pizza!</div>
          {:else}
            <div class="pizza-ingredients">
              {#each gameState.currentPizza.ingredients as ingredient}
                <span class="ingredient-icon large">{getIngredientEmoji(ingredient)}</span>
              {/each}
            </div>
          {/if}
          
          {#if celebrationEffect}
            <div class="celebration-text">Perfect! 🎉</div>
          {/if}
        </div>
        
        <div class="pizza-actions">
          <button on:click={servePizza} class="serve-button" disabled={gameState.currentPizza.ingredients.length === 0}>
            Serve Pizza
          </button>
          <button on:click={clearPizza} class="clear-button" disabled={gameState.currentPizza.ingredients.length === 0}>
            Clear Pizza
          </button>
        </div>
      </div>

      <!-- Ingredients Selection -->
      <div class="ingredients-section">
        <h3>Ingredients:</h3>
        <div class="ingredients-grid">
          {#each INGREDIENTS as ingredient}
            <button 
              on:click={() => addIngredient(ingredient.name)}
              class="ingredient-button"
              class:added={gameState.currentPizza.ingredients.includes(ingredient.name)}
            >
              <span class="ingredient-emoji">{ingredient.emoji}</span>
              <span class="ingredient-name">{ingredient.name}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Name Input Screen -->
      {#if gameState.showNameInput}
        <div class="game-over-overlay">
          <div class="game-over-content name-input-content">
            <h2>🏆 Game Over!</h2>
            <p>Final Score: <strong>{gameState.score}</strong></p>
            <p>Level Reached: <strong>{gameState.level}</strong></p>
            
            <div class="name-input-section">
              <h3>Enter your name for the leaderboard:</h3>
              <input 
                type="text" 
                bind:value={playerName}
                placeholder="Your name..."
                maxlength="20"
                class="name-input"
                class:error={nameInputError}
                on:keydown={(e) => e.key === 'Enter' && submitScore()}
                disabled={gameState.isSubmittingScore}
              />
              {#if nameInputError}
                <p class="error-message">{nameInputError}</p>
              {/if}
            </div>

            <div class="name-input-buttons">
              <button 
                on:click={submitScore} 
                class="submit-score-button"
                disabled={gameState.isSubmittingScore}
              >
                {#if gameState.isSubmittingScore}
                  ⏳ Submitting...
                {:else}
                  🚀 Submit Score
                {/if}
              </button>
              <button 
                on:click={skipLeaderboard} 
                class="skip-button"
                disabled={gameState.isSubmittingScore}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Game Over Screen -->
      {#if !gameState.gameRunning && !gameState.showNameInput}
        <div class="game-over-overlay">
          <div class="game-over-content">
            <h2>Thanks for playing!</h2>
            <p>Final Score: <strong>{gameState.score}</strong></p>
            <p>Level Reached: <strong>{gameState.level}</strong></p>
            <button on:click={resetGame} class="restart-button">Play Again</button>
          </div>
        </div>
      {/if}

      <!-- Pause Screen -->
      {#if gameState.isPaused && gameState.gameRunning}
        <div class="pause-overlay">
          <div class="pause-content">
            <h2>⏸️ Game Paused</h2>
            <p>Click Resume to continue playing</p>
            <button on:click={resumeGame} class="resume-button">▶️ Resume Game</button>
            <button on:click={resetGame} class="quit-button">🏠 Quit to Menu</button>
          </div>
        </div>
      {/if}

      <!-- Celebration Effect -->
      {#if celebrationEffect}
        <div class="celebration-effect">
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
        </div>
      {/if}

      <!-- Leaderboard Submission -->
      {#if gameState.showNameInput}
        <div class="name-input-overlay">
          <div class="name-input-content">
            <h2>Submit Your Score</h2>
            <p>Enter your name to submit your score to the leaderboard:</p>
            <input 
              type="text" 
              bind:value={playerName} 
              placeholder="Your Name"
              class="name-input"
            />
            {#if nameInputError}
              <div class="error-message">{nameInputError}</div>
            {/if}
            <div class="name-input-actions">
              <button on:click={submitScore} class="submit-button" disabled={gameState.isSubmittingScore}>
                {#if gameState.isSubmittingScore}
                  <span class="loading-spinner"></span> Submitting...
                {:else}
                  Submit Score
                {/if}
              </button>
              <button on:click={skipLeaderboard} class="skip-button">
                Skip
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .game-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    font-family: 'JetBrains Mono Variable', monospace;
    overflow-y: auto;
    position: relative;
  }

  /* Start Screen */
  .start-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    text-align: center;
    color: white;
  }

  .start-screen h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }

  .start-screen p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .start-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
  }

  .start-button {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    font-weight: bold;
  }

  .leaderboard-link {
    background: linear-gradient(45deg, #ffd700, #ffb347);
    color: #333;
    text-decoration: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    font-family: inherit;
    font-weight: bold;
    display: inline-block;
  }

  .start-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  }

  .leaderboard-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
  }

  .instructions {
    margin-top: 3rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2rem;
    max-width: 500px;
  }

  .instructions h3 {
    margin-bottom: 1rem;
    color: #ffd700;
  }

  .instructions ul {
    text-align: left;
    list-style: none;
    padding: 0;
  }

  .instructions li {
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;
  }

  .instructions li:before {
    content: "🍕";
    position: absolute;
    left: 0;
  }

  /* Game UI */
  .game-ui {
    max-width: 1200px;
    margin: 4.7rem auto;
    color: white;
  }

  @media (max-width: 768px) {
    .game-ui {
      margin: 0 auto;
    }
  }

  .stats {
    display: flex;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .status-indicator {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.5rem;
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }

  .status-indicator.paused {
    border-color: #f39c12;
    background: rgba(243, 156, 18, 0.2);
  }

  .status-text {
    margin-left: 0.5rem;
    font-weight: bold;
  }

  .status-indicator.paused .status-text {
    color: #f39c12;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
  }

  /* Orders Section */
  .orders-section {
    margin-bottom: 2rem;
  }

  .orders-section h3 {
    text-align: center;
    margin-bottom: 1rem;
    color: #ffd700;
    font-size: 1.5rem;
  }

  .orders-list {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .order-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1rem;
    min-width: 200px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .order-card.completed {
    background: rgba(46, 204, 113, 0.3);
    border-color: #2ecc71;
  }

  .order-ingredients {
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }

  .ingredient-icon {
    font-size: 1.5rem;
  }

  .ingredient-icon.large {
    font-size: 2rem;
  }

  .order-timer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .timer-bar {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
  }

  .timer-fill {
    height: 100%;
    background: linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71);
    transition: width 0.1s linear;
  }

  .timer-text {
    font-size: 0.9rem;
    font-weight: bold;
  }

  /* Pizza Section */
  .pizza-section {
    margin-bottom: 2rem;
  }

  .pizza-section h3 {
    text-align: center;
    margin-bottom: 1rem;
    color: #ffd700;
    font-size: 1.5rem;
  }

  .current-pizza {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 1rem;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .empty-pizza {
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
  }

  .pizza-ingredients {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .pizza-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .serve-button, .clear-button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .serve-button {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
    color: white;
  }

  .serve-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(46, 204, 113, 0.4);
  }

  .clear-button {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    color: white;
  }

  .clear-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(231, 76, 60, 0.4);
  }

  .serve-button:disabled, .clear-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Ingredients Section */
  .ingredients-section h3 {
    text-align: center;
    margin-bottom: 1rem;
    color: #ffd700;
    font-size: 1.5rem;
  }

  .ingredients-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .ingredient-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-family: inherit;
  }

  .ingredient-button:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.2);
    border-color: #ffd700;
  }

  .ingredient-button.added {
    background: rgba(46, 204, 113, 0.3);
    border-color: #2ecc71;
  }

  .ingredient-emoji {
    font-size: 2rem;
  }

  .ingredient-name {
    font-size: 0.9rem;
    font-weight: bold;
    text-transform: capitalize;
  }

  /* Game Over */
  .game-over-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .game-over-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 3rem;
    text-align: center;
    color: white;
    max-width: 400px;
  }

  .game-over-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #e74c3c;
  }

  .game-over-content p {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .restart-button {
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
    margin-top: 1rem;
  }

  .restart-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
  }

  /* Celebration Effect */
  .celebration-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: confetti-fall 1.5s ease-out infinite;
  }

  @keyframes confetti-fall {
    0% { transform: translateY(0) scale(1); }
    50% { transform: translateY(100vh) scale(1.2); }
    100% { transform: translateY(200vh) scale(1); }
  }

  .current-pizza {
    position: relative;
    overflow: hidden;
  }

  .current-pizza.celebration {
    animation: celebrate 0.5s ease-in-out;
    background: rgba(46, 204, 113, 0.3);
    border: 2px solid #2ecc71;
  }

  .celebration-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    font-weight: bold;
    color: #2ecc71;
    animation: celebrationPop 1s ease-out;
    pointer-events: none;
  }

  @keyframes celebrate {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes celebrationPop {
    0% { 
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    50% { 
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% { 
      opacity: 0;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  /* Pause/Play Button */
  .pause-play-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid transparent;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: bold;
    transition: all 0.3s ease;
    color: white;
  }

  .pause-play-button.pause {
    border-color: #f39c12;
  }

  .pause-play-button.play {
    border-color: #2ecc71;
  }

  .pause-play-button:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.2);
  }

  .pause-play-button.pause:hover {
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
  }

  .pause-play-button.play:hover {
    box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
  }

  /* Pause Overlay */
  .pause-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }

  .pause-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 3rem;
    text-align: center;
    color: white;
    max-width: 400px;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .pause-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #f39c12;
  }

  .pause-content p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .resume-button, .quit-button {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    font-weight: bold;
    margin: 0.5rem;
    min-width: 150px;
  }

  .quit-button {
    background: linear-gradient(45deg, #95a5a6, #7f8c8d);
  }

  .resume-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
  }

  .quit-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(149, 165, 166, 0.4);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .game-container {
      padding: 0.5rem;
      min-height: auto;
      overflow-y: visible;
    }

    .start-screen {
      min-height: 100vh;
      padding: 1rem;
    }

    .start-screen h1 {
      font-size: 2rem;
    }

    .start-buttons {
      flex-direction: column;
      gap: 0.8rem;
    }

    .start-button, .leaderboard-link {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
    }

    .game-ui {
      padding-bottom: 2rem;
    }

    .stats {
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      text-align: center;
      font-size: 1rem;
    }

    .pause-play-button {
      margin-top: 0.5rem;
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }

    .orders-section {
      margin-bottom: 1rem;
    }

    .orders-section h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .orders-list {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .order-card {
      min-width: 180px;
      padding: 0.8rem;
    }

    .pizza-section {
      margin-bottom: 1rem;
    }

    .pizza-section h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .current-pizza {
      padding: 1rem;
      min-height: 80px;
    }

    .ingredients-section h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .ingredients-grid {
      grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .ingredient-button {
      padding: 0.8rem 0.5rem;
    }

    .ingredient-emoji {
      font-size: 1.5rem;
    }

    .ingredient-name {
      font-size: 0.8rem;
    }

    .pizza-actions {
      flex-direction: column;
      gap: 0.5rem;
    }

    .serve-button, .clear-button {
      padding: 0.7rem 1.2rem;
      font-size: 0.9rem;
    }

    .game-over-content, .pause-content {
      margin: 1rem;
      padding: 2rem 1.5rem;
    }

    .name-input-content {
      max-width: 90%;
    }

    .name-input-section h3 {
      font-size: 1.1rem;
    }

    .name-input {
      font-size: 1rem;
      padding: 0.8rem;
    }

    .name-input-buttons {
      flex-direction: column;
      gap: 0.5rem;
    }

    .submit-score-button, .skip-button {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
      min-width: auto;
    }

    .game-over-content h2, .pause-content h2 {
      font-size: 2rem;
    }

    .instructions {
      max-width: 90%;
      padding: 1.5rem;
    }

    /* Ensure overlays are properly positioned on mobile */
    .game-over-overlay, .pause-overlay {
      padding: 1rem;
      box-sizing: border-box;
    }
  }

  /* Extra small screens */
  @media (max-width: 480px) {
    .game-container {
      padding: 0.25rem;
    }

    .start-screen h1 {
      font-size: 1.8rem;
    }

    .stats {
      padding: 0.8rem;
    }

    .orders-section, .pizza-section, .ingredients-section {
      margin-bottom: 0.8rem;
    }

    .ingredients-grid {
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    }

    .ingredient-button {
      padding: 0.6rem 0.3rem;
    }

    .order-card {
      min-width: 160px;
      padding: 0.6rem;
    }
  }

  /* Name Input Overlay */
  .name-input-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .name-input-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 3rem;
    text-align: center;
    color: white;
    max-width: 400px;
    width: 90%;
  }

  .name-input-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #ffd700;
  }

  .name-input-content p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .name-input-section {
    margin: 2rem 0;
  }

  .name-input-section h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #ffd700;
  }

  .name-input {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    font-family: inherit;
    text-align: center;
    transition: all 0.3s ease;
  }

  .name-input:focus {
    outline: none;
    border-color: #3498db;
    background: rgba(255, 255, 255, 0.15);
  }

  .name-input.error {
    border-color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
  }

  .name-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .name-input-actions {
    margin-top: 2.5rem;
  }

  .error-message {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    text-align: center;
  }

  .name-input-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .submit-score-button {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    font-weight: bold;
    min-width: 150px;
  }

  .submit-score-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
  }

  .submit-score-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .skip-button {
    background: linear-gradient(45deg, #95a5a6, #7f8c8d);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    font-weight: bold;
    min-width: 100px;
  }

  .skip-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(149, 165, 166, 0.4);
  }

  .skip-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .loading-spinner {
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid #3498db;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    animation: spin 0.6s linear infinite;
    display: inline-block;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>