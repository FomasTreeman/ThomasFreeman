
<script lang="ts">
	/// TODO :
	/// 1. Add a scroll event listener to the window object to update the indicator position

	import { onMount } from 'svelte';

	let BASE_URL: string;
	let navItems: NodeListOf<Element>;
	let indicator: HTMLElement | null;
	let activeIndex = 0;

	function scrollToElement(event: MouseEvent, elementId: string) {
		event.preventDefault();
		const element = document.getElementById(elementId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function setIndicatorPosition(index: number) {
		const activeItem = navItems[index];
		const itemRect = activeItem.getBoundingClientRect();
		const navRect = activeItem.parentElement?.parentElement?.getBoundingClientRect() || { left: 0 };
		const itemLeft = itemRect.left - navRect.left;

		const itemWidth = itemRect.width;

		if (indicator !== null) {
			indicator.style.width = `${itemWidth}px`;
			indicator.style.left = `${itemLeft}px`;
			indicator.style.display = `block`;
		}
	}

	function adjustIndicator(event: MouseEvent) {
		const item = event.currentTarget as HTMLAnchorElement;
		navItems.forEach((nav) => nav.classList.remove('active'));
		item.classList.add('active');
		const index = Array.from(navItems).indexOf(item);
		activeIndex = index; // Update the active index
		setIndicatorPosition(index);
		const href = item.href;
		const windowHref = window.location.href;
		if (!href) return;
		const indexOfHash = href.indexOf('#') + 1;
		const indexOfHashHome = windowHref.indexOf('#') + 1;
		console.log(href.slice(0, indexOfHash), window.location.href);
		if (href.slice(0, indexOfHash) === windowHref.slice(0, indexOfHashHome)) {
			scrollToElement(event, href.substring(indexOfHash));
		}
	}

	onMount(() => {
		navItems = document.querySelectorAll('nav li > a');
		indicator = document.querySelector('.indicator');
		BASE_URL = window.location.origin;
		setIndicatorPosition(activeIndex); // Set initial position
	});
</script>

<nav>
	<ul>
		<li>
			<a data-index="0" href={`${BASE_URL}/#about`} on:click={adjustIndicator}>
				Home
			</a>
		</li>
		<li>
			<a data-index="0" href={`${BASE_URL}/#project`} on:click={adjustIndicator}>
				About
			</a>
		</li>
		<li>
			<a data-index="0" href={`${BASE_URL}/#readmes`} on:click={adjustIndicator}>
				Projects
			</a>
		</li>
		<div class="indicator" />
	</ul>
</nav>

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
	}

	.indicator {
		background: rgba(39, 39, 39, 0.6);
		position: absolute;
		bottom: 0.7rem;
		left: 0;
		height: 1.5rem;
		padding-block: 0.4rem;
		padding-inline: 1.3rem;
		border-radius: 1000px;
		transition: all 0.3s ease;
		display: none;
		z-index: -1;
		translate: -1.3rem;
	}
</style>
