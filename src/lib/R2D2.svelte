<script>
	import * as SC from 'svelte-cubed';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { onMount } from 'svelte';

	let model = null;
	// let spin = 0;
	let x = -30;

	function loadGLTF() {
		const loader = new GLTFLoader();
		return loader.loadAsync('r2d2.glb');
	}

	onMount(() => {
		loadGLTF().then((_model) => {
			console.log(_model);
			model = _model;
		});
	});

	SC.onFrame(() => {
		// spin += 0.01;
		x >= 30 ? (x = -30) : (x += 0.09);
	});
</script>

{#if model}
	<SC.Primitive
		object={model.scene}
		scale={[10, 10, 10]}
		position={[x, 0, 0]}
		rotation={[0, 1.5, 0]}
	/>
{/if}
