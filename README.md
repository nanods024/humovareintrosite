# HUMOVARE — Launch Countdown

A cinematic single-page "coming soon" experience for the HUMOVARE clothing brand.
React + Vite + Framer Motion. No backend, no database, no cart.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
npm run images   # re-optimize the campaign artwork (see below)
```

## The two things you will want to change

### 1. The launch date

Everything — the countdown, the "X DAYS TO GO" line, the final CTA — reads one
constant in `src/config.js`:

```js
export const LAUNCH_DATE = new Date('2026-09-29T00:00:00')
```

Local time, `YYYY-MM-DDTHH:MM:SS`. When it passes, the countdown is replaced by
**WE ARE LIVE.** and the CTA reads **LIVE NOW.** — never negative numbers.

### 2. The logo

`src/assets/humovare-logo.svg` is a **placeholder**, not the official mark.
To use the real artwork:

1. Save it as `src/assets/humovare-logo.png`
2. In `src/components/Logo.jsx`, change the one import:
   ```js
   import logoSrc from '../assets/humovare-logo.png'
   ```

The layout expects a square (1:1) red tile, exactly like the official file, and
only ever scales it uniformly (`object-fit: contain`) — the logo is never
stretched or re-proportioned. A soft radial mask feathers the tile's edge into
the background; that is a mask, not a crop of the artwork.

### 3. The campaign artwork

Full-size originals live in `assets-src/` and are **never bundled**. `npm run
images` turns them into the responsive WebP the site actually ships, in
`src/assets/drop/`:

```
assets-src/tshirt.png  ->  src/assets/drop/tshirt-720.webp, tshirt-1254.webp
assets-src/hoodie.png  ->  hoodie-720.webp, hoodie-1254.webp
assets-src/fabric.png  ->  fabric-720.webp, fabric-1142.webp
assets-src/print.png   ->  print-720.webp,  print-1142.webp
```

8.60 MB of source PNG becomes 0.97 MB of WebP across both widths — and a
visitor only ever downloads one width per image (~0.33 MB on a phone).

To swap artwork: replace the file in `assets-src/`, run `npm run images`, and
update the import in `src/components/FashionTeaser.jsx` if the output width
changed. Output files are named by the width they actually contain, because
the `srcset` descriptor has to match the real pixel width or the browser
picks the wrong file.

Contact details, the Instagram URL, the WhatsApp number, the footer credit and
the intro storage key all live in `src/config.js`.

### The footer credit

`POWERED_BY` in `src/config.js` drives the credit line. With an `href` it
renders as a link; leave `href` empty and it falls back to plain text.

## Structure

```
src/
  components/
    AmbientBackground.jsx   fixed gradient depth, drifting light, spotlight, grain
    IntroScreen.jsx         full-screen "TAP TO ENTER" launch screen
    Hero.jsx                HUMOVARE / COMING SOON / countdown
    Countdown.jsx           the four units
    CountdownProvider.jsx   one timer, shared
    FashionTeaser.jsx       THE FIRST DROP + the four campaign images
    BrandStatement.jsx      NOT JUST CLOTHING. A MOVEMENT.
    JoinDrop.jsx            JOIN THE DROP -> WhatsApp
    Footer.jsx              contact, Instagram, credit, replay intro
    Logo.jsx
  hooks/
    useCountdown.js             self-correcting 1s tick
    useParallax.js              element-relative parallax on window scroll
    useAmbientPointer.js        rAF pointer spotlight
    usePrefersReducedMotion.js  live reduced-motion preference
  assets/
    humovare-logo.svg       placeholder — swap for the official PNG
    drop/                   generated WebP, do not edit by hand
  config.js
  App.jsx  main.jsx  index.css

assets-src/                 full-size originals, never bundled
scripts/optimize-images.mjs
```

## Notes on how it behaves

**Intro.** Shown once per visitor, remembered in `localStorage`. **Replay intro**
in the footer clears it. Bump `INTRO_STORAGE_KEY` in `src/config.js` to force
every visitor through the intro again. The intro is a real `<button>`, so it
works with keyboard and screen readers, not just taps.

**The countdown digits** are an odometer reel: 0–9 stacked in a clipped box,
moved with a single transform. Nothing mounts or unmounts while the clock runs.
The timer re-aligns to the next whole second each tick and resyncs when a
backgrounded tab returns, so it cannot drift.

**One timer for the page.** `CountdownProvider` holds it, so the per-second
update only re-renders the components that read the clock — not the whole tree.

**Reduced motion.** With `prefers-reduced-motion: reduce`, the intro transition,
floating, drifting light, grain, parallax and reveals are all off; content
renders in its final state immediately. The preference is watched live, so
changing it mid-session takes effect without a reload.

**Mouse light** follows the pointer on desktop, written straight to CSS custom
properties inside a `requestAnimationFrame` — no React state, nothing
re-renders. On touch devices and under reduced motion it becomes a slow
automatic drift.

**The first drop.** Two columns on desktop, one on mobile. The tee and hoodie
are square and the fabric and print are both 1142x1377, so the rows pair up and
every image is shown whole — nothing is cropped. Each `<img>` carries its real
`width`/`height`, so the space is reserved before the image arrives and the
layout never shifts. All four are lazy-loaded with a `srcset`, so a phone pulls
the 720px files and a desktop the full-width ones.

**The launch moment.** When the clock hits zero the countdown doesn't just swap
for text — a seam of light splits open, fractures race outward, then a shockwave
and shards blow it apart and WE ARE LIVE. settles out of the blast. About 2.3s
end to end, all transform and opacity, clipped to its own box so it can never
add scroll height or a horizontal scrollbar.

Its one hard rule: the headline must never depend on the animation finishing.
After the burst window a class pins it visible, overriding the animation's
inline styles — applied by the style engine, so it does not itself need an
animation frame. The burst then unmounts, taking its ~23 animated elements with
it. Under reduced motion there is no burst at all; the headline is simply
there. Timings live in `src/components/LaunchBurst.jsx`.

**Joining the drop** opens WhatsApp with a prefilled message, via `wa.me`.
There is no form and no backend.

**The footer credit** animates as one continuous sweep on hover and on keyboard
focus: the name fills in left-to-right, a hairline is drawn underneath in the
same direction, and the arrow lifts away. On the way out the hairline retracts
to the right, so it reads as a single gesture rather than a blink. The fill is a
clipped background, not a second copy of the text, so the link has exactly one
accessible name, and it is wrapped in `@supports` — without `background-clip:
text` the name stays in its resting tone instead of turning invisible. Touch
devices, which have no hover, get the finished state.

**Refreshing** always returns to the top. Browsers restore the previous scroll
offset on reload, which would drop a returning visitor halfway down the page;
`history.scrollRestoration` is set to `manual` in `src/main.jsx` before render.

**Performance.** The background depth is built from radial gradients rather than
`filter: blur()`, so there is no per-frame blur pass. Only `transform` and
`opacity` animate. Timers, listeners and rAF loops are all cleaned up on unmount.

**Horizontal scroll** is clipped with `overflow-x: clip`, deliberately not
`hidden` — see the comment in `src/index.css`. `hidden` on both `html` and
`body` makes `body` a second scroll container, and the browser then routes
wheel/touch scrolling into that dead box, so the page only moves when you drag
the scrollbar.

## Verified

Build clean, no console errors. Checked: intro tap and keyboard entry, the
transition, refresh persistence, replay, the countdown ticking, the rollover to
zero (no negatives) and the burst that reveals it, reduced motion, the WhatsApp link, all four campaign images
loading at the right `srcset` width and aspect ratio, the credit link's hover and
resting states, refresh returning to the top, and no horizontal scroll at 320,
375, mobile and desktop widths.
