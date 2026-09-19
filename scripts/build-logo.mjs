import sharp from 'sharp'

const SRC = 'assets-src/humovare-logo.png'
const OUT = process.argv[2] || 'src/assets/humovare-logo.webp'
const SIZE = 1200          // shipped square canvas
const FLOOR = 0.05         // alpha below this is gradient-estimate noise, not art

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info
const N = W * H

const chroma = new Float32Array(N)
const px = new Float32Array(N * 3)
for (let i = 0; i < N; i++) {
  const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2]
  px[i * 3] = r; px[i * 3 + 1] = g; px[i * 3 + 2] = b
  chroma[i] = r - (g + b) / 2
}

// --- estimate the smooth background field from pixels that are clearly red ---
const GRID = 48
const cell = { c: new Float64Array(GRID * GRID), r: new Float64Array(GRID * GRID),
               g: new Float64Array(GRID * GRID), b: new Float64Array(GRID * GRID),
               n: new Float64Array(GRID * GRID) }
for (let y = 0; y < H; y++) {
  const gy = Math.min(GRID - 1, (y * GRID / H) | 0)
  for (let x = 0; x < W; x++) {
    const i = y * W + x
    if (chroma[i] < 55) continue                 // foreground or edge: skip
    const gi = gy * GRID + Math.min(GRID - 1, (x * GRID / W) | 0)
    cell.c[gi] += chroma[i]; cell.r[gi] += px[i*3]; cell.g[gi] += px[i*3+1]; cell.b[gi] += px[i*3+2]
    cell.n[gi]++
  }
}
// fill empty cells (those fully covered by the wordmark) by diffusion
const keys = ['c','r','g','b']
const have = Array.from(cell.n, n => n > 0)
for (const k of keys) for (let gi = 0; gi < GRID*GRID; gi++) if (have[gi]) cell[k][gi] /= cell.n[gi]
for (let pass = 0; pass < 400; pass++) {
  let changed = false
  for (let gy = 0; gy < GRID; gy++) for (let gx = 0; gx < GRID; gx++) {
    const gi = gy * GRID + gx
    if (have[gi]) continue
    let n = 0, acc = { c:0, r:0, g:0, b:0 }
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = gx+dx, ny = gy+dy
      if (nx<0||ny<0||nx>=GRID||ny>=GRID) continue
      const ni = ny*GRID+nx
      if (!have[ni]) continue
      for (const k of keys) acc[k] += cell[k][ni]
      n++
    }
    if (n) { for (const k of keys) cell[k][gi] = acc[k]/n; have[gi] = true; changed = true }
  }
  if (!changed) break
}
// light smoothing so the field stays gradient-like
for (let pass = 0; pass < 8; pass++) {
  const snap = keys.map(k => Float64Array.from(cell[k]))
  for (let gy = 0; gy < GRID; gy++) for (let gx = 0; gx < GRID; gx++) {
    const gi = gy*GRID+gx
    keys.forEach((k, ki) => {
      let acc = snap[ki][gi], n = 1
      for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx=gx+dx, ny=gy+dy
        if (nx<0||ny<0||nx>=GRID||ny>=GRID) continue
        acc += snap[ki][ny*GRID+nx]; n++
      }
      cell[k][gi] = acc/n
    })
  }
}
const sample = (arr, x, y) => {                    // bilinear from the coarse grid
  const fx = Math.min(GRID-1.001, Math.max(0, x*GRID/W - 0.5))
  const fy = Math.min(GRID-1.001, Math.max(0, y*GRID/H - 0.5))
  const x0 = fx|0, y0 = fy|0, tx = fx-x0, ty = fy-y0
  const a = arr[y0*GRID+x0],     b = arr[y0*GRID+x0+1]
  const c = arr[(y0+1)*GRID+x0], d = arr[(y0+1)*GRID+x0+1]
  return (a*(1-tx)+b*tx)*(1-ty) + (c*(1-tx)+d*tx)*ty
}

// --- build the matte: alpha from how far the pixel is from the local red ---
const out = Buffer.alloc(N * 4)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y*W + x
  const bgC = sample(cell.c, x, y)
  let a = 1 - chroma[i] / bgC
  a = (a - FLOOR) / (1 - FLOOR)          // drop the estimator's noise floor
  a = a < 0 ? 0 : a > 1 ? 1 : a
  // un-premultiply against the estimated background to recover true fg colour
  const bg = [sample(cell.r,x,y), sample(cell.g,x,y), sample(cell.b,x,y)]
  const o = i*4
  if (a < 0.004) { out[o]=0; out[o+1]=0; out[o+2]=0; out[o+3]=0; continue }
  for (let k = 0; k < 3; k++) {
    let v = (px[i*3+k] - (1-a)*bg[k]) / a
    out[o+k] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v)
  }
  out[o+3] = Math.round(a*255)
}

const pipe = sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
const written = OUT.endsWith('.png')
  ? await pipe.png({ compressionLevel: 9 }).toFile(OUT)
  : await pipe.webp({ quality: 95, alphaQuality: 100, effort: 6 }).toFile(OUT)
console.log('wrote', OUT, written.width + 'x' + written.height, written.size + ' bytes')
