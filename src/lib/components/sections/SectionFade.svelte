<script lang="ts">
	// EFFECT: Simple fade in/out based on viewport
	// USAGE: Use different bg colors to visually separate sections
	export let title = 'Fade Section';
	export let bg = '#0b0b0b';
</script>

<section data-scroll-section style="padding: 12rem 0; background: {bg};">
	<div style="max-width: 64rem; margin: 0 auto; text-align: center; padding-inline: 2rem;">
		<h2 data-scroll class="reveal-fade">{title}</h2>
		<p data-scroll class="reveal-fade" style="transition-delay: 120ms;">
			This section fades in smoothly as you scroll. Perfect for creating visual separation between
			content areas without hard borders.
		</p>
	</div>
</section>
