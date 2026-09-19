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
## Deploy (Render — static site)

The production bundle is plain static files, so this deploys as a Render
**Static Site** (not a Web Service).

| Setting | Value |
| --- | --- |
| Root Directory | *(leave empty)* |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| `NODE_VERSION` | `22.11.0` |

**Root Directory must be empty.** `package.json` and `vite.config.js` live at
the repo root and Vite writes to `<repo root>/dist`. If Root Directory is set
to `src`, npm still finds the root `package.json` by walking up the tree, so
the build *succeeds* — but Render then looks for the output in `src/dist` and
fails with `Publish directory dist does not exist!`.

`render.yaml` in this repo encodes the same settings (plus the SPA rewrite,
asset caching and security headers) for Blueprint deploys.

### Known advisory

`npm audit` reports a moderate/high issue in `esbuild` via `vite`. It affects
the **dev server only** and is not present in the built `dist/` output, so it
does not ship to production. Clearing it requires a breaking upgrade to Vite 8.
