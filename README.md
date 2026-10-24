<p align="center">
  <a href="https://github.com/YagnikBarasiya23/marquee-drift"><img src="https://raw.githubusercontent.com/YagnikBarasiya23/marquee-drift/main/media/banner.png" width="800" alt="Marquee Drift, a Wiiby component: a logo marquee that eases under the cursor and turns with your scroll"></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/marquee-drift"><img src="https://img.shields.io/npm/v/marquee-drift.svg?color=1f2a3a" alt="npm version"></a>
  <img src="https://img.shields.io/badge/dependencies-0-1f2a3a.svg" alt="0 dependencies">
  <a href="https://github.com/YagnikBarasiya23/marquee-drift/blob/main/LICENSE"><img src="https://img.shields.io/badge/licence-MIT-1f2a3a.svg" alt="MIT licence"></a>
</p>

A dependency-free logo or text marquee. Studio Current pairs spacious fictional wordmarks with a gentle current that slows on hover and follows scroll direction.

<p align="center">
  <img src="https://raw.githubusercontent.com/YagnikBarasiya23/marquee-drift/main/media/demo-hd.gif" width="800" alt="A row of studio wordmarks drifting sideways, slowing to a crawl under the cursor, with a Pause motion button below.">
</p>

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

The demo includes theme switching, speed and gap controls, and destroy/recreate. Media is in `media/` when generated. Build outputs must remain below 8 KiB gzipped.

[Watch the 10-second demo](https://github.com/YagnikBarasiya23/marquee-drift/blob/main/media/demo.mp4) · [Poster](https://raw.githubusercontent.com/YagnikBarasiya23/marquee-drift/main/media/poster.png) · [Share image](https://raw.githubusercontent.com/YagnikBarasiya23/marquee-drift/main/media/share.png)

## Validation status

Four Node tests pass. All four browser scenarios pass in Chromium and WebKit, including axe scans in both themes. Firefox is configured but its installed browser fails to launch on this machine with `Could not find profile folder`; Firefox compatibility is not yet verified. Hidden-document behavior is tested by dispatching a visibility change with an overridden hidden state; real background-tab scheduling still needs a manual check.
