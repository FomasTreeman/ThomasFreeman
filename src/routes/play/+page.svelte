<script lang="ts">
	import { onMount } from 'svelte';
	import { gameActive } from '$lib/stores';
	import GameModal from '$lib/GameModal.svelte';

	interface Order {
		id: number;
		ingredients: string[];
		timeLeft: number;
		originalTime: number; // Store the original time for progress bar calculation
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
		isSubmittingScore: false,
		scoreSubmitted: false
	};

	let playerName = '';
	let nameInputError = '';

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
		// Simple recipes (3 ingredients)
		['dough', 'sauce', 'cheese'],

		// Medium recipes (4 ingredients)
		['dough', 'sauce', 'cheese', 'pepperoni'],
		['dough', 'sauce', 'cheese', 'mushrooms'],
		['dough', 'sauce', 'cheese', 'olives'],
		['dough', 'sauce', 'cheese', 'peppers'],

		// Complex recipes (5 ingredients)
		['dough', 'sauce', 'cheese', 'pepperoni', 'mushrooms'],
		['dough', 'sauce', 'cheese', 'pepperoni', 'olives'],
		['dough', 'sauce', 'cheese', 'mushrooms', 'peppers'],
		['dough', 'sauce', 'cheese', 'olives', 'peppers'],

		// Very complex recipes (6+ ingredients)
		['dough', 'sauce', 'cheese', 'pepperoni', 'mushrooms', 'olives'],
		['dough', 'sauce', 'cheese', 'pepperoni', 'mushrooms', 'peppers'],
		['dough', 'sauce', 'cheese', 'mushrooms', 'olives', 'peppers'],
		['dough', 'sauce', 'cheese', 'pepperoni', 'olives', 'peppers']
	];

	let orderIdCounter = 1;
	let gameInterval: ReturnType<typeof setInterval>;
	let orderInterval: ReturnType<typeof setInterval>;
	let elapsedTime = 0;
	let audioContext: AudioContext | null = null;
	let celebrationEffect = false;
	let exitClicked = false;

	function startGame() {
		playSound('success');
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

		elapsedTime = 0;
		gameActive.set(true);

		// Generate initial order
		generateOrder();

		// Start game loop
		gameInterval = setInterval(() => {
			updateGame();
		}, 100);

		// Start with initial order generation interval
		startOrderGeneration();
	}

	function startOrderGeneration() {
		// Clear existing interval if any
		if (orderInterval) {
			clearInterval(orderInterval);
		}

		// Calculate dynamic spawn rate based on elapsed time and level
		const baseInterval = 8000; // 8 seconds base
		const timeReduction = Math.min(elapsedTime * 10, 4000); // Reduce by up to 4 seconds over time
		const levelReduction = (gameState.level - 1) * 300; // Additional reduction per level
		const minInterval = 2500; // Minimum 2.5 seconds between orders (cap for maximum difficulty)

		const currentInterval = Math.max(minInterval, baseInterval - timeReduction - levelReduction);

		orderInterval = setInterval(() => {
			if (!gameState.gameRunning || gameState.isPaused) return;
			if (gameState.activeOrders.length < 3) {
				generateOrder();
			}
			// Restart with updated interval for continuous difficulty scaling
			startOrderGeneration();
		}, currentInterval);
	}

	function generateOrder(): void {
		// Don't generate orders if game is not running or paused
		if (!gameState.gameRunning || gameState.isPaused) return;

		// Progressive difficulty: simpler recipes early, more complex ones later
		let availableTemplates = ORDER_TEMPLATES;

		// Filter templates based on game progression
		if (gameState.level < 2 && elapsedTime < 30) {
			// Early game: only simple and medium recipes
			availableTemplates = ORDER_TEMPLATES.filter((template) => template.length <= 4);
		} else if (gameState.level < 4 && elapsedTime < 60) {
			// Mid game: simple to complex recipes
			availableTemplates = ORDER_TEMPLATES.filter((template) => template.length <= 5);
		}
		// Late game: all recipes available

		const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

		// Variable completion time based on recipe complexity
		const baseTime = 20; // Base time for simple recipes
		const ingredientCount = template.length;
		const complexityBonus = (ingredientCount - 3) * 4; // Extra time for each ingredient beyond basic 3
		const randomVariation = Math.random() * 10; // 0-10 seconds random variation
		const levelAdjustment = Math.max(0, 3 - gameState.level * 0.3); // Slightly less time at higher levels

		const totalTime = baseTime + complexityBonus + randomVariation + levelAdjustment;
		const finalTime = Math.max(10, Math.min(40, totalTime)); // Minimum 10 seconds, maximum 40 seconds

		const order: Order = {
			id: orderIdCounter++,
			ingredients: [...template],
			timeLeft: finalTime,
			originalTime: finalTime, // Store the original time for progress bar
			completed: false
		};

		gameState = {
			...gameState,
			activeOrders: [...gameState.activeOrders, order]
		};
	}

	function updateGame(): void {
		if (!gameState.gameRunning || gameState.isPaused) return;

		// Track elapsed time for difficulty scaling (increment by 0.1 seconds)
		elapsedTime += 0.1;

		// Update order timers
		let livesLost = 0;
		const updatedOrders = gameState.activeOrders
			.map((order) => {
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
			})
			.filter(Boolean) as Order[];

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

	function playSound(type: 'success' | 'error' | 'click' | 'gameOver') {
		try {
			// Create audio context once and reuse it
			if (!audioContext) {
				audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			}

			// Resume audio context if it's suspended (required by browser policies)
			if (audioContext.state === 'suspended') {
				audioContext.resume();
			}

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
				case 'gameOver':
					// Dramatic descending sequence
					oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
					oscillator.frequency.setValueAtTime(392, audioContext.currentTime + 0.2); // G4
					oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.4); // F4
					oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime + 0.6); // D4
					break;
			}

			oscillator.type = 'sine';
			gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

			// Different durations for different sound types
			const duration = type === 'gameOver' ? 0.8 : 0.3;
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + duration);
		} catch (error) {
			// Silently fail if audio context creation fails
			console.warn('Audio not available:', error);
		}
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
		if (
			!gameState.gameRunning ||
			gameState.isPaused ||
			gameState.currentPizza.ingredients.length === 0
		)
			return;

		// Check if current pizza matches any active order
		const matchingOrder = gameState.activeOrders.find(
			(order) =>
				!order.completed &&
				arraysEqual([...order.ingredients].sort(), [...gameState.currentPizza.ingredients].sort())
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
					activeOrders: gameState.activeOrders.filter((order) => order.id !== matchingOrder.id)
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
		playSound('click');
		gameState = {
			...gameState,
			currentPizza: { ingredients: [] }
		};
	}

	function arraysEqual(a: string[], b: string[]): boolean {
		return a.length === b.length && a.every((val) => b.includes(val));
	}

	function endGame(): void {
		playSound('gameOver');
		gameState = {
			...gameState,
			gameRunning: false,
			isPaused: false,
			showNameInput: true
		};
		clearInterval(gameInterval);
		clearInterval(orderInterval);
	}

	async function submitScore() {
		if (!playerName.trim()) {
			playSound('error');
			nameInputError = 'Please enter your name';
			return;
		}

		if (playerName.trim().length < 2) {
			playSound('error');
			nameInputError = 'Name must be at least 2 characters';
			return;
		}

		gameState = { ...gameState, isSubmittingScore: true };
		nameInputError = '';

		try {
			const response = await fetch('/api/leaderboard', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: playerName.trim(),
					score: gameState.score,
					level: gameState.level
				})
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					gameState = {
						...gameState,
						showNameInput: false,
						isSubmittingScore: false,
						scoreSubmitted: true
					};
					playSound('success');
				} else {
					nameInputError = result.error || 'Failed to submit score. Please try again.';
					gameState = { ...gameState, isSubmittingScore: false };
				}
			} else {
				const errorData = await response.json().catch(() => ({}));
				nameInputError = errorData.error || 'Failed to submit score. Please try again.';
				gameState = { ...gameState, isSubmittingScore: false };
			}
		} catch (error) {
			nameInputError = 'Failed to submit score. Please try again.';
			gameState = { ...gameState, isSubmittingScore: false };
		}
	}

	function resetGame(): void {
		playSound('click');
		gameState = {
			...gameState,
			gameStarted: false,
			gameRunning: false,
			isPaused: false,
			showNameInput: false,
			isSubmittingScore: false,
			scoreSubmitted: false,
			score: 0,
			lives: 3,
			level: 1,
			combo: 0,
			activeOrders: [],
			currentPizza: { ingredients: [] }
		};
		playerName = '';
		nameInputError = '';
		elapsedTime = 0; // Reset elapsed time
		celebrationEffect = false;
		exitClicked = false;
		gameActive.set(false); // Show the navigation again
		clearInterval(gameInterval);
		clearInterval(orderInterval);
	}

	function getIngredientEmoji(name: string): string {
		return INGREDIENTS.find((ing) => ing.name === name)?.emoji || '❓';
	}

	function pauseGame(): void {
		if (!gameState.gameRunning) return;
		gameState = { ...gameState, isPaused: true };
		playSound('click');
	}

	function resumeGame(): void {
		if (!gameState.gameRunning) return;
		gameState = { ...gameState, isPaused: false };
		exitClicked = false;
		playSound('click');
	}

	function showExitModal() {
		pauseGame();
		playSound('click');
		exitClicked = true;
	}

	function saveAndExit(): void {
		playSound('success');
		exitClicked = false;
		// Don't actually end the game - just show name input while keeping game state intact
		gameState = { ...gameState, showNameInput: true, isPaused: true };
	}

	function skipLeaderboard(): void {
		playSound('click');
		if (gameState.lives > 0) {
			// Player still has lives - go back to exit modal
			gameState = {
				...gameState,
				showNameInput: false,
				isPaused: true
			};
			exitClicked = true; // Show the exit modal again
		} else {
			// Player has no lives left, game is truly over
			resetGame();
		}
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
			gameActive.set(false); // Ensure navigation is shown when leaving the page
			clearInterval(gameInterval);
			clearInterval(orderInterval);
			// Clean up audio context
			if (audioContext) {
				audioContext.close();
				audioContext = null;
			}
		};
	});
</script>

<div class="game-container">
	{#if !gameState.gameStarted}
		<!-- Start Screen -->
		<div class="start-screen">
			<h1><span class="pizza-icon">🍕</span> Pizza Rush! <span class="pizza-icon">🍕</span></h1>
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
			<div class="game-content">
				<div class="stats">
					<div class="stat-item">
						<p class="stat-item_header">Score:</p>
						<p class="stat-item_value">{gameState.score}</p>
					</div>
					<div class="stat-item">
						<p class="stat-item_header">Lives:</p>
						<p class="stat-item_value">{'❤️'.repeat(gameState.lives)}</p>
					</div>
					<div class="stat-item">
						<p class="stat-item_header">Level:</p>
						<p class="stat-item_value">{gameState.level}</p>
					</div>
					<div class="stat-item">
						<p class="stat-item_header">Combo:</p>
						<p class="stat-item_value">{gameState.combo > 0 ? `🔥 ${gameState.combo}` : '0'}</p>
					</div>
					<!-- <div class="stat-item status-xindicator" class:paused={gameState.isPaused}>
						Status: <span class="status-text">{gameStatusText}</span>
					</div> -->
					<div class="stat-item">
						{#if gameState.isPaused}
							<button on:click={resumeGame} class="pause-play-button play"> ▶️ Resume </button>
						{:else}
							<button on:click={pauseGame} class="pause-play-button pause"> ⏸️ Pause </button>
						{/if}
					</div>
					<div class="stat-item">
						<button on:click={showExitModal} class="pause-play-button quit">🏠 Quit</button>
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
											style="width: {Math.max(0, (order.timeLeft / order.originalTime) * 100)}%"
										/>
									</div>
									<span class="timer-text">{Math.ceil(order.timeLeft)}s</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Bottom Sticky Section -->
			<div class="bottom-section">
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
						<button
							on:click={servePizza}
							class="serve-button"
							disabled={gameState.currentPizza.ingredients.length === 0}
						>
							Serve Pizza
						</button>
						<button
							on:click={clearPizza}
							class="clear-button"
							disabled={gameState.currentPizza.ingredients.length === 0}
						>
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
			</div>

			<!-- Exit Confirmation Modal -->
			{#if exitClicked}
				<GameModal show={exitClicked} title="🚪 Exit Game?" titleColor="#e74c3c" maxWidth="400px">
					<p>Are you sure you want to exit the game?</p>
					<div class="exit-actions">
						<button on:click={saveAndExit} class="exit-confirm-button">Yes, Save and Exit</button>
						<button on:click={resetGame} class="exit-confirm-button"
							>Yes, Exit Without Saving</button
						>
						<button on:click={resumeGame} class="exit-cancel-button">No, Stay</button>
					</div>
				</GameModal>
			{/if}

			<!-- Leaderboard Submission -->
			<GameModal
				show={gameState.showNameInput}
				title="🏆 Game Over!"
				titleColor="#ffd700"
				maxWidth="500px"
			>
				<p>Final Score: <strong>{gameState.score}</strong></p>
				<p>Level Reached: <strong>{gameState.level}</strong></p>

				<h3>Enter your name:</h3>
				<input type="text" bind:value={playerName} placeholder="Your Name" class="name-input" />
				{#if nameInputError}
					<div class="error-message">{nameInputError}</div>
				{/if}
				<div class="name-input-actions">
					<button on:click={skipLeaderboard} class="skip-button"> Skip </button>
					<button
						on:click={submitScore}
						class="submit-button"
						disabled={gameState.isSubmittingScore}
					>
						{#if gameState.isSubmittingScore}
							<span class="loading-spinner" /> Submitting...
						{:else}
							Submit Score
						{/if}
					</button>
				</div>
			</GameModal>

			<!-- Score Submitted Success -->
			<GameModal
				show={gameState.scoreSubmitted}
				title="🎉 Score Submitted!"
				titleColor="#2ecc71"
				maxWidth="500px"
			>
				<div class="success-actions">
					<a href="/leaderboard" class="leaderboard-button">🏆 View Leaderboard</a>
					<button on:click={resetGame} class="restart-button">Play Again</button>
					<button on:click={resetGame} class="quit-button">🏠 Back to Menu</button>
				</div>
			</GameModal>

			<!-- Celebration Effect -->
			{#if celebrationEffect}
				<div class="celebration-effect">
					<div class="confetti" />
					<div class="confetti" />
					<div class="confetti" />
					<div class="confetti" />
					<div class="confetti" />
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.game-container {
		min-height: 100vh;
		min-height: 100dvh; /* Dynamic viewport height for mobile */
		background: var(--background-color);
		font-family: 'JetBrains Mono Variable', monospace;
		color: var(--color);
		position: relative;
		overflow: hidden;
		width: 100%;
	}

	/* Animated background gradient */
	.game-container::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		height: 100dvh; /* Dynamic viewport height for mobile */
		background: radial-gradient(circle at 20% 50%, rgba(255, 138, 0, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(0, 121, 255, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 40% 80%, rgba(249, 220, 0, 0.05) 0%, transparent 50%);
		animation: backgroundShift 20s ease-in-out infinite;
		z-index: 0;
		scale: 1.1;
	}

	@keyframes backgroundShift {
		0%,
		100% {
			transform: translateX(0) translateY(0);
		}
		33% {
			transform: translateX(-20px) translateY(-10px);
		}
		66% {
			transform: translateX(10px) translateY(-20px);
		}
	}

	/* Start Screen */
	.start-screen {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 80vh;
		text-align: center;
		padding: 2rem;
	}

	.start-screen h1 {
		font-size: 3.5rem;
		font-weight: 800;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, var(--primary-color1), var(--primary-color2));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-shadow: none;
	}

	.start-screen .pizza-icon {
		-webkit-text-fill-color: white;
	}

	.start-screen p {
		font-size: 1.3rem;
		margin-bottom: 2rem;
		opacity: 0.9;
		font-family: 'Work Sans', sans-serif;
	}

	.start-buttons {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 3rem;
		align-items: center;
	}

	.start-button {
		background: linear-gradient(135deg, var(--primary-color1), var(--primary-color2));
		color: var(--background-color);
		border: none;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		border-radius: 12px;
		cursor: pointer;
		font-family: 'JetBrains Mono Variable', monospace;
		font-weight: bold;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.start-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s;
	}

	.start-button:hover::before {
		left: 100%;
	}

	.start-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 138, 0, 0.4);
	}

	.leaderboard-link {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		color: var(--color);
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 1rem 2rem;
		font-size: 1.1rem;
		border-radius: 12px;
		text-decoration: none;
		font-family: 'JetBrains Mono Variable', monospace;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	.leaderboard-link:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: var(--secondary-color1);
		box-shadow: 0 4px 15px rgba(0, 121, 255, 0.3);
		transform: translateY(-2px);
	}

	.instructions {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.instructions h3 {
		color: var(--primary-color1);
		margin-bottom: 1rem;
		font-size: 1.3rem;
	}

	.instructions ul {
		text-align: left;
		line-height: 1.8;
		font-family: 'Work Sans', sans-serif;
	}

	.instructions li {
		margin-bottom: 0.5rem;
		opacity: 0.9;
	}

	/* Game UI */
	.game-ui {
		max-width: 1200px;
		margin: 0 auto;
		color: white;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.game-content {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		padding-bottom: 0;
	}

	.bottom-section {
		position: sticky;
		bottom: 0;
		background: rgba(36, 36, 36, 0.95);
		backdrop-filter: blur(20px);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		z-index: 10;
		border-radius: 16px 16px 0 0;
		box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
		padding: 2.5rem;
		padding-top: 1rem;
	}

	@media (max-width: 768px) {
		.game-ui {
			margin: 0 auto;
		}
	}

	.stats {
		display: flex;
		justify-content: space-around;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 1rem;
		margin-bottom: 2rem;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 1.2rem;
		font-weight: bold;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
		100% {
			opacity: 1;
		}
	}

	/* Orders Section */
	.orders-section {
		margin-bottom: 2rem;
	}

	.orders-section h3 {
		text-align: center;
		margin-bottom: 1rem;
		color: var(--primary-color1);
		font-size: 1.5rem;
	}

	.orders-list {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.order-card {
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		padding: 1rem;
		min-width: 200px;
		transition: all 0.3s ease;
	}

	.order-card:hover {
		background: rgba(255, 255, 255, 0.12);
		border-color: var(--secondary-color1);
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(0, 121, 255, 0.2);
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
		background: linear-gradient(
			90deg,
			var(--primary-color1),
			var(--primary-color2),
			var(--secondary-color1)
		);
		transition: width 0.1s linear;
	}

	.timer-text {
		font-size: 0.9rem;
		font-weight: bold;
	}

	/* Pizza Section */
	.pizza-section {
		margin-bottom: 1rem;
	}

	.pizza-section h3 {
		text-align: center;
		margin-bottom: 1rem;
		color: var(--primary-color1);
		font-size: 1.5rem;
	}

	.bottom-section .pizza-section h3 {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	.current-pizza {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(255, 255, 255, 0.1);
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
		transition: all 0.3s ease;
	}

	.current-pizza:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.bottom-section .current-pizza {
		padding: 1rem;
		min-height: 60px;
		margin-bottom: 0.5rem;
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

	.serve-button,
	.clear-button {
		padding: 0.8rem 1.5rem;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-family: 'JetBrains Mono Variable', monospace;
		font-weight: bold;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.serve-button {
		background: linear-gradient(135deg, var(--secondary-color1), var(--secondary-color2));
		color: white;
	}

	.serve-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 121, 255, 0.4);
	}

	.clear-button {
		background: linear-gradient(135deg, #e74c3c, #c0392b);
		color: white;
	}

	.clear-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
	}

	.serve-button:disabled,
	.clear-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Ingredients Section */
	.ingredients-section h3 {
		text-align: center;
		margin-bottom: 1rem;
		color: var(--primary-color1);
		font-size: 1.5rem;
	}

	.bottom-section .ingredients-section h3 {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	.ingredients-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.bottom-section .ingredients-grid {
		gap: 0.5rem;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	}

	.ingredient-button {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		color: var(--color);
		font-family: 'JetBrains Mono Variable', monospace;
	}

	.ingredient-button:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--primary-color1);
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(255, 138, 0, 0.3);
	}

	.ingredient-button.added {
		background: linear-gradient(135deg, var(--primary-color1), var(--primary-color2));
		border-color: var(--primary-color1);
		color: var(--background-color);
		box-shadow: 0 4px 15px rgba(255, 138, 0, 0.4);
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

	/* Game Over and Pause overlays now use GameModal component */

	.restart-button {
		background: linear-gradient(135deg, var(--secondary-color1), var(--secondary-color2));
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.1rem;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: 'JetBrains Mono Variable', monospace;
		font-weight: bold;
		margin-top: 1rem;
	}

	.restart-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 121, 255, 0.4);
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
		0% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(100vh) scale(1.2);
		}
		100% {
			transform: translateY(200vh) scale(1);
		}
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
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
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

	.exit-actions {
		display: flex;
		justify-content: center;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}
	.name-input {
		box-sizing: border-box;
	}

	/* Pause/Play Button */
	.pause-play-button {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 0.9rem;
		font-weight: bold;
		transition: all 0.3s ease;
		color: var(--color);
	}

	.pause-play-button.pause {
		border-color: var(--primary-color1);
	}

	.pause-play-button.play {
		border-color: var(--secondary-color1);
	}

	.pause-play-button.quit {
		border-color: rgba(255, 3, 3, 0.3);
	}

	.pause-play-button:hover {
		transform: translateY(-1px);
		background: rgba(255, 255, 255, 0.1);
	}

	.pause-play-button.pause:hover {
		box-shadow: 0 4px 15px rgba(255, 138, 0, 0.3);
	}

	.pause-play-button.play:hover {
		box-shadow: 0 4px 15px rgba(0, 121, 255, 0.3);
	}

	.pause-play-button.quit:hover {
		box-shadow: 0 4px 15px rgba(251, 87, 6, 0.3);
	}

	.quit-button {
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
		margin: 0.5rem;
		min-width: 150px;
	}

	.quit-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(149, 165, 166, 0.4);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.game-container {
			min-height: auto;
			overflow-y: visible;
		}

		.start-screen {
			min-height: 100vh;
			padding-inline: 1rem;
			padding-top: 0;
			padding-bottom: 5rem;
			box-sizing: border-box;
		}

		.start-screen h1 {
			font-size: 2rem;
		}

		.start-buttons {
			flex-direction: column;
			gap: 0.8rem;
		}

		.start-button,
		.leaderboard-link {
			padding: 0.8rem 1.5rem;
			font-size: 1rem;
		}

		.game-ui {
			height: 100vh;
			max-height: 100vh;
			overflow: hidden;
		}

		.game-content {
			padding: 0.3rem;
			flex: 1;
			overflow-y: auto;
			max-height: calc(100vh - 200px); /* Reserve space for bottom section */
		}

		.bottom-section {
			padding: 0.5rem;
		}

		.stats {
			flex-direction: row;
			flex-wrap: wrap;
			gap: 0.3rem;
			margin-bottom: 0.5rem;
			padding: 0.5rem;
			font-size: 0.8rem;
		}

		.stat-item {
			text-align: center;
			font-size: 0.8rem;
			flex: 1;
			gap: 0;
			padding: 0.2rem;
			flex-direction: column;
			justify-content: center;
			align-items: start;
		}

		.stat-item * {
			margin: 0;
			padding: 0;
		}

		.stat-item_value {
			margin-left: 0.1rem;
		}

		.pause-play-button {
			margin-top: 0.2rem;
			padding: 0.3rem 0.6rem;
			font-size: 0.7rem;
		}

		.orders-section {
			margin-bottom: 0.5rem;
		}

		.orders-section h3 {
			font-size: 1rem;
			margin-bottom: 0.3rem;
		}

		.orders-list {
			flex-direction: column;
			align-items: center;
			gap: 0.3rem;
		}

		.order-card {
			min-width: 90%;
			max-width: 100%;
			padding: 0.6rem;
			font-size: 0.9rem;
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

		.bottom-section .ingredients-grid {
			grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
			gap: 0.3rem;
			margin-bottom: 0;
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

		.serve-button,
		.clear-button {
			padding: 0.7rem 1.2rem;
			font-size: 0.9rem;
		}

		/* Form input styling for mobile */
		.name-input {
			font-size: 1rem;
			padding: 0.8rem;
		}

		.submit-button {
			background: rgb(0 255 15 / 33%);
			padding: 1rem 2rem;
			font-size: 1rem;
			min-width: 150px;
			margin-left: 0.75rem;
		}

		.skip-button {
			padding: 0.7rem 1.2rem;
			font-size: 0.9rem;
			min-width: 70px;
		}

		.instructions {
			max-width: 90%;
			padding: 1.5rem;
		}

		/* GameModal component handles overlay positioning */
	}

	/* Ultra-compact mobile layout for small screens */
	@media (max-width: 480px) {
		.stats {
			padding: 0.3rem;
			margin-bottom: 0.3rem;
			border-radius: 8px;
		}

		.stat-item {
			font-size: 0.7rem;
			padding: 0.1rem;
		}

		.orders-section h3 {
			font-size: 0.9rem;
			margin-bottom: 0.2rem;
		}

		.order-card {
			padding: 0.4rem;
			font-size: 0.8rem;
			border-radius: 8px;
		}

		.ingredient-icon {
			font-size: 1.2rem;
		}

		.timer-text {
			font-size: 0.7rem;
		}

		.game-content {
			max-height: calc(100vh - 180px);
		}

		.bottom-section {
			padding: 0.3rem;
		}

		.bottom-section .pizza-section h3,
		.bottom-section .ingredients-section h3 {
			font-size: 1rem;
			margin-bottom: 0.3rem;
		}
	}

	/* Form styles for name input (now used within GameModal) */

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

	.skip-button {
		color: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 0.8rem 1.5rem;
		font-size: 0.9rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: inherit;
		font-weight: normal;
		min-width: 80px;
		backdrop-filter: blur(5px);
	}

	.skip-button:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.9);
		border-color: rgba(255, 255, 255, 0.3);
		transform: translateY(-1px);
	}

	.skip-button:disabled {
		opacity: 0.4;
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
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.success-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2rem;
		align-items: center;
	}

	.success-actions .leaderboard-button {
		background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
		color: #2c3e50;
		border: none;
		padding: 1rem 2rem;
		font-size: 1rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: inherit;
		font-weight: bold;
		text-decoration: none;
		display: inline-block;
		text-align: center;
	}

	.success-actions .leaderboard-button:hover {
		background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
	}

	.success-actions .restart-button,
	.success-actions .quit-button {
		margin: 0;
	}

	@media (min-width: 768px) {
		.success-actions {
			flex-direction: row;
			justify-content: center;
		}
	}
</style>
