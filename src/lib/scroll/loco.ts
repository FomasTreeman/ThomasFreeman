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
		console.log('[Loco] Not in browser, skipping init');
		return null;
	}

	// Avoid double init
	const current = get(locoStore);
	if (current) {
		console.log('[Loco] Already initialized, returning existing instance');
		return current;
	}

	console.log('[Loco] Initializing Locomotive Scroll on container:', container);
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

	console.log('[Loco] Locomotive Scroll initialized successfully');

	// Debug: log detected scroll elements
	setTimeout(() => {
		const scrollSections = container.querySelectorAll('[data-scroll-section]');
		const scrollElements = container.querySelectorAll('[data-scroll]');
		console.log('[Loco] Detected sections:', scrollSections.length, scrollSections);
		console.log('[Loco] Detected scroll elements:', scrollElements.length, scrollElements);

		// Log when elements get is-inview class
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					const target = mutation.target as HTMLElement;
					if (target.classList.contains('is-inview')) {
						console.log('[Loco] Element entered view:', target);
					}
				}
			});
		});

		scrollElements.forEach((el) => {
			observer.observe(el, { attributes: true, attributeFilter: ['class'] });
		});
	}, 500);

	// Refresh on window load and resize
	window.addEventListener('load', () => {
		console.log('[Loco] Window loaded, updating scroll');
		loco.update();
	}, { passive: true });
	const ro = new ResizeObserver(() => {
		console.log('[Loco] Resize detected, updating scroll');
		loco.update();
	});
	ro.observe(container);

	// Expose scroll direction as data attribute on <html> for styling if needed
	loco.on('scroll', (args: any) => {
		document.documentElement.setAttribute('data-scroll-direction', args?.direction || 'down');
	});

	// Debug: log when elements enter viewport
	loco.on('call', (func: any, way: any, obj: any) => {
		console.log('[Loco] Element callback:', { func, way, obj });
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
			console.log('[Loco] Forcing initial update after mount');
			instance?.update();
		}, 100);
	}, 0);

	return {
		destroy() {
			destroyLoco();
		}
	};
}

export function scrollTo(target: number | string | HTMLElement, options?: any) {
	const current = get(locoStore);
	current?.scrollTo(target as any, options);
}
