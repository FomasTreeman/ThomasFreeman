<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import R2D2 from './R2D2.svelte';

	// const combos = [
	// 	[25, 20, 50],
	// 	[-25, 20, 50],
	// 	[0, 15, -30],
	// 	[15, 15, 15],
	// 	[0, 15, 30]
	// ];

	const animations = ['arch', 'straight', 'advanced'] as const;

	let animationCount = 1;
	let position = [0, 20, 40];
	let animation: (typeof animations)[number] = animations[0];

	function onNext() {
		animation = animations[animationCount];
		position = [0, 20, 40];
		animationCount < animations.length - 1 ? animationCount++ : (animationCount = 0);
	}
</script>

<!-- fun zs:: 1, -1, -->

<div role="img">
	<SC.Canvas antialias alpha={true}>
		<SC.PerspectiveCamera {position} near={0.1} far={200} fov={40} />

		<!-- <SC.OrbitControls
			enabled={true}
			enableZoom={false}
			autoRotate={false}
			autoRotateSpeed={1}
			target={[0, 0, 0]}
		/> -->

		<SC.DirectionalLight
			color={new THREE.Color(0xffffff)}
			position={[0, 10, 10]}
			intensity={0.75}
			shadow={false}
		/>
		<SC.AmbientLight color={new THREE.Color(0xffffff)} intensity={0.75} />

		<R2D2 {animation} on:next={onNext} />
	</SC.Canvas>
</div>
