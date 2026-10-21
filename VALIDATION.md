# Validation — 2026-10-17

## Focus lens update — 2026-10-21

- Node unit tests: 6 passed (adds focus curve and lens option validation).
- Chromium: 5 scenarios passed, including the new focus lens scenario (centre scaling, reduced-motion reset, destroy restores inline styles, demo toggle).
- WebKit: not run for this update; the installed Playwright WebKit build was unavailable in the validation environment.
- Production build: ESM 2,390 bytes gzip; UMD 2,329 bytes gzip, below 8 KiB.

## Initial release

- Selected Studio Current implemented locally.
- Node unit tests: 4 passed.
- Chromium and WebKit: 4 scenarios per browser passed, including axe scans in light/dark themes, 320px viewport, zero/one/short/full content, default and custom options, focus, RTL, pause/resume, reduced motion, reverse scroll, hover easing, size changes and destroy/recreate.
- Visibility event handling checked with simulated document.hidden; real OS tab switching remains manual validation.
- Firefox: installed binary cannot start (`Could not find profile folder`), even with canonical TMPDIR. No Firefox compatibility claim.
- Production build: ESM 1,835 bytes gzip; UMD 1,845 bytes gzip, below 8 KiB.
- npm pack dry run: exactly 7 intended files (two bundles, CSS, declarations, README, LICENSE, package.json).
- Art: eight transparent 320×96 PNGs plus editable SVG sources.
- Media: 10-second MP4, poster PNG, 1200×630 share PNG.
- npm lookup returned E404 for marquee-drift at check time; availability is not reserved.
- GitHub lookup found no existing YagnikBarasiya23/marquee-drift repository. Local work is retained. No remote repository, npm publication, release, or portfolio integration performed.

Remaining release gates: Firefox and real background-tab validation, full image-loading/mobile-touch coverage, public hosting/release/publishing, portfolio integration. The original all-tests checklist remains incomplete.
