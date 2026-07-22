import sharp from 'sharp'
import path from 'node:path'

const files = ['jake-head.png', 'jake-feet.png', 'finn-peek.png']
const dir = path.resolve('public/stickers/adventure')

function isBg(r, g, b, a) {
  if (a < 10) return true
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  // Only near-black / near-white low-sat backgrounds — NEVER yellow or eye-white interior
  return sat < 28 && (lum < 14 || lum > 248)
}

async function processFile(name) {
  const input = path.join(dir, name)
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const visited = new Uint8Array(width * height)
  const q = []
  const idx = (x, y) => (y * width + x) * 4
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const p = y * width + x
    if (visited[p]) return
    const i = idx(x, y)
    if (!isBg(data[i], data[i + 1], data[i + 2], data[i + 3])) return
    visited[p] = 1
    q.push(p)
  }
  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1) }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y) }
  while (q.length) {
    const p = q.pop()
    const x = p % width
    const y = (p / width) | 0
    data[p * 4 + 3] = 0
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1)
  }
  const out = await sharp(data, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 8 })
    .resize({ width: 160, height: 160, fit: 'inside' })
    .png({ compressionLevel: 9 })
    .toBuffer()
  await sharp(out).toFile(input)
  const m = await sharp(input).metadata()
  console.log(name, m.width + 'x' + m.height)
}

for (const f of files) await processFile(f)
