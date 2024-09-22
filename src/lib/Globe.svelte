<script lang="ts">
	export let showPrompt: boolean;
	let scrollY: number;
	let innerHeight: number;
	let scroll: number;

	$: scroll = scrollY / innerHeight;
</script>

<div class="globe-shape" class:animate={showPrompt}>
	<img
		class="globe globe-shape"
		loading="eager"
		src="globe.webp"
		alt="Menu - globe"
		style="animation-delay: calc({scroll} * -1s);"
	/>
</div>

<svelte:window bind:scrollY bind:innerHeight />

<style>
	.globe-shape {
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
		border-radius: 50%;
	}
	div.animate {
		animation: pulse-animation 1.5s ease-in-out infinite, heart-pulse 3s infinite;
	}
	.globe {
		scale: 1.05;
		animation: rotate 1s linear infinite;
		animation-play-state: paused;
	}

	@keyframes heart-pulse {
		0% {
			transform: scale(1); /* scaling to 0 */
		}
		50% {
			transform: scale(1.05); /* increasing the size */
		}
		70% {
			transform: scale(0.95); /* decreasing the size */
		}
		100% {
			transform: scale(1); /* seeting back to initial size */
		}
	}
	@keyframes pulse-animation {
		0% {
			box-shadow: 0 0 1px 0px rgba(255, 255, 255, 0.3);
		}
		50% {
			box-shadow: 0 0 5px 10px rgba(255, 255, 255, 0.1);
		}
	}
</style>
