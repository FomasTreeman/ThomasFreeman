<script lang="ts">
	import { onMount } from 'svelte';
	import { createScene } from './utils/scene';
	import { r2d2Loaded } from './stores';
	import { SyncLoader } from 'svelte-loading-spinners';

	let el: HTMLElement;
	let innerHeight: number;

	let loaded = false;

	r2d2Loaded.subscribe((value) => {
		loaded = value;
	});
	$: console.log(loaded);
	onMount(() => {
		const windowHeight = window.innerHeight;
		const initialWidth = windowHeight * 0.7;
		createScene(el, initialWidth, windowHeight);
	});
</script>

{#if !loaded}
	<div class="center">
		<SyncLoader size="60" color="#FFFF" unit="px" duration="1s" />
	</div>
{/if}
<canvas bind:this={el} />
<svelte:window bind:innerHeight on:resize={() => createScene(el, innerHeight * 0.7, innerHeight)} />

<style>
	.center {
		position: absolute;
		width: 100%;
		display: flex;
		justify-content: center;
		margin-block: 2rem;
	}
</style>
