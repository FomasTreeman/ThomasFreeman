<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { page } from '$app/stores';
	import ScrollObserver from './ScrollObserver.svelte';

	let BASE_URL: string;
	let lastWheelTime = 0;
	let activeIndex = 0;
	let menuOffset = spring(2.3, {
		stiffness: 0.1,
		damping: 1
	});
	let pauseIO = false;

	let homeItems = [
		{ id: 'home', text: 'Home' },
		{ id: 'about', text: 'About' },
		{ id: 'projects', text: 'Projects' }
	];

	function scrollMenu(direction: 'up' | 'down') {
		pauseIO = true;
		const newIndex = direction === 'up' ? activeIndex - 1 : activeIndex + 1;
		if (newIndex >= 0 && newIndex < homeItems.length) {
			activeIndex = newIndex;
			menuOffset.set(2.3 - activeIndex * 2.3);
			scrollToElement(homeItems[newIndex].id);
		}
		setTimeout(() => {
			pauseIO = false;
		}, 400);
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();

		const now = Date.now();
		const timeSinceLastWheel = now - lastWheelTime;

		if (timeSinceLastWheel < 125) return;

		lastWheelTime = now;

		if (Math.abs(event.deltaY) > 50) {
			if (event.deltaY > 0 && activeIndex < homeItems.length - 1) {
				scrollMenu('down');
			} else if (event.deltaY < 0 && activeIndex > 0) {
				scrollMenu('up');
			}
		}
	}

	function scrollToElement(id: string) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	onMount(() => {
		BASE_URL = window.location.origin;
	});

	$: {
		menuOffset.set(2.3 - activeIndex * 2.3);
	}

	$: currentPath = $page.url.pathname;

	function updateActiveIndex(index: number) {
		activeIndex = index;
	}
	
</script>

<nav>
	<ul>
		<li class="home-items" class:active={currentPath === '/'} on:wheel|preventDefault={handleWheel}>
			<div class="menu-container" style="transform: translateY({$menuOffset}rem)">
				{#each homeItems as item, i}
					<a
						data-index={i}
						href={`${BASE_URL}/#${item.id}`}
						on:click={(e) => {
							if (
								window.location.href.split('/')[3].includes('#') ||
								window.location.href.split('/')[3] == '' ||
								window.location.href.split('/').length == 3
							) {
								e.preventDefault();
							}
							pauseIO = true;
							activeIndex = i;
							scrollToElement(item.id);
							setTimeout(() => {
								pauseIO = false;
							}, 400);
						}}
						class:active={activeIndex === i}
					>
						{item.text}
					</a>
				{/each}
			</div>
			{#if currentPath === '/'}
				<button class="scroll-arrow up" on:click={() => scrollMenu('up')} title="Scroll Up" class:hidden={activeIndex === 0}>▲</button>
				<button class="scroll-arrow down" on:click={() => scrollMenu('down')} title="Scroll Down" class:hidden={activeIndex === homeItems.length - 1}>▼</button>
			{/if}
		</li>
		<!-- <li class:active={currentPath === '/blogs'}>
			<a href="/blogs">Blogs</a>
		</li> -->
		<li class:active={currentPath === '/game'}>
			<a href={`/play`}> Play </a>
		</li>
	</ul>
</nav>

{#if currentPath === '/'}
	<ScrollObserver onSectionChange={updateActiveIndex} pauseIO={pauseIO} />
{/if}

<style>
	nav {
		position: fixed;
		top: 0;
		z-index: 50;
		width: 100%;
	}

	ul {
		position: relative;
		list-style-type: none;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-block: 0.7rem;
		gap: 1rem;
		width: fit-content;
		margin-inline: auto;
		padding-inline: 0.8rem;
		background: rgba(1, 1, 1, 0.6);
		backdrop-filter: blur(20px) saturate(1.7);
		border-radius: 1000px;
	}

	li {
		padding-block: 0.4rem;
		padding-inline: 1.3rem;
		border-radius: 1000px;
		transition: background-color 0.3s ease;
		width: 6ch;
		text-align: center;
		height: 2.3rem;
	}

	li:not(.home-items) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	li.active {
		background: rgba(255, 255, 255, 0.1);
	}

	li.home-items {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: visible;
		cursor: ns-resize;
	}

	.menu-container {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		width: 100%;
		z-index: 2;
	}

	li.home-items a {
		height: 2.3rem;
		width: 100%;
		text-align: center;
		transition: opacity 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		min-width: 5ex;
		pointer-events: all;
		opacity: 0;
	}

	li.home-items:hover a {
		opacity: 0.6;
		text-shadow: 0 0 5px rgba(32, 32, 32, 0.5);
	}

	li.home-items a.active {
		opacity: 1;
	}

	.scroll-arrow {
		position: absolute;
		font-size: 0.7rem;
		opacity: 0.2;
		transition: all 0.3s ease;
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 0;
		width: 1.5rem;
		height: 1.15rem;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
		right: -1.5rem;
	}

	.scroll-arrow.up {
		top: 0.5rem;
	}

	.scroll-arrow.down {
		top: 1.5rem;
	}

	.scroll-arrow.hidden {
		opacity: 0;
		pointer-events: none;
	}

	@media (max-width: 768px) {
		ul {
			gap: 0;
		}
		nav {
			top: auto;
			bottom: 0;
		}
	}
</style>
