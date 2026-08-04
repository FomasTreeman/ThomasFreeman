<script lang="ts">
	/**
	 * A favicon stand-in. Deriving the mark from the label costs no network
	 * request and no third-party favicon service, which keeps the page fully
	 * self-contained.
	 */
	let { label = '', size = '2.75rem' }: { label?: string; size?: string } = $props();

	function hashOf(value: string): number {
		let hash = 0;
		for (let i = 0; i < value.length; i++) {
			hash = (hash << 5) - hash + value.charCodeAt(i);
			hash |= 0;
		}
		return Math.abs(hash);
	}

	const letter = $derived((label.trim()[0] || '?').toUpperCase());
	// Two hues a little apart give the tile the same gradient feel as the rest
	// of the site without needing a colour per resource in the CMS.
	const hue = $derived(hashOf(label) % 360);
</script>

<span
	class="tile"
	style="--tile-size: {size}; --tile-hue: {hue}deg;"
	aria-hidden="true"
	data-letter={letter}
>
	{letter}
</span>

<style>
	.tile {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--tile-size);
		height: var(--tile-size);
		border-radius: 0.75rem;
		font-size: calc(var(--tile-size) * 0.45);
		font-weight: 700;
		line-height: 1;
		color: #fff;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
		background-image: linear-gradient(
			135deg,
			hsl(var(--tile-hue) 65% 48%),
			hsl(calc(var(--tile-hue) + 35deg) 70% 38%)
		);
		border: 1px solid rgba(255, 255, 255, 0.18);
	}
</style>
