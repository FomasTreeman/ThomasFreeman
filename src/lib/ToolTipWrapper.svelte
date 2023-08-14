<script lang="ts">
	export let message: string;
</script>

<div class="tooltip">
	<slot />
	<span class="tooltip-text"> {message} </span>
</div>

<style>
	/* ex from https://www.w3schools.com/css/css_tooltip.asp */
	/* Tooltip container */
	.tooltip {
		position: relative;
		display: inline-block;
	}

	/* Tooltip text */
	.tooltip .tooltip-text {
		width: 120px;
		background-color: black;
		color: #fff;
		text-align: center;
		padding: 5px 0;
		border-radius: 6px;

		/* Position the tooltip text - see examples below! */
		position: absolute;
		z-index: 1;
		box-sizing: border-box;
		width: 120px;
		bottom: 120%;
		left: 50%;
		margin-left: -60px;

		/* animate out*/
		opacity: 0;
		transition: opacity 1s;
		visibility: hidden;
	}

	/* Show the tooltip text when you mouse over the tooltip container */
	.tooltip:hover .tooltip-text {
		visibility: visible;
		opacity: 1;
		transition: opacity 0.3s;
	}

	/* Tooltip arrow */
	.tooltip .tooltip-text::after {
		content: ' ';
		position: absolute;
		top: 100%; /* At the bottom of the tooltip */
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: black transparent transparent transparent;
	}
</style>
