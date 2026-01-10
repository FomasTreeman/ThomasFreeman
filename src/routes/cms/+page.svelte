<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	// Filter out projects.config since it's managed via the dedicated Projects page
	let content = data.content.filter((item) => item.key !== 'projects.config');
	let editingKey: string | null = null;
	let editValue = '';
	let saving = false;
	let saveMessage = '';
	let jsonError = '';
	let publishing: Record<string, boolean> = {};
	let showHistory = false;
	let historyData: any[] = [];
	let historyKey: string | null = null;
	let loadingHistory = false;
	let undoing: Record<string, boolean> = {};
	let expandedHistoryEntries: Set<number> = new Set();

	function isJSON(str: string): boolean {
		try {
			JSON.parse(str);
			return true;
		} catch {
			return false;
		}
	}

	function formatJSON(str: string): string {
		try {
			return JSON.stringify(JSON.parse(str), null, 2);
		} catch {
			return str;
		}
	}

	async function saveContent(key: string, value: string) {
		saving = true;
		saveMessage = '';

		try {
			const response = await fetch('/api/cms/content', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, value, isDraft: true })
			});

			if (response.ok) {
				// Don't update if it's projects.config (shouldn't happen, but just in case)
				if (key !== 'projects.config') {
					const idx = content.findIndex((c) => c.key === key);
					if (idx !== -1) {
						content[idx].value = value;
						content[idx].is_draft = 1;
						content[idx].updated_at = new Date().toISOString();
					}
				}
				saveMessage = 'Saved as draft!';
				setTimeout(() => (saveMessage = ''), 2000);
			} else {
				const error = await response.json();
				alert('Error saving: ' + error.error);
			}
		} catch (error) {
			alert('Error saving content');
		} finally {
			saving = false;
		}
	}

	async function publishContent(key: string) {
		publishing[key] = true;

		try {
			const response = await fetch('/api/cms/content', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key })
			});

			if (response.ok) {
				// Don't update if it's projects.config (shouldn't happen, but just in case)
				if (key !== 'projects.config') {
					const idx = content.findIndex((c) => c.key === key);
					if (idx !== -1) {
						content[idx].is_draft = 0;
						content[idx].updated_at = new Date().toISOString();
					}
				}
				saveMessage = 'Published!';
				setTimeout(() => (saveMessage = ''), 2000);
			} else {
				const error = await response.json();
				alert('Error publishing: ' + error.error);
			}
		} catch (error) {
			alert('Error publishing content');
		} finally{
			publishing[key] = false;
		}
	}

	async function undoDraft(key: string) {
		console.log('[UNDO DRAFT] Starting undo for key:', key);
		undoing[key] = true;

		try {
			console.log('[UNDO DRAFT] Fetching history...');
			// Get history to find the last published version
			const historyResponse = await fetch(`/api/history?key=${encodeURIComponent(key)}&limit=100`);
			if (!historyResponse.ok) {
				console.error('[UNDO DRAFT] Failed to load history');
				alert('Failed to load history');
				undoing[key] = false;
				return;
			}

			const historyData = await historyResponse.json();
			const history = historyData.history;
			console.log('[UNDO DRAFT] History entries:', history.length);

			// Find the most recent 'update' or 'create' action that came before the current draft
			const lastPublished = history.find((entry: any) =>
				entry.action === 'update' || entry.action === 'create'
			);

			console.log('[UNDO DRAFT] Last published entry:', lastPublished);

			if (!lastPublished || !lastPublished.old_value) {
				console.error('[UNDO DRAFT] No previous version found');
				alert('No previous version found to revert to');
				undoing[key] = false;
				return;
			}

			console.log('[UNDO DRAFT] Reverting to old value...');
			// Restore the old value and publish it
			const saveResponse = await fetch('/api/cms/content', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, value: lastPublished.old_value, isDraft: false })
			});

			console.log('[UNDO DRAFT] Save response status:', saveResponse.status);

			if (saveResponse.ok) {
				console.log('[UNDO DRAFT] Success! Updating UI...');
				// Don't update if it's projects.config (shouldn't happen, but just in case)
				if (key !== 'projects.config') {
					const idx = content.findIndex((c) => c.key === key);
					if (idx !== -1) {
						content[idx].value = lastPublished.old_value;
						content[idx].is_draft = 0;
						content[idx].updated_at = new Date().toISOString();
						content = [...content]; // Trigger reactivity
					}
				}
				saveMessage = 'Reverted to published version!';
				setTimeout(() => (saveMessage = ''), 2000);
			} else {
				const error = await saveResponse.json();
				console.error('[UNDO DRAFT] Server error:', error);
				alert('Error reverting: ' + error.error);
			}
		} catch (error) {
			alert('Error reverting draft');
		} finally {
			undoing[key] = false;
		}
	}


	function startEdit(key: string, value: string) {
		editingKey = key;
		editValue = isJSON(value) ? formatJSON(value) : value;
		jsonError = '';
	}

	function cancelEdit() {
		editingKey = null;
		editValue = '';
		jsonError = '';
	}

	function finishEdit(key: string) {
		// Validate JSON if the original content was JSON
		const originalItem = content.find((c) => c.key === key);
		if (originalItem && isJSON(originalItem.value)) {
			if (!isJSON(editValue)) {
				jsonError = 'Invalid JSON format. Please fix the syntax errors.';
				return;
			}
		}
		jsonError = '';
		saveContent(key, editValue);
		editingKey = null;
		editValue = '';
	}

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleString();
	}

	async function viewHistory(key?: string) {
		loadingHistory = true;
		showHistory = true;
		historyKey = key || null;

		try {
			const url = key ? `/api/history?key=${encodeURIComponent(key)}` : '/api/history';
			const response = await fetch(url);
			if (response.ok) {
				const data = await response.json();
				historyData = data.history;
			} else {
				alert('Failed to load history');
			}
		} catch (error) {
			alert('Error loading history');
		} finally {
			loadingHistory = false;
		}
	}

	function closeHistory() {
		showHistory = false;
		historyData = [];
		historyKey = null;
		expandedHistoryEntries = new Set();
	}

	function toggleExpanded(index: number) {
		if (expandedHistoryEntries.has(index)) {
			expandedHistoryEntries.delete(index);
		} else {
			expandedHistoryEntries.add(index);
		}
		expandedHistoryEntries = expandedHistoryEntries; // trigger reactivity
	}

	function truncateValue(value: string | null, maxLength = 100): string {
		if (!value) return 'null';
		if (value.length <= maxLength) return value;
		return value.substring(0, maxLength) + '...';
	}

	async function revertToVersion(key: string, value: string) {
		console.log('[REVERT] Starting revert for key:', key);
		console.log('[REVERT] Value length:', value?.length);
		console.log('[REVERT] Sending API request...');

		try {
			// Save as draft (isDraft: true)
			const response = await fetch('/api/cms/content', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, value, isDraft: true })
			});

			console.log('[REVERT] API response status:', response.status);

			if (response.ok) {
				console.log('[REVERT] Success! Updating UI...');
				// Update the content in the UI
				const idx = content.findIndex((c) => c.key === key);
				console.log('[REVERT] Found content at index:', idx);

				if (idx !== -1) {
					content[idx].value = value;
					content[idx].is_draft = 1;  // Set as draft
					content[idx].updated_at = new Date().toISOString();
					content = [...content]; // Trigger reactivity
					console.log('[REVERT] UI updated');
				}
				saveMessage = '✓ Reverted to draft! Review and publish when ready.';
				setTimeout(() => (saveMessage = ''), 3000);
				console.log('[REVERT] Closing history modal');
				closeHistory();
			} else {
				const errorData = await response.json();
				console.error('[REVERT] Server returned error:', errorData);
				alert(`Error reverting content: ${errorData.error || errorData.details || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('[REVERT] Exception caught:', error);
			alert('Error reverting content: ' + String(error));
		}
	}

	async function previewSite() {
		await invalidateAll();
		goto('/');
	}

</script>

<div class="cms-container">
	<header>
		<div class="header-content">
			<h1>📝 Content Manager</h1>
			<div class="header-actions">
				<button class="history-btn" on:click={() => goto('/cms/projects')}>
					🎨 Manage Projects
				</button>
				<button class="history-btn" on:click={() => viewHistory()}>
					📜 View History
				</button>
				<button class="preview-site-btn" on:click={previewSite}>
					👁️ Preview Site
				</button>
				<span class="user-email">{data.email}</span>
				<form method="POST" action="?/logout" use:enhance>
					<button type="submit" class="logout-btn">Logout</button>
				</form>
			</div>
		</div>
	</header>

	<main>
		<div class="controls">
			{#if saveMessage}
				<span class="save-indicator">{saveMessage}</span>
			{:else}
				<span class="content-count">
					{content.length} items ({content.filter((c) => c.is_draft === 1).length} drafts)
				</span>
			{/if}
		</div>

		<div class="content-list">
			{#if content.length === 0}
				<div class="empty-state">
					<p>No content yet. Add some content keys to your code and they'll appear here for editing.</p>
				</div>
			{:else}
				{#each content as item (item.id)}
					<div class="content-item" class:is-draft={item.is_draft === 1}>
						<div class="content-header">
							<div class="content-key-wrapper">
								<strong class="content-key">{item.key}</strong>
								{#if item.is_draft === 1}
									<span class="draft-badge">DRAFT</span>
								{:else}
									<span class="published-badge">PUBLISHED</span>
								{/if}
							</div>
							<div class="content-actions">
								<span class="updated-at">{formatDate(item.updated_at)}</span>
								{#if editingKey !== item.key}
									{#if item.is_draft === 1}
										<button
											class="publish-btn"
											on:click={() => publishContent(item.key)}
											disabled={publishing[item.key] || undoing[item.key]}
										>
											{publishing[item.key] ? 'Publishing...' : '🚀 Publish'}
										</button>
										<button
											class="undo-btn"
											on:click={() => undoDraft(item.key)}
											disabled={undoing[item.key] || publishing[item.key]}
										>
											{undoing[item.key] ? 'Undoing...' : '↩️ Undo Draft'}
										</button>
									{/if}
									<button class="history-item-btn" on:click={() => viewHistory(item.key)}>
										📜
									</button>
									<button class="edit-btn" on:click={() => startEdit(item.key, item.value)}>
										Edit
									</button>
								{/if}
							</div>
						</div>

						{#if editingKey === item.key}
							<div class="edit-area">
								{#if isJSON(item.value)}
									<div class="json-label">JSON Content - Edit carefully</div>
								{/if}
								<textarea
									bind:value={editValue}
									rows={isJSON(item.value) ? 20 : 6}
									class:json-editor={isJSON(item.value)}
								></textarea>
								{#if jsonError}
									<div class="json-error">{jsonError}</div>
								{/if}
								<div class="edit-actions">
									<button
										class="save-btn"
										on:click={() => finishEdit(item.key)}
										disabled={saving}
									>
										{saving ? 'Saving...' : 'Save'}
									</button>
									<button class="cancel-btn" on:click={cancelEdit}>Cancel</button>
								</div>
							</div>
						{:else}
							<div class="content-value" class:json-content={isJSON(item.value)}>
								<pre>{isJSON(item.value) ? formatJSON(item.value) : item.value}</pre>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</main>
</div>

{#if showHistory}
	<div class="modal-overlay" on:click={closeHistory} on:keydown={(e) => e.key === 'Escape' && closeHistory()} role="button" tabindex="0">
		<div class="modal-content" on:click|stopPropagation on:keydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<div class="modal-header">
				<h2>📜 Change History {historyKey ? `- ${historyKey}` : ''}</h2>
				<button class="close-btn" on:click={closeHistory}>✕</button>
			</div>
			<div class="modal-body">
				{#if loadingHistory}
					<div class="loading">Loading history...</div>
				{:else if historyData.length === 0}
					<div class="empty-history">No change history found</div>
				{:else}
					<div class="history-list">
						{#each historyData as entry, index}
							<div class="history-entry" class:expanded={expandedHistoryEntries.has(index)}>
								<div class="history-item-header" on:click={() => toggleExpanded(index)} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpanded(index)} role="button" tabindex="0">
									<div class="history-item-info">
										<span class="history-date">{formatDate(entry.changed_at)}</span>
										<span class="history-action action-{entry.action}">{entry.action}</span>
									</div>
									<span class="expand-icon">{expandedHistoryEntries.has(index) ? '▼' : '▶'}</span>
								</div>

								{#if expandedHistoryEntries.has(index)}
									<div class="history-content">
										{#if entry.old_value}
											<div class="history-version">
												<div class="version-label">Previous Version:</div>
												<pre>{entry.old_value}</pre>
												<button class="revert-btn-simple" on:click={() => revertToVersion(entry.key, entry.old_value)}>
													↩️ Revert to This
												</button>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.cms-container {
		min-height: 100vh;
		background: #f5f7fa;
	}

	header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1.5rem 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h1 {
		margin: 0;
		font-size: 1.75rem;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-email {
		font-size: 0.875rem;
		opacity: 0.9;
	}

	.logout-btn {
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background 0.2s;
	}

	.logout-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.preview-site-btn {
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
		cursor: pointer;
	}

	.preview-site-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-1px);
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.controls {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.content-count {
		color: #666;
		font-size: 0.9rem;
	}

	.save-indicator {
		color: #28a745;
		font-weight: 600;
		animation: fadeIn 0.3s;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}


	.content-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.empty-state {
		background: white;
		padding: 3rem;
		text-align: center;
		border-radius: 12px;
		color: #666;
	}

	.content-item {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.2s;
		position: relative;
	}

	.content-item.is-draft {
		border-left: 4px solid #ffc107;
		background: #fffdf7;
	}

	.content-item:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.content-key-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.content-key {
		color: #667eea;
		font-size: 1.1rem;
		font-family: 'Courier New', monospace;
	}

	.draft-badge {
		background: #ffc107;
		color: #000;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.5px;
	}

	.published-badge {
		background: #28a745;
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.5px;
	}

	.content-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.updated-at {
		font-size: 0.8rem;
		color: #999;
	}

	.edit-btn,
	.publish-btn,
	.undo-btn {
		padding: 0.4rem 0.8rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: transform 0.2s;
	}

	.publish-btn {
		background: #28a745;
		color: white;
		font-weight: 600;
	}

	.publish-btn:hover:not(:disabled) {
		background: #218838;
		transform: translateY(-1px);
	}

	.publish-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.undo-btn {
		background: #ffc107;
		color: #000;
		font-weight: 600;
	}

	.undo-btn:hover:not(:disabled) {
		background: #e0a800;
		transform: translateY(-1px);
	}

	.undo-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.edit-btn {
		background: #667eea;
		color: white;
	}

	.edit-btn:hover {
		transform: translateY(-1px);
	}

	.content-value {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 6px;
		border-left: 3px solid #667eea;
	}

	.content-value.json-content {
		background: #1e1e1e;
		border-left-color: #4ec9b0;
	}

	.content-value.json-content pre {
		color: #d4d4d4;
	}

	.content-value pre {
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
		color: #333;
		overflow-x: auto;
	}

	.edit-area {
		margin-top: 0.5rem;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		font-size: 1rem;
		font-family: 'Courier New', monospace;
		resize: vertical;
		box-sizing: border-box;
	}

	textarea:focus {
		outline: none;
		border-color: #667eea;
	}

	textarea.json-editor {
		background: #1e1e1e;
		color: #d4d4d4;
		border-color: #4ec9b0;
		line-height: 1.5;
	}

	textarea.json-editor:focus {
		border-color: #4ec9b0;
		box-shadow: 0 0 0 2px rgba(78, 201, 176, 0.2);
	}

	.json-label {
		font-size: 0.85rem;
		color: #4ec9b0;
		font-weight: 600;
		margin-bottom: 0.5rem;
		font-family: 'Courier New', monospace;
	}

	.json-error {
		background: #f8d7da;
		border: 1px solid #f5c6cb;
		color: #721c24;
		padding: 0.75rem;
		border-radius: 6px;
		margin-top: 0.75rem;
		font-size: 0.9rem;
	}

	.edit-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.save-btn,
	.cancel-btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
	}

	.save-btn {
		background: #28a745;
		color: white;
	}

	.save-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.cancel-btn {
		background: #6c757d;
		color: white;
	}

	.history-btn,
	.history-item-btn {
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background 0.2s;
	}

	.history-item-btn {
		padding: 0.4rem 0.8rem;
		background: #6c757d;
		color: white;
		border: none;
	}

	.history-btn:hover,
	.history-item-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.history-item-btn:hover {
		background: #5a6268;
		transform: translateY(-1px);
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		border-radius: 12px;
		max-width: 900px;
		width: 90%;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}

	.modal-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #999;
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: #333;
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
	}

	.loading,
	.empty-history {
		text-align: center;
		padding: 2rem;
		color: #999;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.history-entry {
		background: white;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
		overflow: hidden;
		transition: all 0.2s;
	}

	.history-entry:hover {
		border-color: #667eea;
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
	}

	.history-entry.expanded {
		border-color: #667eea;
	}

	.history-item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		cursor: pointer;
		user-select: none;
		transition: background 0.2s;
	}

	.history-item-header:hover {
		background: #f8f9fa;
	}

	.history-item-info {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.history-date {
		font-size: 0.9rem;
		color: #333;
		font-weight: 500;
	}

	.history-action {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.action-create {
		background: #28a745;
		color: white;
	}

	.action-update {
		background: #ffc107;
		color: #000;
	}

	.action-delete {
		background: #dc3545;
		color: white;
	}

	.expand-icon {
		color: #667eea;
		font-size: 0.9rem;
		transition: transform 0.2s;
	}

	.history-content {
		padding: 0 1rem 1rem 1rem;
		border-top: 1px solid #f0f0f0;
		animation: slideDown 0.2s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.history-version {
		margin-top: 1rem;
	}

	.version-label {
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.history-version pre {
		margin: 0;
		padding: 1rem;
		background: #f8f9fa;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		font-size: 0.85rem;
		color: #333;
		white-space: pre-wrap;
		word-wrap: break-word;
		font-family: 'Courier New', monospace;
		max-height: 400px;
		overflow-y: auto;
	}

	.revert-btn-simple {
		margin-top: 0.75rem;
		padding: 0.5rem 1rem;
		background: #ffc107;
		color: #000;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.revert-btn-simple:hover {
		background: #e0a800;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
	}

	@media (max-width: 768px) {
		header {
			padding: 1rem;
		}

		.header-content {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		main {
			padding: 1rem;
		}

		.content-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.content-actions {
			flex-wrap: wrap;
		}
	}
</style>
