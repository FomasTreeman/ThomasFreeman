<script lang="ts">
	let scrollY: number;
	let innerHeight: number;
	let scroll: number;

	$: scroll = scrollY / innerHeight;
</script>

<img
	class="globe"
	loading="eager"
	src="globe.svg"
	alt="Menu - globe"
	style="animation-delay: calc({scroll} * -1s);"
/>

<svelte:window bind:scrollY bind:innerHeight />

<style>
	.globe {
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
		border-radius: 50%;
		animation: rotate 1s linear infinite;
		animation-play-state: paused;
	}
</style>
