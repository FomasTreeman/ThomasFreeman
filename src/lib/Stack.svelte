<script>
	import StackIcons from './StackIcons.svelte';
</script>

<div class="scroll-parent">
	<div class="scroll-element primary icons">
		<StackIcons />
	</div>
	<div class="scroll-element secondary icons">
		<StackIcons />
	</div>
</div>

<style>
	:global(:root) {
		--icon-width: 4rem;
		--icon-margin: 2rem;
		/* 22 is number of imgs */
		/* breaks at 900px width */
		/* --stack-width: calc(100vw - 110vw + 22 * var(--img-width)); */
		--stack-width: calc(22 * (var(--icon-width) + var(--icon-margin)));
	}
	.scroll-parent {
		position: relative;
		width: var(--stack-width);
		height: calc(var(--icon-width) + 1rem);
		overflow-x: hidden;
	}

	.scroll-element {
		width: inherit;
		height: inherit;
		position: absolute;
		display: flex;
	}

	.primary {
		animation: primary 20s linear infinite;
	}

	.secondary {
		animation: secondary 20s linear infinite;
	}

	@keyframes primary {
		from {
			left: 0px;
		}
		to {
			left: calc(var(--stack-width) * -1);
		}
	}

	@keyframes secondary {
		from {
			left: var(--stack-width);
		}
		to {
			left: 0px;
		}
	}

	@media (min-width: 9000px) {
		:global(:root) {
			--icon-width: 5rem;
		}
	}

	@media (min-width: 1600px) {
		:global(:root) {
			--icon-width: 5.5rem;
		}

		.scroll-parent {
			margin-block: 2rem;
		}
	}
</style>
