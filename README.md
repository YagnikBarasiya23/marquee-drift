# Marquee Drift

![MIT license](https://img.shields.io/badge/license-MIT-green)

A dependency-free logo or text marquee. Studio Current pairs spacious fictional wordmarks with a gentle current that slows on hover and follows scroll direction.

## Local development

```sh
npm install
npm run dev
npm test
npm run test:browser
npm run build
npm pack --dry-run
```

Install Playwright browsers with `npx playwright install` if needed. Vite and Playwright are development dependencies only.

## Install and use

```sh
npm install marquee-drift
```

```js
import MarqueeDrift from 'marquee-drift';
import 'marquee-drift/style.css';

const drift = new MarqueeDrift(document.querySelector('.studios'), {
  speed: 28,
  gap: 48,
  pauseOnHover: true,
  direction: 'left',
});
// Restore the original nodes, preserving their identity and handlers:
drift.destroy();
```

```html
<div class="studios" aria-label="Our partner studios">
  <img src="morrow.png" width="160" height="48" alt="Morrow">
  <img src="fieldwork.png" width="160" height="48" alt="Fieldwork">
  <!-- Add enough items to fill the available width. -->
</div>
```

For a script tag, load `dist/marquee-drift.umd.cjs` and construct `new MarqueeDrift.MarqueeDrift(element, options)`. Include `src/style.css` separately. The ESM and UMD bundles contain no runtime dependencies. Browser bundlers should use the package exports.

| Option | Default | Meaning |
| --- | --- | --- |
| `speed` | `28` | Nonnegative finite pixels per second. Zero stops animation. |
| `gap` | `48` | Nonnegative finite spacing in CSS pixels. |
| `pauseOnHover` | `true` | Ease to 15% speed while hovered. The persistent pause button stops completely. |
| `direction` | `'left'` | Initial physical direction: `'left'` or `'right'`. Subsequent vertical scroll direction takes over. |
| `lens` | `false` | Focus lens. `true` or `{ scale, radius, dim }` enlarges items as they pass the centre and fades the strip's edges. |

### Focus lens

```js
new MarqueeDrift(element, { lens: { scale: 1.35, radius: 0.3, dim: 0.4 } });
```

- `scale` (≥ 1, default `1.35`): size of an item at the exact centre.
- `radius` (0–1, default `0.3`): how far the effect reaches either side of centre, as a fraction of the container width.
- `dim` (0–1, default `0.4`): opacity of items outside the lens. Use `1` to turn fading off.

Item centres are measured once per resize, so each frame only writes `transform` and `opacity` on the items. The lens sets these inline on each direct child and restores the original values in static mode and on `destroy()`, so don't put your own `transform` or `opacity` on direct children. The track gets vertical padding so enlarged items aren't clipped. Set `gap` to at least the item width × (`scale` − 1) so neighbours don't overlap. Low `dim` values reduce text contrast, so prefer logo images with the lens, or keep `dim` high for text items.

`destroy()` is safe to call repeatedly. Only one live instance may own an element. To change options or item content, destroy and recreate the instance. Do not mutate the managed DOM while mounted.

## Motion and accessibility

- One visual clone, hidden from assistive technology and marked inert. IDs are removed from cloned descendants.
- A native, persistent pause/resume button works with keyboard and touch.
- Focusing original interactive content switches to a stationary, horizontally scrollable track so every link remains reachable.
- Reduced motion uses the same static presentation and responds to preference changes.
- Zero items, one item, or content narrower than the viewport stays static. There is no repeated filler.
- Offscreen instances and hidden documents stop requesting animation frames. ResizeObserver responds to resizing and late-loading images.
- RTL item order is respected; direction means physical movement regardless of language.
- Supply meaningful image alternatives and reserve image dimensions. Prefer simple noninteractive logo/text items; avoid forms, media players, or custom widgets in the cloned content.

## Support

Modern Chromium, Firefox, and Safari with ResizeObserver, IntersectionObserver, inert, and matchMedia change events. This is a browser component, not a native Flutter widget; a Flutter Web integration would require a DOM interop wrapper. Server-side imports are safe; construct only after the DOM mounts.

## Art and demo

Eight original geometric SVG wordmarks and transparent 2× PNG exports live in `art/`. Their direction and production method are documented in `art/prompts.md`. Run `node scripts/art.js` to regenerate. Fictional names are demonstration content.

The demo includes theme switching, speed and gap controls, a focus lens toggle, and destroy/recreate. Media is in `media/` when generated. Build outputs must remain below 8 KiB gzipped.

[Watch the 10-second demo](media/demo.mp4) · [Poster](media/poster.png) · [Share image](media/share.png)

## Validation status

Six Node tests pass. All five browser scenarios, including the focus lens, pass in Chromium with axe scans in both themes. WebKit passed the original four scenarios; the focus lens scenario has not yet been run in WebKit. Firefox is configured but its installed browser fails to launch on this machine with `Could not find profile folder`; Firefox compatibility is not yet verified. Hidden-document behavior is tested by dispatching a visibility change with an overridden hidden state; real background-tab scheduling still needs a manual check.
