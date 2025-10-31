// Splits text content into spans to allow staggered reveal animations.
export type SplitMode = 'word' | 'char';

export function splitText(node: HTMLElement, mode: SplitMode = 'word') {
	const original = node.textContent ?? '';
	node.setAttribute('aria-label', original);
	node.textContent = '';

	const parts = mode === 'word' ? original.split(/(\s+)/) : Array.from(original);

	parts.forEach((part, i) => {
		const span = document.createElement('span');
		span.textContent = part;
		span.style.display = 'inline-block';
		span.style.transition =
			'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)';
		span.style.transform = 'translateY(1em)';
		span.style.opacity = '0';
		// Stagger via CSS variable
		span.style.transitionDelay = `${i * 40}ms`;
		node.appendChild(span);
	});

	// When the wrapper gets is-inview, reveal children
	const obs = new MutationObserver((mutations) => {
		mutations.forEach((m) => {
			if (m.attributeName === 'class' && node.classList.contains('is-inview')) {
				node.querySelectorAll('span').forEach((el) => {
					(el as HTMLElement).style.transform = 'translateY(0)';
					(el as HTMLElement).style.opacity = '1';
				});
			}
		});
	});
	obs.observe(node, { attributes: true });

	return {
		destroy() {
			obs.disconnect();
			node.textContent = original;
		}
	};
}
