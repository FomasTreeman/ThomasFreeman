<script lang="ts">
	export let show = false;
	export let title = '';
	export let subtitle = '';
	export let titleColor = '#f39c12'; // Default orange color like pause menu
	export let maxWidth = '400px';
</script>

{#if show}
	<div class="modal-overlay">
		<div class="modal-content" style="max-width: {maxWidth}">
			{#if title}
				<h2 style="color: {titleColor}">{title}</h2>
			{/if}
			{#if subtitle}
				<p class="subtitle">{subtitle}</p>
			{/if}
			<slot />
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(5px);
	}

	.modal-content {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20px);
		border-radius: 20px;
		padding: 3rem;
		text-align: center;
		color: white;
		width: 90%;
		border: 2px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.modal-content h2 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		margin-top: 0.25rem;
	}

	.subtitle {
		font-size: 1.1rem;
		margin-bottom: 2rem;
		opacity: 0.9;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.modal-content {
			padding: 2rem;
			width: 95%;
		}

		.modal-content h2 {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		.modal-content {
			padding: 1.5rem;
		}

		.modal-content h2 {
			font-size: 1.8rem;
		}
	}
</style>
