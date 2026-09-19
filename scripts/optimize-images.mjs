/**
 * Turns the full-size campaign artwork in assets-src/ into the responsive
 * WebP the site actually ships.
 *
 *   npm run images
 *
 * Originals stay in assets-src/ and are never bundled. Re-run this after
 * swapping any artwork.
 */
import { mkdir, readdir, writeFile, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SRC = 'assets-src'
const OUT = join('src', 'assets', 'drop')
const WIDTHS = [720, 1280]

await mkdir(OUT, { recursive: true })

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
if (!files.length) {
  console.log(`No source images in ${SRC}/`)
  process.exit(0)
}

let before = 0
let after = 0

for (const file of files) {
  const { name } = parse(file)
  const input = join(SRC, file)
  before += (await stat(input)).size

  const meta = await sharp(input).metadata()

  for (const width of WIDTHS) {
    // Never upscale past the original.
    const target = Math.min(width, meta.width)
    const buf = await sharp(input)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toBuffer()

    // Named by the width actually produced, never the width requested — the
    // srcset descriptor has to match the real pixel width or the browser
    // picks the wrong file.
    const out = join(OUT, `${name}-${target}.webp`)
    await writeFile(out, buf)
    after += buf.length
    console.log(`${out}  ${target}w  ${(buf.length / 1024).toFixed(0)} KB`)
  }

  console.log(`  (source ${name}: ${meta.width}x${meta.height})`)
}

const mb = (n) => (n / 1048576).toFixed(2)
console.log(`\nsource ${mb(before)} MB  ->  shipped ${mb(after)} MB`)
