<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="login-container">
	<div class="login-card">
		<h1>🔐 CMS Login</h1>

		{#if data.invalidLink}
			<div class="error-message">
				<p>That login link is invalid or has expired. Request a new one below.</p>
			</div>
		{/if}

		{#if form?.error}
			<div class="error-message">
				<p>{form.error}</p>
			</div>
		{/if}

		{#if form?.sent}
			<div class="success-message">
				<p>✓ Login link sent to {data.email}</p>
				<p class="hint">{form.message}</p>
			</div>
		{/if}

		<form method="POST" action="?/send" use:enhance>
			<button type="submit">
				{form?.sent ? 'Resend Link' : 'Email me a login link'}
			</button>
		</form>
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

	button {
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

	button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
	}

	button:active {
		transform: translateY(0);
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
