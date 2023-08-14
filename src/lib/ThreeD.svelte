<script lang="ts">
	import { onMount } from 'svelte';
	import { createScene } from './utils/scene';

	let el: HTMLElement;
	let innerHeight: number;

	onMount(() => {
		const windowHeight = window.innerHeight;
		const initialWidth = windowHeight * 0.7;
		createScene(el, initialWidth, windowHeight);
	});
</script>

<canvas bind:this={el} />
<svelte:window bind:innerHeight on:resize={() => createScene(el, innerHeight * 0.7, innerHeight)} />
