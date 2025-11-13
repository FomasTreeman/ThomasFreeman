<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import R2D2 from './R2D2.svelte';

	let position = [0, 20, 40];
	let innerWidth = 1920; // Default to desktop width

	// Responsive FOV - wider on smaller screens for better view
	$: fov =
		innerWidth < 768
			? 55 // Mobile: wider FOV
			: innerWidth < 1024
				? 50 // Tablet: medium FOV
				: 40; // Desktop: default FOV
</script>

<!-- fun zs:: 1, -1, -->

<div role="img">
	<SC.Canvas antialias alpha={true}>
		<SC.PerspectiveCamera {position} near={0.1} far={200} {fov} />

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

		<R2D2 />
	</SC.Canvas>
</div>

<svelte:window bind:innerWidth />
