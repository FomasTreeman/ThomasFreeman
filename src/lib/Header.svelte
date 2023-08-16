<script lang="ts">
	import scrollIntoView from './utils/scroll';
	import { fly, fade } from 'svelte/transition';
	import Globe from './Globe.svelte';
	import { onMount } from 'svelte';
	let nav = false;
	let hasNavBeenClicked = false;
	let showPrompt = false;
	let innerWidth: number;
	$: isSmallScreen = innerWidth < 1000;
	$: if (nav === true) hasNavBeenClicked = true;
	$: if (showPrompt === true && nav === true) showPrompt = false;

	onMount(() => {
		setTimeout(() => {
			if (hasNavBeenClicked === false) showPrompt = true;
		}, 7500);
	});
</script>

<input id="nav-checkbox" type="checkbox" class="globe-wrapper" bind:checked={nav} />
<label for="nav-checkbox" class="globe-wrapper">
	<Globe />
	{#if showPrompt}
		<h1 transition:fade class="prompt">Click me!</h1>
	{/if}
</label>
{#if nav}
	<div transition:fade class="blur-screen" on:click={() => (nav = false)} />
	<div
		class="flex horizon links"
		in:fade={{ delay: isSmallScreen ? 1000 : 0 }}
		out:fade={{ duration: 200 }}
	>
		<a class="card" href="#about" on:click|preventDefault={scrollIntoView}> About Me </a>
		<a class="card" href="#project" on:click|preventDefault={scrollIntoView}> Betting Bot </a>
		<a class="card" href="#readmes" on:click|preventDefault={scrollIntoView}> Projects </a>
	</div>
	<span
		class="flex col vertical contact"
		in:fade={{ delay: isSmallScreen ? 1000 : 0 }}
		out:fade={{ duration: 200 }}
	>
		<a href="https://fac-portfolio.vercel.app/">
			<img loading="lazy" src="/contact/fac.svg" alt="FAC" />
		</a>
		<a href="https://github.com/FomasTreeman">
			<img loading="lazy" style="filter: invert(1)" src="/contact/github.png" alt="github" />
		</a>
		<a href="https://www.linkedin.com/in/fomas-treeman/">
			<img loading="lazy" src="/contact/linkedin.png" alt="linkedin" />
		</a>
		<a href="mailto: tom@team-freeman.com">
			<img loading="lazy" src="/contact/gmail.png" alt="gmail" />
		</a>
	</span>
{/if}

<svelte:window bind:innerWidth />

<!-- <a href="https://www.flaticon.com/free-icons/linkedin" title="linkedin icons"
  >Linkedin icons created by Flaticon</a
> -->

<style>
	.globe-wrapper {
		position: fixed;
		right: 0px;
		top: 0px;
		width: 5rem;
		height: 5rem;
		background-color: transparent;
		margin: 1rem;
		padding: 0px;
		border: none;
		border-radius: 50%;
		transition: all 1s;
		z-index: 51;
	}

	input[type='checkbox'] {
		appearance: none;
		z-index: 101;
	}
	input[type='checkbox']:checked + label.globe-wrapper {
		scale: 1.1;
	}

	input[type='checkbox']:hover + label.globe-wrapper {
		box-shadow: 0px 0px 4px 4px rgba(24, 71, 239, 0.3);
	}

	div.blur-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 110%;
		height: 110%;
		filter: blur(2px);
		background: #000;
		opacity: 0.3;
		transition: all 1s;
		z-index: 45;
	}

	h1.prompt {
		font-size: 1rem;
		margin: 0px;
		width: 100%;
		text-align: center;
		position: absolute;
		top: calc(50% - 1.5ex);
		animation: wiggle 1.5s infinite;
	}

	@keyframes wiggle {
		0% {
			transform: rotate(0deg);
		}
		80% {
			transform: rotate(0deg);
		}
		85% {
			transform: rotate(10deg);
		}
		95% {
			transform: rotate(-10deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}

	span.contact {
		position: fixed;
		top: 0px;
		right: 0px;
		z-index: 50;
	}

	div.links {
		position: fixed;
		top: 0px;
		right: 0px;
		z-index: 50;
		margin-right: 8.5rem;
		height: 7rem;
	}

	div.links > * {
		margin-bottom: 2rem;
	}

	.flex {
		display: flex;
		justify-content: end;
		align-items: end;
		gap: 5%;
	}

	.col {
		flex-direction: column;
	}

	.vertical {
		margin-top: 7.5rem;
	}

	.card {
		padding-block: 0.7rem;
		padding-inline: 1rem;
		width: fit-content;
		height: fit-content;
		background-color: var(--background-color);
		border-radius: 2rem;
		font-size: x-large;
		text-transform: uppercase;
		font-weight: 800;
		text-align: center;
		box-shadow: 10px 10px 0px 0px var(--link-color);
		white-space: nowrap;
		transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	a {
		color: var(--link-color);
	}

	a img {
		width: 2.5rem;
		margin-inline: 2.3rem;
		margin-block: 0.7rem;
	}

	a.card:hover {
		transform: scale(1.1);
		transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1);
		color: var(--link-color-hover);
	}

	a.card:hover ~ a.card,
	a.card:has(~ :hover) {
		opacity: 0.8;
	}

	@media (max-width: 1000px) {
		div.blur-screen {
			z-index: 45 !important;
		}

		input[type='checkbox'] {
			z-index: 51 !important;
		}

		input[type='checkbox']:checked ~ label.globe-wrapper,
		input[type='checkbox']:checked {
			width: 300px;
			height: 300px;
			position: fixed;
			top: 50%;
			right: 50%;
			margin: 1rem;
			transform: translate(50%, -50%);
			transition: all 1s;
		}
		input[type='checkbox']:checked {
			width: 330px;
			height: 330px;
			margin: 0px;
		}

		.contact {
			position: fixed;
			top: 50% !important;
			right: calc(50% - 150px) !important;
			transform: translateY(-50%);
			z-index: 51 !important;
			margin: 0px !important;
		}

		.contact img {
			margin-inline: 0px;
		}

		.contact > :nth-child(1) {
			transform: rotate(313deg);
			padding-right: 42px;
		}
		.contact > :nth-child(2) {
			transform: rotate(338deg);
			padding-right: 13px;
		}
		.contact > :nth-child(3) {
			transform: rotate(9deg);
			padding-right: 3px;
		}
		.contact > :nth-child(4) {
			transform: rotate(43deg);
			padding-right: 32px;
		}

		.links {
			position: fixed;
			top: 50% !important;
			right: inherit !important;
			left: calc(50% - 150px) !important;
			transform: translateY(-50%);
			flex-direction: column;
			justify-content: center;
			gap: 0.5rem;
			z-index: 51 !important;
			margin: 0px !important;
		}

		.links * {
			margin: 0px;
			margin-block: 0.5rem !important;
		}
	}
</style>
