// Locomotive Scroll integration with SSR-guard, mobile optimization, and helpers.
import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

export type LocoInstance = import('locomotive-scroll').default | null;
export const locoStore = writable<LocoInstance>(null);

function isCoarsePointer() {
	if (!browser) return false;
	return window.matchMedia?.('(pointer: coarse)').matches ?? false;
}

function prefersReducedMotion() {
	if (!browser) return false;
	return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export async function initLoco(container: HTMLElement) {
	if (!browser) {
		return null;
	}

	// Avoid double init
	const current = get(locoStore);
	if (current) {
		return current;
	}
	const LocomotiveScroll = (await import('locomotive-scroll')).default;

	const loco = new LocomotiveScroll({
		el: container,
		smooth: true, // Always enable smooth scroll for better animation detection
		lerp: 0.12, // smoothing strength
		multiplier: 1.0, // scroll speed
		getDirection: true,
		smartphone: { smooth: false },
		tablet: { smooth: false },
		class: 'is-inview', // class to add when element is in view
		repeat: false, // don't repeat animations
		reloadOnContextChange: true
	});

	// Refresh on window load and resize
	window.addEventListener('load', () => {
		loco.update();
	}, { passive: true });
	const ro = new ResizeObserver(() => {
		loco.update();
	});
	ro.observe(container);

	// Expose scroll direction as data attribute on <html> for styling if needed
	loco.on('scroll', (args: { direction?: string }) => {
		document.documentElement.setAttribute('data-scroll-direction', args?.direction || 'down');
	});

	locoStore.set(loco);
	return loco;
}

export function destroyLoco() {
	const current = get(locoStore);
	if (current) {
		current.destroy();
		locoStore.set(null);
	}
}

export function refreshLoco() {
	const current = get(locoStore);
	current?.update();
}

// Svelte action to bind Locomotive to a container
export function useLoco(node: HTMLElement) {
	let instance: LocoInstance = null;

	// Initialize after a small delay to ensure DOM is ready
	setTimeout(async () => {
		instance = await initLoco(node);
		// Force an update after initialization
		setTimeout(() => {
			instance?.update();
		}, 100);
	}, 0);

	return {
		destroy() {
			destroyLoco();
		}
	};
}

export function scrollTo(target: number | string | HTMLElement, options?: Record<string, unknown>) {
	const current = get(locoStore);
	if (current && typeof current.scrollTo === 'function') {
		current.scrollTo(target as Parameters<typeof current.scrollTo>[0], options);
	}
}
