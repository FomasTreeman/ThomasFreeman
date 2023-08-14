<script>
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import R2D2 from './R2D2.svelte';
</script>

<div role="img">
	<SC.Canvas antialias alpha={true}>
		<SC.PerspectiveCamera position={[0, 20, 30]} near={0.1} far={500} fov={40} />

		<SC.OrbitControls
			enabled={true}
			enableZoom={false}
			autoRotate={false}
			autoRotateSpeed={1}
			target={[0, 0, 0]}
		/>

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
