<script lang="ts">
	import * as SC from 'svelte-cubed';
	import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { onMount, createEventDispatcher } from 'svelte';

	// loading model
	let model: GLTF;

	const dispatch = createEventDispatcher();

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

	// animation
	let innerWidth = 200;

	// general variables
	const rightAngle = Math.PI / 2;
	const initialAngle = Math.PI;
	let angle = initialAngle;
	let spin = 0;
	let wobble = 0;
	let speed = 0.15;
	let x = 0;
	let z = 0;
	let y = 0;

	export let animation: 'waiting' | 'arch' | 'straight' | 'advanced';

	$: xRange = innerWidth / 20;
	$: console.log(xRange);
	$: animation === 'straight' ? (x = -xRange) : null;

	// advanced variables
	let advancedStage: 1 | 2 | 3 | 4 | 5 = 1;

	$: animation === 'advanced' ? (x = -xRange) : null;
	$: advancedStage == 3 ? setTimeout(() => (advancedStage = 4), 1500) : null;

	$: radius = innerWidth + 200; //screen width + 100;

	const next = () => {
		dispatch('next');
	};

	const reset = () => {
		angle = initialAngle;
		x = -xRange - 10;
		z = 0;
		y = 0;
		animation = 'waiting';
		setTimeout(() => next(), 200);
	};

	SC.onFrame(() => {
		switch (animation) {
			case 'waiting': {
				break;
			}
			case 'arch': {
				spin = Math.atan2(x, z) - rightAngle; //90deg;

				angle += speed / 20; // speed;

				x = Math.sqrt(radius) * Math.cos(angle);
				z = Math.sqrt(radius) * Math.sin(angle);
				if (angle >= initialAngle + Math.PI) reset();
				break;
			}
			case 'straight': {
				spin = rightAngle;
				x += 0.1;
				if (Math.floor(x) >= xRange) reset();
				break;
			}
			case 'advanced': {
				switch (advancedStage) {
					case 1: {
						spin = rightAngle;
						x += speed;
						if (x >= xRange * 0.1) advancedStage = 2;
						break;
					}
					case 2: {
						spin -= speed / 2;
						if (spin <= 0) advancedStage = 3;
						break;
					}
					case 3: {
						if (y < 1) y += speed * 2;
						angle += 0.15;
						wobble = -Math.sin(angle) * 0.15;
						x += Math.cos(angle) * 0.15;
						break;
					}
					case 4: {
						if (y > 0) y -= speed * 2;
						spin -= speed;
						if (spin <= -1.57) advancedStage = 5;
						break;
					}
					case 5: {
						x -= speed * 2.5;
						if (x <= -xRange) {
							advancedStage = 1;
							reset();
						}
						break;
					}
				}
				break;
			}
		}
	});
</script>

{#if model}
	<SC.Primitive
		object={model.scene}
		scale={[10, 10, 10]}
		position={[x, y, z]}
		rotation={[0, spin, wobble]}
	/>
{/if}

<svelte:window bind:innerWidth />
