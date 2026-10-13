<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { SITE_META_KEY } from '$lib/constants/content-keys.js';
	import {
		DEFAULT_SITE_META,
		SITE_META_LIMITS,
		cleanSiteUrl,
		parseSiteMeta,
		type SiteMeta
	} from '$lib/site-meta.js';

	let meta = $state<SiteMeta>({ ...DEFAULT_SITE_META });
	let loading = $state(true);
	let saving = $state(false);
	let publishing = $state(false);
	let message = $state('');
	let error = $state('');

	// What the typed address will be stored as, or undefined while it is not
	// a usable https origin. Drives the previews and the inline warning.
	const siteUrlClean = $derived(cleanSiteUrl(meta.siteUrl));
	const host = $derived(new URL(siteUrlClean ?? DEFAULT_SITE_META.siteUrl).host);

	// The card image previews the unsaved fields: /og-image.png renders from
	// query parameters for a logged-in admin. Debounced so typing does not
	// fire a render per keystroke.
	let cardSrc = $state('/og-image.png');
	$effect(() => {
		const params = new URLSearchParams({
			siteName: meta.siteName,
			description: meta.description,
			siteUrl: siteUrlClean ?? DEFAULT_SITE_META.siteUrl
		});
		const timer = setTimeout(() => (cardSrc = `/og-image.png?${params}`), 400);
		return () => clearTimeout(timer);
	});

	function flash(text: string) {
		message = text;
		setTimeout(() => (message = ''), 2500);
	}

	function overLimit(value: string, limit: number) {
		return value.length > limit;
	}

	onMount(loadMeta);

	async function loadMeta() {
		loading = true;
		try {
			const response = await fetch(`/api/cms/content?key=${encodeURIComponent(SITE_META_KEY)}`);
			if (response.status === 404) {
				// Nothing stored yet: start from what the site currently renders
				meta = { ...DEFAULT_SITE_META };
			} else if (response.ok) {
				const { value } = await response.json();
				meta = parseSiteMeta(value);
			} else if (response.status === 401) {
				goto('/cms/login');
			} else {
				error = 'Could not load the site metadata.';
			}
		} catch {
			error = 'Could not load the site metadata.';
		} finally {
			loading = false;
		}
	}

	function resetToDefaults() {
		if (
			!confirm(
				'Replace the fields with the built-in defaults? Nothing is saved until you click Save.'
			)
		)
			return;
		meta = { ...DEFAULT_SITE_META };
	}

	async function save({ publish = false } = {}) {
		// Same cleanup the site applies on read, so the preview matches the result
		const cleaned = parseSiteMeta(JSON.stringify(meta));
		if (!meta.title.trim() || !meta.description.trim() || !meta.siteName.trim()) {
			error = 'Every field needs a value. Blank fields would silently fall back to the defaults.';
			return;
		}
		if (!siteUrlClean) {
			error = 'The site URL must be an https address such as https://me.fomastree.dev.';
			return;
		}

		if (publish) publishing = true;
		else saving = true;
		error = '';

		try {
			const response = await fetch('/api/cms/content', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					key: SITE_META_KEY,
					value: JSON.stringify(cleaned, null, 2),
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
					body: JSON.stringify({ key: SITE_META_KEY })
				});
				if (!publishResponse.ok) {
					error = 'Saved, but publishing failed.';
					return;
				}
			}

			meta = cleaned;
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
	<title>Site metadata · CMS</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="cms-container">
	<header>
		<div class="header-content">
			<h1>🏷️ Site metadata</h1>
			<div class="header-actions">
				<button class="secondary-btn" onclick={() => goto('/cms')}>← Content</button>
				<button class="secondary-btn" onclick={() => goto('/')}>👁️ Preview</button>
				<button class="save-btn" onclick={() => save()} disabled={loading || saving || publishing}>
					{saving ? 'Saving…' : '💾 Save draft'}
				</button>
				<button
					class="publish-btn"
					onclick={() => save({ publish: true })}
					disabled={loading || saving || publishing}
				>
					{publishing ? 'Publishing…' : '🚀 Publish'}
				</button>
			</div>
		</div>
	</header>

	<main>
		{#if message}<p class="banner success">{message}</p>{/if}
		{#if error}<p class="banner error">{error}</p>{/if}

		{#if loading}
			<p class="hint">Loading…</p>
		{:else}
			<div class="columns">
				<section class="panel">
					<h2>What search engines and social cards show</h2>
					<p class="hint">
						The title and description are the home page's <code>&lt;title&gt;</code> and
						<code>description</code>, and the Open Graph and Twitter card copy on every page. Drafts
						show only to you; publish to make them live.
					</p>

					<label>
						<span class="label-row">
							Title
							<span class="counter" class:over={overLimit(meta.title, SITE_META_LIMITS.title)}>
								{meta.title.length}/{SITE_META_LIMITS.title}
							</span>
						</span>
						<input type="text" bind:value={meta.title} placeholder={DEFAULT_SITE_META.title} />
						<span class="hint-inline"
							>Google cuts titles off at about {SITE_META_LIMITS.title} characters.</span
						>
					</label>

					<label>
						<span class="label-row">
							Description
							<span
								class="counter"
								class:over={overLimit(meta.description, SITE_META_LIMITS.description)}
							>
								{meta.description.length}/{SITE_META_LIMITS.description}
							</span>
						</span>
						<textarea
							rows="3"
							bind:value={meta.description}
							placeholder={DEFAULT_SITE_META.description}
						></textarea>
						<span class="hint-inline">One or two sentences on what you do and what is here.</span>
					</label>

					<label>
						Site name
						<input
							type="text"
							bind:value={meta.siteName}
							placeholder={DEFAULT_SITE_META.siteName}
						/>
						<span class="hint-inline">
							Shown above the card title on Facebook, LinkedIn and Slack (<code>og:site_name</code
							>).
						</span>
					</label>

					<label>
						Site URL
						<input
							type="url"
							bind:value={meta.siteUrl}
							placeholder={DEFAULT_SITE_META.siteUrl}
							class:invalid={!siteUrlClean}
						/>
						<span class="hint-inline">
							The primary address when the site answers on several. Sets the canonical link,
							<code>og:url</code>, the social image address, the sitemap and robots.txt.
							{#if siteUrlClean && siteUrlClean !== meta.siteUrl.trim()}
								Will be saved as <code>{siteUrlClean}</code>.
							{:else if !siteUrlClean}
								Needs to be an https address.
							{/if}
						</span>
					</label>

					<div class="panel-actions">
						<button class="secondary-btn" onclick={resetToDefaults}>Reset to defaults</button>
					</div>
				</section>

				<aside class="panel preview-panel">
					<h2>Preview</h2>

					<p class="preview-label">Search result</p>
					<div class="serp">
						<span class="serp-url">{host}</span>
						<span class="serp-title">{meta.title || DEFAULT_SITE_META.title}</span>
						<span class="serp-description">{meta.description || DEFAULT_SITE_META.description}</span
						>
					</div>

					<p class="preview-label">Social card</p>
					<div class="card">
						<img src={cardSrc} alt="" class="card-image" />
						<div class="card-body">
							<span class="card-site">{host}</span>
							<span class="card-title">{meta.title || DEFAULT_SITE_META.title}</span>
							<span class="card-description"
								>{meta.description || DEFAULT_SITE_META.description}</span
							>
						</div>
					</div>
					<p class="hint">
						The image is drawn from the site name, description and URL, so it updates itself when
						you publish. Platforms cache cards, so a share made earlier may keep the old one.
					</p>
				</aside>
			</div>
		{/if}
	</main>
</div>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--cms-surface-1);
		border-bottom: 1px solid var(--cms-border);
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
		border-radius: var(--cms-radius-sm);
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
		background: var(--cms-accent-gradient);
		color: var(--cms-accent-contrast);
	}

	.publish-btn {
		background: linear-gradient(135deg, var(--secondary-color1), var(--secondary-color2));
		color: #fff;
	}

	.secondary-btn {
		background: var(--cms-neutral-btn);
		color: var(--cms-text);
	}

	.banner {
		padding: 0.75rem 1rem;
		border-radius: var(--cms-radius-sm);
		margin-bottom: 1.5rem;
	}

	.banner.success {
		background: var(--cms-success-bg);
		border: 1px solid var(--cms-success);
	}

	.banner.error {
		background: var(--cms-danger-bg);
		border: 1px solid var(--cms-danger);
	}

	.columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
		gap: 1.5rem;
		align-items: start;
	}

	.panel {
		background: var(--cms-surface-1);
		border: 1px solid var(--cms-border);
		border-radius: var(--cms-radius);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.panel h2 {
		margin: 0;
	}

	.hint,
	.hint-inline {
		opacity: 0.6;
		font-size: 0.875rem;
	}

	.hint {
		margin: 0;
	}

	code {
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 0.85em;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.label-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.counter {
		font-weight: 500;
		opacity: 0.6;
		font-variant-numeric: tabular-nums;
	}

	.counter.over {
		opacity: 1;
		color: var(--cms-warning);
	}

	input,
	textarea {
		box-sizing: border-box;
		width: 100%;
		padding: 0.6rem 0.75rem;
		border-radius: var(--cms-radius-sm);
		border: 1px solid var(--cms-border);
		background: var(--cms-bg);
		color: var(--cms-text);
		font: inherit;
		font-size: 0.95rem;
		font-weight: 400;
	}

	input:focus-visible,
	textarea:focus-visible {
		outline: 2px solid var(--primary-color1);
		outline-offset: 1px;
	}

	input.invalid {
		border-color: var(--cms-warning);
	}

	textarea {
		resize: vertical;
	}

	.panel-actions {
		display: flex;
		justify-content: flex-end;
	}

	.preview-label {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.6;
	}

	/* Light surfaces on purpose: both previews imitate the platforms they stand for */
	.serp {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 1rem;
		border-radius: var(--cms-radius-sm);
		background: #fff;
		color: #1f1f1f;
		font-family: Arial, Helvetica, sans-serif;
	}

	.serp-url {
		font-size: 0.8rem;
		color: #4d5156;
	}

	.serp-title {
		font-size: 1.15rem;
		color: #1a0dab;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.serp-description {
		font-size: 0.875rem;
		color: #4d5156;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card {
		border: 1px solid #ccc;
		border-radius: var(--cms-radius-sm);
		overflow: hidden;
		background: #fff;
		color: #1f1f1f;
		font-family: Arial, Helvetica, sans-serif;
	}

	.card-image {
		display: block;
		width: 100%;
		aspect-ratio: 1200 / 630;
		object-fit: cover;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid #ccc;
	}

	.card-site {
		font-size: 0.75rem;
		color: #65676b;
		text-transform: uppercase;
	}

	.card-title {
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.card-description {
		font-size: 0.875rem;
		color: #65676b;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		header,
		main {
			padding: 1rem;
		}
	}
</style>
