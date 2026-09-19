import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  build: {
    // Render's static site is configured with Root Directory = "src" and
    // Publish Directory = "dist", so the bundle has to land in src/dist.
    // Vite empties this folder on every build -- keep only build output here.
    outDir: 'src/dist',
    emptyOutDir: true,
    target: 'es2019',
    cssTarget: 'chrome80',
    assetsInlineLimit: 8192,
  },
})
