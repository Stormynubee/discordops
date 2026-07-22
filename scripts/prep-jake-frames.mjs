/**
 * Prep Jake stretch frames: edge-flood paper BG (keep enclosed eye whites),
 * crop to character bbox, normalize height for navbar scrubbing.
 */
import sharp from 'sharp'
import { mkdir, readdir, unlink } from 'node:fs/promises'
import path from 'node:path'

const srcDir = path.resolve(
  'C:/Users/storm/.cursor/projects/c-Users-storm-Projects-discordops/assets',
)
const outDir = path.resolve('public/stickers/adventure/frames')

/**
 * Source order ≈ short → max. Final public names are sequential after process.
 * Extra mid frames (02c, 03b) smooth the scrub between nav links.
 */
const sources = [
  'jake-stretch-01-short.png',
  'jake-stretch-02-medium.png',
  'jake-stretch-02c-mid.png',
  'jake-stretch-03-long.png',
  'jake-stretch-02b.png',
  'jake-stretch-03b-long.png',
  'jake-stretch-04-max.png',
]

const TARGET_H = 48

function isYellow(r, g, b) {
  return r > 160 && g > 115 && b < 130 && r > b + 35 && g > b + 15
}

function isInk(r, g, b) {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  return lum < 55
}

function isPaper(r, g, b) {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  if (lum > 218 && sat < 55) return true
  if (lum > 200 && sat < 22) return true
  return false
}

function isKeep(r, g, b, a) {
  if (a < 8) return false
  if (isYellow(r, g, b) || isInk(r, g, b)) return true
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  if (lum > 230 && sat < 30) return true
  if (r > 140 && g > 100 && b < 150 && r > b + 20) return true
  return false
}

async function processOne(srcName) {
  const input = path.join(srcDir, srcName)
  let { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let { width, height } = info
  const idx = (x, y) => (y * width + x) * 4

  const bg = new Uint8Array(width * height)
  const q = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const p = y * width + x
    if (bg[p]) return
    const i = idx(x, y)
    const a = data[i + 3]
    if (a < 8 || isPaper(data[i], data[i + 1], data[i + 2])) {
      bg[p] = 1
      q.push(p)
    }
  }
  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }
  while (q.length) {
    const p = q.pop()
    const x = p % width
    const y = (p / width) | 0
    data[p * 4 + 3] = 0
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }

  for (let p = 0; p < width * height; p++) {
    const i = p * 4
    if (data[i + 3] < 8) continue
    if (!isKeep(data[i], data[i + 1], data[i + 2], data[i + 3]) && isPaper(data[i], data[i + 1], data[i + 2])) {
      data[i + 3] = 0
    }
  }

  const copy = Buffer.from(data)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = idx(x, y)
      if (copy[i + 3] < 10) continue
      let nearT = false
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        if (copy[idx(x + dx, y + dy) + 3] < 10) nearT = true
      }
      if (!nearT) continue
      const r = copy[i]
      const g = copy[i + 1]
      const b = copy[i + 2]
      if (isYellow(r, g, b) || isInk(r, g, b)) continue
      if (isPaper(r, g, b)) data[i + 3] = 0
    }
  }

  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y)
      if (data[i + 3] < 40) continue
      if (!isKeep(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        data[i + 3] = 0
        continue
      }
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  if (maxX < minX) throw new Error(`No content found in ${srcName}`)

  const pad = 6
  minX = Math.max(0, minX - pad)
  minY = Math.max(0, minY - pad)
  maxX = Math.min(width - 1, maxX + pad)
  maxY = Math.min(height - 1, maxY + pad)
  const cw = maxX - minX + 1
  const ch = maxY - minY + 1

  const buf = await sharp(data, { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: cw, height: ch })
    .resize({ height: TARGET_H })
    .png({ compressionLevel: 9 })
    .toBuffer()

  const meta = await sharp(buf).metadata()
  const check = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const c = check.data
  const w = check.info.width
  const h = check.info.height
  let eyeWhite = 0
  for (let i = 0; i < c.length; i += 4) {
    if (c[i + 3] > 200 && c[i] > 240 && c[i + 1] > 240 && c[i + 2] > 240) eyeWhite++
  }

  return {
    srcName,
    buf,
    width: meta.width,
    height: meta.height,
    aspect: meta.width / meta.height,
    eyeWhite,
    cornersA: [c[3], c[(w - 1) * 4 + 3], c[(h - 1) * w * 4 + 3], c[((h - 1) * w + (w - 1)) * 4 + 3]],
  }
}

await mkdir(outDir, { recursive: true })

// Clear old frame exports so stale names don't linger
for (const f of await readdir(outDir)) {
  if (f.endsWith('.png')) await unlink(path.join(outDir, f))
}

const processed = []
for (const src of sources) {
  processed.push(await processOne(src))
}

// Sort by aspect so scrub order is always short → long even if a gen is off
processed.sort((a, b) => a.aspect - b.aspect)

for (let i = 0; i < processed.length; i++) {
  const p = processed[i]
  const outName = `${String(i + 1).padStart(2, '0')}.png`
  await sharp(p.buf).toFile(path.join(outDir, outName))
  console.log(
    outName,
    p.srcName,
    `${p.width}x${p.height}`,
    'aspect',
    p.aspect.toFixed(2),
    'cornersA',
    p.cornersA.join(','),
    'eyeWhite',
    p.eyeWhite,
  )
}

console.log('done', outDir, 'count', processed.length)
