<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import type { IRepo } from '$lib/types';
	import { afterNavigate } from '$app/navigation';
	export let data;

	// Data now comes directly from server load function
	const repo = data as IRepo;

	// #app is the scroll container rather than the window, so SvelteKit's own
	// scroll handling does not reset it — clicking through from the homepage
	// used to land here still scrolled down.
	//
	// This used to call scrollIntoView() on the card, which aligns the card's
	// top with the top of the container and so scrolls the nav clearance out of
	// view. Resetting the container to 0 keeps that clearance visible.
	afterNavigate(() => {
		document.getElementById('app')?.scrollTo({ top: 0, behavior: 'instant' });
	});
</script>

<svelte:head>
	<title>{repo.customTitle || repo.name} · Tom Freeman</title>
	<meta name="description" content={repo.summary ?? `The ${repo.name} project.`} />
</svelte:head>

<main class="wrapper">
	<a href="/" class="return"><span class="arrow" aria-hidden="true">←</span>back to home</a>
	<h1>// {repo.name}</h1>
	<div class="link-list">
		{#each repo.externalLinks || [] as link (link.id)}
			<a
				href={link.url}
				class="link-button external-link {link.type === 'preview' ? 'preview-link' : ''}"
				target="_blank"
				rel="noopener noreferrer"
				title={link.name}
				aria-label={link.name}
				data-label={link.name}
			>
				{#if link.type === 'preview'}
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 576 512"
						height="24"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256c0-79.5 64.5-144 144-144s144 64.5 144 144-64.5 144-144 144-144-64.5-144-144zm144-64c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z"
						/>
					</svg>
				{:else if link.type === 'docs'}
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 384 512"
						height="24"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"
						/>
					</svg>
				{:else if link.type === 'demo'}
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 512 512"
						height="24"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"
						/>
					</svg>
				{:else}
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 640 512"
						height="24"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
						/>
					</svg>
				{/if}
			</a>
		{/each}

		<a
			href={repo.url}
			class="link-button github-link"
			target="_blank"
			rel="noopener noreferrer"
			title="Source on GitHub"
			aria-label="Source on GitHub"
			data-label="GitHub"
		>
			<svg
				stroke="currentColor"
				fill="currentColor"
				stroke-width="0"
				viewBox="0 0 496 512"
				height="24"
				width="24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
				/>
			</svg>
		</a>
	</div>
	{#if repo.stack}
		<details open>
			<summary>Stack</summary>
			<ul>
				{#each repo.stack as stackElement (stackElement)}
					<mark>{stackElement}</mark>
				{/each}
			</ul>
		</details>
	{/if}
	{#if repo.description}
		<div class="description-wrapper">
			<SvelteMarkdown source={repo.description} />
		</div>
	{/if}
</main>

<style>
	a.return {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		/* negative inline margin keeps the text aligned with the heading while
		   giving the pill some padding to live in on hover */
		margin-inline-start: -0.6rem;
		padding: 0.35rem 0.6rem;
		border-radius: 999px;
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 0.9rem;
		color: rgb(209, 209, 209);
		opacity: 0.7;
		transition:
			opacity 0.3s ease,
			background-color 0.3s ease;
	}

	a.return .arrow {
		display: inline-block;
		transition: transform 0.3s var(--ease-out, ease);
	}

	a.return:hover,
	a.return:focus-visible {
		opacity: 1;
		background-color: rgba(255, 255, 255, 0.06);
	}

	a.return:hover .arrow,
	a.return:focus-visible .arrow {
		transform: translateX(-3px);
	}

	a.return:focus-visible {
		outline: 2px solid var(--primary-color1);
		outline-offset: 2px;
	}

	main.wrapper {
		/* relative only so .link-list can position against this card — it must
		   not carry a `top` offset, which paints the card below its layout box
		   and leaves that much empty scroll at the bottom of the page. */
		position: relative;
		margin-inline: 5rem;
		/* same clearance under the fixed pill nav as every other page */
		margin-top: var(--content-top);
		margin-bottom: 2.5rem;
		padding: 5rem;
		background-color: var(--background-color);
		max-width: 100vw;
		border-radius: 1rem;
	}

	main.wrapper > :not(a.return):not(h1):not(div.link-list):not(.description-wrapper) {
		font-family: 'JetBrains Mono Variable';
		padding: 1rem 0rem 0rem 1rem;
	}

	div.link-list {
		position: absolute;
		right: 3rem;
		top: 3rem;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: center;
		flex-wrap: nowrap;
	}

	.link-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		padding: 12px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		backdrop-filter: blur(10px);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-decoration: none;
		color: rgba(255, 255, 255, 0.9);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.link-button:hover,
	.link-button:focus-visible {
		transform: translateY(-2px) scale(1.05);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
		color: white;
	}

	.link-button:focus-visible {
		outline: 2px solid var(--primary-color1);
		outline-offset: 3px;
	}

	/* The buttons are icon-only, so show their name underneath on hover/focus.
	   The <a> already carries aria-label; this label is purely visual. */
	.link-button {
		position: relative;
	}

	.link-button::after {
		content: attr(data-label);
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 50%;
		translate: -50% -4px;
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
		background: rgba(20, 20, 20, 0.92);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.9);
		font-family: 'JetBrains Mono Variable', monospace;
		font-size: 0.7rem;
		line-height: 1.2;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.2s ease,
			translate 0.2s ease;
	}

	.link-button:hover::after,
	.link-button:focus-visible::after {
		opacity: 1;
		translate: -50% 0;
	}

	.link-button svg {
		transition: all 0.3s ease;
	}

	.github-link:hover {
		background: linear-gradient(135deg, rgba(33, 33, 33, 0.9), rgba(51, 51, 51, 0.8));
		border-color: rgba(255, 255, 255, 0.3);
		box-shadow:
			0 8px 25px rgba(0, 0, 0, 0.3),
			0 0 20px rgba(33, 33, 33, 0.4);
	}

	.github-link:hover svg {
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
	}

	.preview-link:hover svg {
		filter: drop-shadow(0 0 8px rgba(72, 189, 255, 0.6));
	}

	.external-link:hover {
		background: linear-gradient(135deg, var(--primary-color1), var(--primary-color2));
		border-color: rgba(255, 138.747, 0, 0.5);
		box-shadow:
			0 8px 25px rgba(255, 138.747, 0, 0.3),
			0 0 20px rgba(255, 138.747, 0, 0.2);
	}

	.external-link:hover svg {
		filter: drop-shadow(0 0 8px rgba(255, 138.747, 0, 0.6));
	}

	.preview-link:hover {
		background: linear-gradient(135deg, var(--secondary-color1), var(--secondary-color2));
		border-color: rgba(72, 189, 255, 0.5);
		box-shadow:
			0 8px 25px rgba(0, 121, 255, 0.3),
			0 0 20px rgba(0, 121, 255, 0.2);
	}

	.preview-link:hover svg {
		filter: drop-shadow(0 0 8px rgba(72, 189, 255, 0.6));
	}

	.external-link:hover svg {
		filter: drop-shadow(0 0 8px rgba(255, 138.747, 0, 0.6));
	}

	ul {
		list-style: none;
		margin-left: 0px;
		display: flex;
		flex-wrap: wrap;
		margin-top: 0px;
	}

	mark {
		margin-inline: 0.5rem;
		margin-top: 1rem;
	}

	.description-wrapper {
		margin-top: 2rem;
		padding: 1rem;
		line-height: 1.6;
	}

	/* Links inside the CMS markdown. The global stylesheet strips colour and
	   underline from every <a>, which left these indistinguishable from body
	   text. :global() is needed because svelte-markdown renders them outside
	   this component's scope. */
	.description-wrapper :global(a) {
		color: var(--primary-color2);
		font-weight: 500;
		text-decoration: underline;
		text-decoration-color: rgba(249, 220, 0, 0.35);
		text-decoration-thickness: 1.5px;
		text-underline-offset: 0.2em;
		overflow-wrap: anywhere;
		border-radius: 3px;
		transition:
			color 0.2s ease,
			text-decoration-color 0.2s ease;
	}

	.description-wrapper :global(a:hover) {
		color: var(--primary-color1);
		text-decoration-color: currentColor;
	}

	.description-wrapper :global(a:focus-visible) {
		outline: 2px solid var(--primary-color1);
		outline-offset: 2px;
	}

	/* small outward arrow on links that leave the site */
	.description-wrapper :global(a[href^='http']:not([href*='thomas-freeman']))::after {
		content: '\2197';
		display: inline-block;
		margin-left: 0.2em;
		font-size: 0.75em;
		opacity: 0.6;
		text-decoration: none;
		transition: transform 0.2s var(--ease-out, ease);
	}

	.description-wrapper :global(a[href^='http']:not([href*='thomas-freeman']):hover)::after {
		transform: translate(1px, -1px);
	}

	@media (max-width: 768px) {
		main.wrapper {
			margin-inline: 0rem;
			/* full-bleed card here, so it starts flush with the top */
			margin-top: 0;
			margin-bottom: 2rem;
			padding: 2rem;
			padding-bottom: 5rem; /* Add space for bottom navigation */
		}

		div.link-list {
			top: 1.25rem;
			right: 1.25rem;
			flex-wrap: nowrap;
			gap: 0.5rem;
		}

		.link-button {
			width: 32px;
			height: 32px;
			padding: 6px;
			flex-shrink: 0;
		}

		.link-button svg {
			height: 18px;
			width: 18px;
		}

		.link-button::after {
			display: none;
		}

		h1 {
			font-size: xx-large;
		}
	}
</style>
