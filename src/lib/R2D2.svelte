<script lang="ts">
	import * as SC from 'svelte-cubed';
	import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { onMount } from 'svelte';

	// loading model
	let model: GLTF;

	function loadGLTF() {
		const loader = new GLTFLoader();
		return loader.loadAsync('r2d2.glb');
	}

	onMount(() => {
		loadGLTF().then((_model) => {
			model = _model;
		});
	});

	// Mouse tracking
	let innerWidth = 1920; // Default to desktop width
	let innerHeight = 1080; // Default height
	let mouseX = 0;
	let mouseY = 0;

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}

	// R2D2 position and movement
	let x = -35; // Start on the left with margin
	let y = 0; // Keep R2D2 on a fixed plane (ground level)
	let z = -42; // Start at the top with margin
	let spin = Math.atan2(1, 1); // Start facing bottom-right (45 degrees)
	let initialPositionSet = false;

	// Set initial position based on viewport size (only once)
	$: if (innerWidth > 0 && !initialPositionSet) {
		if (innerWidth < 768) {
			// Mobile: center and closer
			x = -10;
			z = -30;
		} else if (innerWidth < 1024) {
			// Tablet: slightly off-center
			x = -25;
			z = -35;
		}
		initialPositionSet = true;
	}

	// Movement settings
	const maxSpeed = 0.08; // Slow top speed
	const acceleration = 0.002; // Smooth acceleration
	const deceleration = 0.95; // Smooth deceleration
	const rotationSmoothing = 0.08; // Smooth rotation interpolation (lower = smoother/slower)

	// Boundary constraints - keep R2D2 visible on screen
	const boundaryX = 45; // Max left/right distance
	const boundaryZMin = -45; // Farthest from camera (top of screen)
	const boundaryZMax = -5; // Closest to camera (bottom of screen) - much closer now!

	let velocityX = 0;
	let velocityZ = 0;

	// Convert mouse position to 3D coordinates on the plane
	function mouseToWorld() {
		// Normalize mouse position to -1 to 1 range
		const normalizedX = (mouseX / innerWidth) * 2 - 1;
		const normalizedY = (mouseY / innerHeight) * 2 - 1; // Fixed: removed negative sign

		// Map to world coordinates based on camera view
		const worldX = normalizedX * 50;
		const worldZ = normalizedY * 20 - 25; // Expanded range to allow closer approach

		// Clamp to boundaries
		const clampedX = Math.max(-boundaryX, Math.min(boundaryX, worldX));
		const clampedZ = Math.max(boundaryZMin, Math.min(boundaryZMax, worldZ));

		return { x: clampedX, z: clampedZ };
	}

	// Helper function to smoothly interpolate rotation angles
	function lerpAngle(current: number, target: number, t: number): number {
		let diff = target - current;
		// Normalize the difference to -PI to PI range for shortest rotation
		while (diff > Math.PI) diff -= Math.PI * 2;
		while (diff < -Math.PI) diff += Math.PI * 2;
		return current + diff * t;
	}

	SC.onFrame(() => {
		const target = mouseToWorld();

		// Calculate direction to target
		const dx = target.x - x;
		const dz = target.z - z;
		const distance = Math.sqrt(dx * dx + dz * dz);

		// Only move if we're not too close to the target
		if (distance > 1) {
			// Normalize direction
			const dirX = dx / distance;
			const dirZ = dz / distance;

			// Apply acceleration towards target
			velocityX += dirX * acceleration;
			velocityZ += dirZ * acceleration;

			// Limit to max speed
			const currentSpeed = Math.sqrt(velocityX * velocityX + velocityZ * velocityZ);
			if (currentSpeed > maxSpeed) {
				velocityX = (velocityX / currentSpeed) * maxSpeed;
				velocityZ = (velocityZ / currentSpeed) * maxSpeed;
			}
		} else {
			// Apply deceleration when close to target
			velocityX *= deceleration;
			velocityZ *= deceleration;
		}

		// Smoothly rotate to face movement direction
		const currentSpeed = Math.sqrt(velocityX * velocityX + velocityZ * velocityZ);
		if (currentSpeed > 0.001) {
			// Only update rotation if actually moving
			const targetRotation = Math.atan2(velocityX, velocityZ);
			spin = lerpAngle(spin, targetRotation, rotationSmoothing);
		}

		// Update position
		x += velocityX;
		z += velocityZ;

		// Clamp position to boundaries to ensure R2D2 stays on screen
		x = Math.max(-boundaryX, Math.min(boundaryX, x));
		z = Math.max(boundaryZMin, Math.min(boundaryZMax, z));

		// Stop velocity if hitting boundaries
		if (x <= -boundaryX || x >= boundaryX) {
			velocityX = 0;
		}
		if (z <= boundaryZMin || z >= boundaryZMax) {
			velocityZ = 0;
		}
	});
</script>

{#if model}
	<SC.Primitive
		object={model.scene}
		scale={[10, 10, 10]}
		position={[x, y, z]}
		rotation={[0, spin, 0]}
	/>
{/if}

<svelte:window bind:innerWidth bind:innerHeight on:mousemove={handleMouseMove} />
