# Locomotive Scroll - Effects Guide

This document explains all the scroll effects available in this project using Locomotive Scroll.

## Quick Reference

### Reveal Effects (CSS Classes)

Add these classes to elements with `data-scroll` to trigger animations when they enter the viewport:

- **`.reveal-up`** - Slides up and fades in
- **`.reveal-fade`** - Simple fade in
- **`.reveal-scale`** - Scales up from 92% to 100% with fade
- **`.reveal-rotate`** - Rotates and slides up simultaneously

### Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-scroll` | - | Required on all animated elements |
| `data-scroll-section` | - | Required on each major section wrapper |
| `data-scroll-speed` | number | Parallax speed: negative = slower, positive = faster |
| `data-scroll-repeat` | `true` | Re-triggers animation on scroll up |
| `data-scroll-sticky` | - | Makes element sticky during scroll |
| `data-scroll-target` | `#id` | Target element for sticky duration |
| `data-scroll-direction` | `horizontal` | Enables horizontal movement on vertical scroll |

## Effect Examples

### 1. Basic Reveal (Slide Up)

```svelte
<div data-scroll class="reveal-up">
  <h2>This slides up when scrolled into view</h2>
</div>
```

### 2. Parallax Background

```svelte
<section data-scroll-section style="position: relative; overflow: hidden;">
  <!-- Background moves slower than scroll (-3 speed) -->
  <div
    class="parallax-bg"
    data-scroll
    data-scroll-speed="-3"
    style="background-image: url('/bg.jpg')"
  />
  <h1 data-scroll class="reveal-up">Content</h1>
</section>
```

**Speed Guide:**
- `-5 to -1`: Moves slower (background effect)
- `0`: Normal scroll speed
- `1 to 5`: Moves faster (foreground effect)

### 3. Staggered List Animation

```svelte
<ol class="stagger">
  {#each items as item, i}
    <li data-scroll class="reveal-up" style="--i: {i}">
      {item.title}
    </li>
  {/each}
</ol>
```

The `.stagger` class applies incremental delays using CSS variable `--i`.

### 4. Sticky Element

```svelte
<section data-scroll-section style="position: relative; min-height: 180vh;">
  <!-- This stays pinned while scrolling through the section -->
  <div data-scroll data-scroll-sticky data-scroll-target="#sticky-target">
    <h1>I'm sticky!</h1>
  </div>
  
  <!-- Height controls how long the sticky element stays pinned -->
  <div id="sticky-target" style="position: relative; height: 120vh;"></div>
</section>
```

### 5. Text Reveal (Word by Word)

```svelte
<script>
  import { splitText } from '$lib/scroll/splitText';
</script>

<h1 data-scroll use:splitText={'word'}>
  This text reveals word by word
</h1>
```

Use `'char'` mode for character-by-character reveals.

### 6. Horizontal Scroll Gallery

```svelte
<section data-scroll-section class="h-scroll-container">
  <div
    class="h-track"
    data-scroll
    data-scroll-direction="horizontal"
    data-scroll-speed="6"
  >
    {#each images as img}
      <img src={img} alt="" />
    {/each}
  </div>
</section>
```

### 7. Scale Cards on Scroll

```svelte
{#each cards as card, i}
  <article
    data-scroll
    data-scroll-repeat="true"
    class="reveal-scale"
    style="--i: {i}; transition-delay: calc(var(--i) * 80ms);"
  >
    <h3>{card.title}</h3>
  </article>
{/each}
```

### 8. Multiple Speed Layers (Depth Effect)

```svelte
<section data-scroll-section>
  <div data-scroll data-scroll-speed="-4" style="position: absolute;">
    Far background layer
  </div>
  <div data-scroll data-scroll-speed="-2">
    Mid layer
  </div>
  <div data-scroll data-scroll-speed="1">
    Foreground (faster than scroll)
  </div>
</section>
```

## Mobile Considerations

- Smooth scrolling is **automatically disabled** on mobile (coarse pointers)
- Effects still trigger via `.is-inview` class
- Use lower speeds on mobile (avoid `> 3`)
- Test horizontal galleries for usability

## Performance Tips

1. Use `.gpu` class for hardware acceleration:
   ```svelte
   <div data-scroll class="reveal-up gpu">
   ```

2. Limit `will-change` to animated elements only (already in CSS)

3. Avoid animating `width`, `height`, `top`, `left` - use `transform` and `opacity`

4. Call `refreshLoco()` after DOM mutations:
   ```ts
   import { refreshLoco } from '$lib/scroll/loco';
   // After images load or content changes
   refreshLoco();
   ```

## Accessibility

- `prefers-reduced-motion` is respected automatically
- All animations disable when user has reduced motion enabled
- Split text preserves original content via `aria-label`

## Custom CSS Variables

Defined in `app.css`:

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur: 700ms;
  --reveal-distance: 40px;
  --rotate-deg: 8deg;
  --scale-from: 0.92;
}
```

Adjust these to customize animation feel globally.

## Troubleshooting

**Animations not triggering?**
- Ensure parent has `data-scroll-section`
- Element must have `data-scroll` attribute
- Check console for Locomotive errors

**Sticky not working?**
- Target element must be a sibling or ancestor
- Parent section needs `position: relative`
- Target height controls sticky duration

**Performance issues?**
- Reduce number of parallax elements
- Lower scroll speeds
- Check for layout thrashing in DevTools
