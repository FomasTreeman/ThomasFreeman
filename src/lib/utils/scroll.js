/**
 * Scrolls the page to the specified target element.
 *
 * @param {Object} options - The options object.
 * @param {any} options.target - The target element to scroll to.
 * @return {void} This function does not return anything.
 */
export default function scrollIntoView({ target }) {
  const el = document.querySelector(target.getAttribute('href'));

  if (!el) return;
  el.scrollIntoView({
    behavior: 'smooth',
  });
}
