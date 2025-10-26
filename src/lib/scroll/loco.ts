// Locomotive Scroll integration with SSR-guard, mobile optimization, and helpers.
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

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
	if (!browser) return null;

	// Avoid double init
	let current: LocoInstance;
	const unsub = locoStore.subscribe((v) => (current = v));
	unsub();
	if (current) return current!;

	const LocomotiveScroll = (await import('locomotive-scroll')).default;

	const loco = new LocomotiveScroll({
		el: container,
		smooth: !isCoarsePointer() && !prefersReducedMotion(),
		lerp: 0.12, // smoothing strength
		multiplier: 1.0, // scroll speed
		getDirection: true,
		smartphone: { smooth: false },
		tablet: { smooth: false }
	});

	// Refresh on window load and resize
	window.addEventListener('load', () => loco.update(), { passive: true });
	const ro = new ResizeObserver(() => loco.update());
	ro.observe(container);

	// Expose scroll direction as data attribute on <html> for styling if needed
	loco.on('scroll', (args: any) => {
		document.documentElement.setAttribute('data-scroll-direction', args?.direction || 'down');
	});

	locoStore.set(loco);
	return loco;
}

export function destroyLoco() {
	let current: LocoInstance;
	const unsub = locoStore.subscribe((v) => (current = v));
	unsub();
	if (current) {
		current.destroy();
		locoStore.set(null);
	}
}

export function refreshLoco() {
	let current: LocoInstance;
	const unsub = locoStore.subscribe((v) => (current = v));
	unsub();
	current?.update();
}

// Svelte action to bind Locomotive to a container
export function useLoco(node: HTMLElement) {
	initLoco(node);

	return {
		destroy() {
			destroyLoco();
		}
	};
}

export function scrollTo(target: number | string | HTMLElement, options?: any) {
	let current: LocoInstance;
	const unsub = locoStore.subscribe((v) => (current = v));
	unsub();
	current?.scrollTo(target as any, options);
}
