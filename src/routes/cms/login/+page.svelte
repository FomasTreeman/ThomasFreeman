<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	
	export let data: PageData;
	export let form;
</script>

<div class="login-container">
	<div class="login-card">
		<h1>🔐 CMS Login</h1>
		
		{#if data.success}
			<div class="success-message">
				<p>✓ Login link sent to your email</p>
				<p class="hint">Check your inbox for the magic link (expires in 15 minutes)</p>
			</div>

			<form method="POST" action="?/resend" use:enhance>
				{#if form?.success}
					<p class="resent-message">{form.message}</p>
				{/if}
				<button type="submit" class="resend-btn">Resend Link</button>
			</form>
		{:else}
			<div class="error-message">
				<p>Failed to send login link. Please try again.</p>
			</div>

			<form method="POST" action="?/resend" use:enhance>
				<button type="submit">Retry</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 1rem;
	}

	.login-card {
		background: white;
		border-radius: 12px;
		padding: 2.5rem;
		max-width: 400px;
		width: 100%;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	h1 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 2rem;
	}

	form {
		margin-top: 1.5rem;
	}

	button,
	.resend-btn {
		width: 100%;
		padding: 0.875rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	button:hover,
	.resend-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
	}

	button:active,
	.resend-btn:active {
		transform: translateY(0);
	}

	.resent-message {
		color: #28a745;
		text-align: center;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.success-message {
		background: #d4edda;
		border: 1px solid #c3e6cb;
		color: #155724;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
	}

	.success-message p {
		margin: 0.5rem 0;
	}

	.success-message .hint {
		font-size: 0.875rem;
		opacity: 0.8;
	}

	.error-message {
		background: #f8d7da;
		border: 1px solid #f5c6cb;
		color: #721c24;
		padding: 0.75rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.login-card {
			padding: 2rem;
		}

		h1 {
			font-size: 1.75rem;
		}
	}
</style>
