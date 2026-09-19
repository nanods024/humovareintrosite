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
npm run logo     # re-cut the logo from assets-src/humovare-logo.png
```

## Deploy (Render — static site)

The production bundle is plain static files, so this deploys as a Render
**Static Site** (not a Web Service).

| Setting | Value |
| --- | --- |
| Root Directory | `src` |
| Build Command | `npm install; npm run build` |
| Publish Directory | `dist` |

Render checks out the repo at `/opt/render/project/src`, so with a Root
Directory of `src` the published folder resolves to `<repo root>/src/dist`.
Vite is configured to write there: see `build.outDir` in `vite.config.js`.

**If you ever clear the Root Directory field in Render, change `build.outDir`
back to `dist`** — the two settings have to move together, or the deploy fails
with `Publish directory dist does not exist!`.

`src/dist/` is generated and git-ignored. Vite empties it on every build, so
never put source files in it.

### Known advisory

`npm audit` reports a moderate/high issue in `esbuild` via `vite`. It affects
the **dev server only** and is not present in the built output, so it does not
ship to production. Clearing it requires a breaking upgrade to Vite 8.
