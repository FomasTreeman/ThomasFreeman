<script lang="ts">
	import '@fontsource-variable/jetbrains-mono';
</script>

<div class="play-layout">
	<slot />
</div>

<style>
	.play-layout {
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
	.play-layout::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		height: 100dvh; /* Dynamic viewport height for mobile */
		background:
			radial-gradient(circle at 20% 50%, rgba(255, 138, 0, 0.1) 0%, transparent 50%),
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

	:global(body) {
		overflow-x: hidden;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		:global(body) {
			overflow: auto;
		}
	}
</style>
