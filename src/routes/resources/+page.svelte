<script lang="ts">
	import LetterTile from '$lib/LetterTile.svelte';
	import type { IResource } from '$lib/types.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let query = $state('');
	let activeCategory = $state('All');

	const resources = $derived(data.resources ?? []);

	const categories = $derived([
		'All',
		...Array.from(new Set(resources.map((r: IResource) => r.category).filter(Boolean))).sort()
	]);

	function hostOf(url: string): string {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return url;
		}
	}

	function matches(resource: IResource, term: string): boolean {
		if (!term) return true;
		const haystack = [
			resource.title,
			resource.description ?? '',
			resource.category,
			hostOf(resource.url),
			...(resource.tags ?? [])
		]
			.join(' ')
			.toLowerCase();
		return haystack.includes(term);
	}

	const filtered = $derived(
		resources.filter(
			(resource: IResource) =>
				(activeCategory === 'All' || resource.category === activeCategory) &&
				matches(resource, query.trim().toLowerCase())
		)
	);

	// Group into [category, resources[]] pairs so each section keeps a heading
	const grouped = $derived(
		Object.entries(
			filtered.reduce((acc: Record<string, IResource[]>, resource: IResource) => {
				const key = resource.category || 'Other';
				(acc[key] ||= []).push(resource);
				return acc;
			}, {})
		).sort(([a], [b]) => a.localeCompare(b))
	);
</script>

<svelte:head>
	<title>Resources · Tom Freeman</title>
	<meta
		name="description"
		content="The sites, newsletters, podcasts and tools I use to keep up with technology and industry news."
	/>
</svelte:head>

<div class="resources">
	<header class="intro">
		<h1>Resources</h1>
		<p>
			Where I keep up with technology, industry news and the odd rabbit hole. Everything here is
			something I actually read or listen to.
		</p>
	</header>

	{#if resources.length > 0}
		<div class="filters">
			<input
				type="search"
				bind:value={query}
				placeholder="Search resources…"
				aria-label="Search resources"
			/>
			<div class="categories" role="group" aria-label="Filter by category">
				{#each categories as category (category)}
					<button
						type="button"
						class="chip"
						class:active={activeCategory === category}
						aria-pressed={activeCategory === category}
						onclick={() => (activeCategory = category)}
					>
						{category}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if resources.length === 0}
		<p class="empty">No resources published yet — check back soon.</p>
	{:else if filtered.length === 0}
		<p class="empty">Nothing matches that search.</p>
	{:else}
		{#each grouped as [category, items] (category)}
			<section class="group">
				<h2>{category} <span class="count">{items.length}</span></h2>
				<ul class="list">
					{#each items as resource (resource.id)}
						<li>
							<a class="card glass" href={resource.url} target="_blank" rel="noopener noreferrer">
								<LetterTile label={resource.title || hostOf(resource.url)} />
								<span class="body">
									<span class="title">{resource.title || hostOf(resource.url)}</span>
									{#if resource.description}
										<span class="description">{resource.description}</span>
									{/if}
									<span class="meta">
										<span class="host">{hostOf(resource.url)}</span>
										{#each resource.tags ?? [] as tag (tag)}
											<span class="tag">{tag}</span>
										{/each}
									</span>
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	{/if}
</div>

<style>
	.resources {
		margin-inline: var(--margin-left);
		margin-top: 6.5rem;
		margin-bottom: 6rem;
	}

	.intro h1 {
		margin: 0 0 0.5rem 0;
	}

	.intro p {
		max-width: 60ch;
		opacity: 0.75;
		margin: 0;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin-block: 2.5rem 2rem;
	}

	input[type='search'] {
		flex: 1 1 18rem;
		padding: 0.75rem 1rem;
		border-radius: 1000px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		background: rgba(255, 255, 255, 0.06);
		color: var(--color);
		font: inherit;
		font-size: 1rem;
	}

	input[type='search']:focus-visible {
		outline: 2px solid var(--primary-color1);
		outline-offset: 2px;
	}

	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip {
		padding: 0.5rem 1rem;
		border-radius: 1000px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.chip:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.chip.active {
		background: linear-gradient(135deg, var(--primary-color1), var(--primary-color2));
		border-color: transparent;
		color: #1a1a1a;
		font-weight: 600;
	}

	.group {
		margin-bottom: 3rem;
	}

	.group h2 {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
	}

	.count {
		font-size: 0.85rem;
		font-weight: 400;
		opacity: 0.5;
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 1rem;
	}

	.card {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		height: 100%;
		padding: 1rem;
		border-radius: 1rem;
		text-decoration: none;
		color: inherit;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.05);
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.card:hover,
	.card:focus-visible {
		transform: translateY(-3px);
		border-color: rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.09);
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-width: 0;
	}

	.title {
		font-weight: 600;
		line-height: 1.3;
	}

	.description {
		font-size: 0.9rem;
		opacity: 0.7;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.15rem;
		font-size: 0.78rem;
		opacity: 0.6;
	}

	.host {
		font-family: 'JetBrains Mono Variable', monospace;
	}

	.tag {
		padding: 0.1rem 0.5rem;
		border-radius: 1000px;
		background: rgba(255, 255, 255, 0.1);
	}

	.empty {
		margin-top: 3rem;
		opacity: 0.6;
	}

	@media (max-width: 768px) {
		.resources {
			margin-inline: 1rem;
			margin-top: 5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}

		.card:hover,
		.card:focus-visible {
			transform: none;
		}
	}
</style>
