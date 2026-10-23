// Turns phone photos of products into clean catalogue images:
// AI background removal → tight crop → colour/sharpness fix → product centred
// on a white 1000×1000 square → WebP.
//
// Usage: node scripts/clean-product-images.mjs <input-dir> <output-dir> [file ...]
// Without file names every .jpg/.jpeg/.png/.webp in <input-dir> is processed.
// Files already present in <output-dir> are skipped, so it can be re-run.
import { removeBackground } from '@imgly/background-removal-node'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SIZE = 1000
const PADDING = 0.08 // white space around the product, as a share of SIZE
const MIN_FOREGROUND = 0.03 // below this the cut-out probably failed

const [inDir, outDir, ...only] = process.argv.slice(2)
if (!inDir || !outDir) {
  console.error('Usage: node scripts/clean-product-images.mjs <input-dir> <output-dir> [file ...]')
  process.exit(1)
}
await fs.mkdir(outDir, { recursive: true })

const files = only.length
  ? only
  : (await fs.readdir(inDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()

// Gentle fix only: auto-levels get thrown off by the transparent background and
// wash out yellow/white packaging.
const enhance = (img) => img.modulate({ saturation: 1.1 }).linear(1.06, -6).sharpen({ sigma: 0.8 })

// The model is unsure on light packaging and clears patches inside the product.
// Turn its soft mask into a solid one: threshold low, close small gaps, then
// fill every cleared area that isn't connected to the photo's border.
async function solidMask(cutout) {
  const { width, height } = await sharp(cutout).metadata()
  const radius = Math.max(3, Math.round(Math.max(width, height) * 0.012))
  const closed = await sharp(cutout)
    .extractChannel('alpha')
    .threshold(40)
    .dilate(radius)
    .erode(radius)
    .raw()
    .toBuffer()

  // Flood-fill the background from the border; whatever it can't reach is product.
  const outside = new Uint8Array(width * height)
  const queue = new Int32Array(width * height)
  let head = 0
  let tail = 0
  const push = (i) => {
    if (!outside[i] && closed[i] === 0) {
      outside[i] = 1
      queue[tail++] = i
    }
  }
  for (let x = 0; x < width; x++) {
    push(x)
    push((height - 1) * width + x)
  }
  for (let y = 0; y < height; y++) {
    push(y * width)
    push(y * width + width - 1)
  }
  while (head < tail) {
    const i = queue[head++]
    const x = i % width
    if (x > 0) push(i - 1)
    if (x < width - 1) push(i + 1)
    if (i >= width) push(i - width)
    if (i < width * (height - 1)) push(i + width)
  }

  const mask = Buffer.alloc(width * height)
  for (let i = 0; i < mask.length; i++) mask[i] = outside[i] ? 0 : 255
  // Slight blur so edges are anti-aliased rather than jagged.
  return sharp(mask, { raw: { width, height, channels: 1 } }).blur(0.8).png().toBuffer()
}

// `source` is the RGB photo (no alpha). Don't add removeAlpha here: sharp runs
// it after joinChannel and would strip the new mask.
// Share of "unsure" pixels (partly transparent) relative to the product. On
// test photos clean cut-outs scored ≤ 0.05 and faded ones 0.17–0.94.
const UNSURE_LIMIT = 0.1

function convexHull(points) {
  points.sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower = []
  const upper = []
  for (const p of points) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), p) <= 0) lower.pop()
    lower.push(p)
  }
  for (const p of points.slice().reverse()) {
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), p) <= 0) upper.pop()
    upper.push(p)
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1))
}

// When the model is unsure (light packaging), cut along the outer outline of
// everything it detected, faint parts included. Boxes and packets come out whole.
async function hullMask(cutout) {
  const { data: alpha, info } = await sharp(cutout).extractChannel('alpha').raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const points = []
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) if (alpha[y * width + x] > 15) points.push([x, y])
  }
  const polygon = convexHull(points).map(([x, y]) => `${x},${y}`).join(' ')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="black"/><polygon points="${polygon}" fill="white"/></svg>`
  return sharp(Buffer.from(svg)).extractChannel(0).blur(0.8).png().toBuffer()
}

async function unsureShare(cutout) {
  const alpha = await sharp(cutout).extractChannel('alpha').raw().toBuffer()
  let product = 0
  let unsure = 0
  for (const v of alpha) {
    if (v >= 128) product++
    if (v > 15 && v < 200) unsure++
  }
  return product ? unsure / product : 1
}

async function applyMask(source, mask) {
  return sharp(source).joinChannel(mask).png().toBuffer()
}

async function toSquare(input) {
  const inner = Math.round(SIZE * (1 - PADDING * 2))
  const fitted = await enhance(sharp(input))
    .resize(inner, inner, { fit: 'inside', withoutEnlargement: false })
    .toBuffer()
  return sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: '#ffffff' } })
    .composite([{ input: fitted, gravity: 'center' }])
    .flatten({ background: '#ffffff' })
    .webp({ quality: 85 })
    .toBuffer()
}

const log = { cleaned: [], fallback: [], failed: [] }

for (const [i, file] of files.entries()) {
  const out = path.join(outDir, file.replace(/\.\w+$/, '.webp'))
  try {
    await fs.access(out)
    continue
  } catch {
    // Not done yet.
  }

  const started = Date.now()
  try {
    // The model works at ~1024px, so shrink big photos first to save time.
    const source = await sharp(path.join(inDir, file)).rotate().resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).png().toBuffer()
    const cutout = Buffer.from(
      await (await removeBackground(new Blob([source], { type: 'image/png' }), { model: 'medium', output: { format: 'image/png' } })).arrayBuffer(),
    )

    const { info } = await sharp(cutout).extractChannel('alpha').threshold(128).toBuffer({ resolveWithObject: true })
    const alpha = await sharp(cutout).extractChannel('alpha').threshold(128).raw().toBuffer()
    const foreground = alpha.reduce((n, v) => n + (v > 0 ? 1 : 0), 0) / (info.width * info.height)

    let result
    if (foreground < MIN_FOREGROUND) {
      // Cut-out found almost nothing: keep the photo, just tidy it up.
      result = await toSquare(await sharp(source).trim({ threshold: 30 }).toBuffer())
      log.fallback.push(file)
    } else {
      const unsure = (await unsureShare(cutout)) > UNSURE_LIMIT
      const masked = await applyMask(source, unsure ? await hullMask(cutout) : await solidMask(cutout))
      result = await toSquare(await sharp(masked).trim({ threshold: 1 }).toBuffer())
      log.cleaned.push(file)
      if (unsure) log.outline = [...(log.outline ?? []), file]
    }
    await fs.writeFile(out, result)
    console.log(`[${i + 1}/${files.length}] ${file} → ${path.basename(out)} (${(result.length / 1024).toFixed(0)} KB, ${((Date.now() - started) / 1000).toFixed(1)}s${foreground < MIN_FOREGROUND ? ', fallback' : ''})`)
  } catch (err) {
    log.failed.push(file)
    console.error(`[${i + 1}/${files.length}] ${file} FAILED: ${err.message}`)
  }
}

console.log(`\nCut along outer outline (worth a quick look): ${(log.outline ?? []).join(' ') || 'none'}`)
console.log(`Done. Cleaned: ${log.cleaned.length}, fallback: ${log.fallback.length} ${log.fallback.join(' ')}, failed: ${log.failed.length} ${log.failed.join(' ')}`)
