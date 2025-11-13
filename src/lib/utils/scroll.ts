interface ScrollIntoViewOptions {
  target: HTMLElement;
}

/**
 * Scrolls the page to the specified target element.
 *
 * @param options - The options object.
 * @param options.target - The target element containing an href attribute to scroll to.
 */
export default function scrollIntoView({ target }: ScrollIntoViewOptions): void {
  const href = target.getAttribute('href');
  if (!href) return;
  
  const el = document.querySelector(href);
  if (!el) return;
  
  el.scrollIntoView({
    behavior: 'smooth',
  });
}
