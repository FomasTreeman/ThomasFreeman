<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { IResource } from '$lib/types.js';
	import LetterTile from '$lib/LetterTile.svelte';
	import { RESOURCES_KEY } from '$lib/constants/content-keys.js';

	const DEFAULT_CATEGORIES = [
		'News',
		'Newsletters',
		'Blogs',
		'Podcasts',
		'YouTube',
		'Tools',
		'Learning'
	];

	let resources = $state<IResource[]>([]);
	let loading = $state(true);
	let saving = $state(false);
	let publishing = $state(false);
	let message = $state('');
	let error = $state('');

	// Add-by-paste form
	let pastedUrl = $state('');
	let fetching = $state(false);
	let draft = $state<IResource | null>(null);
	let tagInput = $state('');

	const categories = $derived(
		Array.from(new Set([...DEFAULT_CATEGORIES, ...resources.map((r) => r.category)])).filter(Boolean)
	);

	function flash(text: string) {
		message = text;
		setTimeout(() => (message = ''), 2500);
	}

	function hostOf(url: string): string {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return url;
		}
	}

	onMount(loadResources);

	async function loadResources() {
		loading = true;
		try {
			const response = await fetch(`/api/cms/content?key=${encodeURIComponent(RESOURCES_KEY)}`);
			if (response.status === 404) {
				resources = [];
			} else if (response.ok) {
				const { value } = await response.json();
				const parsed = JSON.parse(value || '[]');
				resources = Array.isArray(parsed) ? parsed : [];
			} else if (response.status === 401) {
				goto('/cms/login');
			} else {
				error = 'Could not load resources.';
			}
		} catch {
			error = 'Could not load resources.';
		} finally {
			loading = false;
		}
	}

	/** Paste a URL, let the server read its <head>, and prefill the form. */
	async function lookupUrl() {
		const url = pastedUrl.trim();
		if (!url) return;

		fetching = true;
		error = '';
		try {
			const response = await fetch(`/api/cms/link-metadata?url=${encodeURIComponent(url)}`);
			const payload = await response.json();

			if (!response.ok) {
				// Still let the admin add the link by hand
				error = payload.error || 'Could not read that page.';
				draft = blankDraft(url);
				return;
			}

			draft = {
				id: crypto.randomUUID(),
				title: payload.title || payload.siteName || hostOf(url),
				url: payload.url || url,
				description: payload.description || '',
				category: resources.at(-1)?.category || DEFAULT_CATEGORIES[0],
				tags: [],
				addedAt: new Date().toISOString()
			};
			tagInput = '';
			pastedUrl = '';
		} catch {
			error = 'Could not read that page.';
			draft = blankDraft(url);
		} finally {
			fetching = false;
		}
	}

	function blankDraft(url: string): IResource {
		return {
			id: crypto.randomUUID(),
			title: '',
			url,
			description: '',
			category: DEFAULT_CATEGORIES[0],
			tags: [],
			addedAt: new Date().toISOString()
		};
	}

	function confirmDraft() {
		if (!draft) return;
		if (!draft.title.trim()) {
			error = 'Give the resource a title.';
			return;
		}
		draft.tags = tagInput
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
		resources = [...resources, draft];
		draft = null;
		tagInput = '';
		error = '';
		flash('Added — remember to save.');
	}

	function cancelDraft() {
		draft = null;
		tagInput = '';
		error = '';
	}

	function removeResource(id: string) {
		const resource = resources.find((r) => r.id === id);
		if (!confirm(`Remove "${resource?.title ?? 'this resource'}"?`)) return;
		resources = resources.filter((r) => r.id !== id);
		flash('Removed — remember to save.');
	}

	function move(index: number, direction: -1 | 1) {
		const target = index + direction;
		if (target < 0 || target >= resources.length) return;
		const next = [...resources];
		[next[index], next[target]] = [next[target], next[index]];
		resources = next;
	}

	function updateTags(id: string, value: string) {
		const resource = resources.find((r) => r.id === id);
		if (resource) {
			resource.tags = value
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean);
		}
	}

	async function save({ publish = false } = {}) {
		if (publish) publishing = true;
		else saving = true;
		error = '';

		try {
			const response = await fetch('/api/cms/content', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					key: RESOURCES_KEY,
					value: JSON.stringify(resources, null, 2),
					isDraft: !publish
				})
			});

			if (!response.ok) {
				error = 'Failed to save.';
				return;
			}

			if (publish) {
				const publishResponse = await fetch('/api/cms/content', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ key: RESOURCES_KEY })
				});
				if (!publishResponse.ok) {
					error = 'Saved, but publishing failed.';
					return;
				}
			}

			flash(publish ? 'Published!' : 'Saved as draft.');
		} catch {
			error = 'Failed to save.';
		} finally {
			saving = false;
			publishing = false;
		}
	}
</script>

<svelte:head>
	<title>Resources · CMS</title>
</svelte:head>

<div class="cms-container">
	<header>
		<div class="header-content">
			<h1>🔗 Resources</h1>
			<div class="header-actions">
				<button class="secondary-btn" onclick={() => goto('/cms')}>← Content</button>
				<button class="secondary-btn" onclick={() => goto('/resources')}>👁️ Preview</button>
				<button class="save-btn" onclick={() => save()} disabled={saving || publishing}>
					{saving ? 'Saving…' : '💾 Save draft'}
				</button>
				<button
					class="publish-btn"
					onclick={() => save({ publish: true })}
					disabled={saving || publishing}
				>
					{publishing ? 'Publishing…' : '🚀 Publish'}
				</button>
			</div>
		</div>
	</header>

	<main>
		{#if message}<p class="banner success">{message}</p>{/if}
		{#if error}<p class="banner error">{error}</p>{/if}

		<section class="add-panel">
			<h2>Add a resource</h2>
			<p class="hint">Paste a URL and the title and description are read from the page.</p>
			<div class="paste-row">
				<input
					type="url"
					bind:value={pastedUrl}
					placeholder="https://example.com/article"
					onkeydown={(e) => e.key === 'Enter' && lookupUrl()}
					disabled={fetching}
				/>
				<button class="save-btn" onclick={lookupUrl} disabled={fetching || !pastedUrl.trim()}>
					{fetching ? 'Reading…' : 'Fetch details'}
				</button>
			</div>

			{#if draft}
				<div class="draft">
					<label>
						Title
						<input type="text" bind:value={draft.title} />
					</label>
					<label>
						URL
						<input type="url" bind:value={draft.url} />
					</label>
					<label>
						Description
						<textarea rows="2" bind:value={draft.description}></textarea>
					</label>
					<div class="draft-row">
						<label>
							Category
							<input type="text" list="category-options" bind:value={draft.category} />
						</label>
						<label>
							Tags <span class="hint-inline">comma separated</span>
							<input type="text" bind:value={tagInput} placeholder="rust, weekly" />
						</label>
					</div>
					<div class="draft-actions">
						<button class="save-btn" onclick={confirmDraft}>Add to list</button>
						<button class="secondary-btn" onclick={cancelDraft}>Cancel</button>
					</div>
				</div>
			{/if}
		</section>

		<datalist id="category-options">
			{#each categories as category (category)}
				<option value={category}></option>
			{/each}
		</datalist>

		{#if loading}
			<p class="hint">Loading…</p>
		{:else if resources.length === 0}
			<p class="hint">No resources yet. Paste a URL above to add the first one.</p>
		{:else}
			<p class="count">{resources.length} resources</p>
			<ul class="resource-list">
				{#each resources as resource, index (resource.id)}
					<li class="resource">
						<LetterTile label={resource.title || hostOf(resource.url)} size="2.25rem" />
						<div class="fields">
							<input class="title-input" type="text" bind:value={resource.title} />
							<input class="url-input" type="url" bind:value={resource.url} />
							<textarea rows="2" bind:value={resource.description} placeholder="Description"
							></textarea>
							<div class="row">
								<input
									type="text"
									list="category-options"
									bind:value={resource.category}
									placeholder="Category"
								/>
								<input
									type="text"
									value={(resource.tags ?? []).join(', ')}
									placeholder="Tags"
									oninput={(e) => updateTags(resource.id, e.currentTarget.value)}
								/>
							</div>
						</div>
						<div class="resource-actions">
							<button
								class="icon-btn"
								title="Move up"
								onclick={() => move(index, -1)}
								disabled={index === 0}>▲</button
							>
							<button
								class="icon-btn"
								title="Move down"
								onclick={() => move(index, 1)}
								disabled={index === resources.length - 1}>▼</button
							>
							<button class="icon-btn danger" title="Remove" onclick={() => removeResource(resource.id)}
								>✕</button
							>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</main>
</div>

<style>
	.cms-container {
		min-height: 100vh;
		background: #1a1a1a;
		color: #eee;
	}

	header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: #111;
		border-bottom: 1px solid #2c2c2c;
		padding: 1rem 2rem;
	}

	.header-content {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
		max-width: 70rem;
		margin-inline: auto;
	}

	h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	main {
		max-width: 70rem;
		margin-inline: auto;
		padding: 2rem;
	}

	button {
		border: none;
		border-radius: 8px;
		padding: 0.6rem 1rem;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition: filter 0.2s ease;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button:not(:disabled):hover {
		filter: brightness(1.15);
	}

	.save-btn {
		background: linear-gradient(135deg, var(--primary-color1), var(--primary-color2));
		color: #1a1a1a;
	}

	.publish-btn {
		background: linear-gradient(135deg, var(--secondary-color1), var(--secondary-color2));
		color: #fff;
	}

	.secondary-btn {
		background: #2c2c2c;
		color: #eee;
	}

	.banner {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.banner.success {
		background: rgba(40, 167, 69, 0.15);
		border: 1px solid rgba(40, 167, 69, 0.4);
	}

	.banner.error {
		background: rgba(220, 53, 69, 0.15);
		border: 1px solid rgba(220, 53, 69, 0.4);
	}

	.add-panel {
		background: #212121;
		border: 1px solid #2c2c2c;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.add-panel h2 {
		margin: 0 0 0.25rem 0;
		font-size: 1.15rem;
	}

	.hint,
	.hint-inline {
		opacity: 0.6;
		font-size: 0.875rem;
	}

	.hint {
		margin: 0 0 1rem 0;
	}

	.paste-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.paste-row input {
		flex: 1 1 20rem;
	}

	input,
	textarea {
		/* no global border-box in app.css, so width:100% + padding would
		   otherwise overflow the row and run under the action buttons */
		box-sizing: border-box;
		width: 100%;
		padding: 0.6rem 0.75rem;
		border-radius: 8px;
		border: 1px solid #3a3a3a;
		background: #1a1a1a;
		color: #eee;
		font: inherit;
		font-size: 0.95rem;
	}

	input:focus-visible,
	textarea:focus-visible {
		outline: 2px solid var(--primary-color1);
		outline-offset: 1px;
	}

	textarea {
		resize: vertical;
	}

	.draft {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid #2c2c2c;
	}

	.draft label,
	.fields label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.draft-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: 0.75rem;
	}

	.draft-actions {
		display: flex;
		gap: 0.5rem;
	}

	.count {
		opacity: 0.6;
		font-size: 0.875rem;
		margin-bottom: 0.75rem;
	}

	.resource-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.resource {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		background: #212121;
		border: 1px solid #2c2c2c;
		border-radius: 12px;
		padding: 1rem;
	}

	.fields {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}

	.title-input {
		font-weight: 600;
	}

	.url-input {
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 0.85rem;
	}

	.row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
		gap: 0.5rem;
	}

	.resource-actions {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		gap: 0.35rem;
	}

	.icon-btn {
		background: #2c2c2c;
		color: #eee;
		padding: 0.35rem 0.6rem;
		font-size: 0.8rem;
	}

	.icon-btn.danger {
		background: rgba(220, 53, 69, 0.25);
	}

	@media (max-width: 768px) {
		header,
		main {
			padding: 1rem;
		}

		.resource {
			flex-wrap: wrap;
		}
	}
</style>
