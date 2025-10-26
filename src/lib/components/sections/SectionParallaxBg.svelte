<script lang="ts">
	// EFFECT: Parallax background that moves slower than scroll
	// SPEED: Negative values create cinematic depth (-3 recommended)
	export let image = '/images/demo-bg.jpg';
	export let height = '120vh';
	export let heading = 'Parallax Background';
	export let speed = -2;
</script>

<section
	data-scroll-section
	style="position: relative; min-height: {height}; display: grid; place-items: center; overflow: hidden;"
>
	<!-- Parallax background -->
	<div
		class="parallax-bg gpu"
		data-scroll
		data-scroll-speed={speed}
		style="background-image: url('{image}'); background-color: #1a1a2e;"
		aria-hidden="true"
	/>

	<div style="position: relative; z-index: 1; text-align: center; padding-inline: 2rem;">
		<h2 data-scroll class="reveal-up" style="color: white; text-shadow: 0 6px 24px rgba(0,0,0,.7);">
			{heading}
		</h2>
		<p data-scroll class="reveal-fade" style="color: white; margin-top: 1rem;">
			Background moves at {speed} speed for depth effect
		</p>
	</div>
</section>
