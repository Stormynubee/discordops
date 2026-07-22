import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { exec } from 'node:child_process'
import path from 'node:path'

const src = 'public/brand/deezops-logo.png'
const outDir = path.join(process.env.USERPROFILE || '', 'Pictures', 'DeezOps-Discord-Logo')
const pubDir = 'public/brand/discord'
await mkdir(outDir, { recursive: true })
await mkdir(pubDir, { recursive: true })

const sizes = [
  [512, 'server-icon-512.png', 'Discord Server Icon (recommended upload)'],
  [256, 'server-icon-256.png', 'Discord Server Icon (alt)'],
  [128, 'avatar-emoji-128.png', 'Profile picture / custom emoji'],
  [64, 'emoji-64.png', 'Small emoji'],
  [1024, 'master-1024.png', 'Master high-res (optional)'],
]

const lines = [
  'DeezOps Cop Peepo logo — Discord pack',
  'Transparent PNG.',
  '',
  'How to use:',
  '1. Server icon: Discord → Server Settings → Overview → Image → upload server-icon-512.png',
  '2. Profile / bot avatar: upload avatar-emoji-128.png or master-1024.png',
  '3. Custom emoji: upload avatar-emoji-128.png (under 256KB; this is fine)',
  '',
]

for (const [size, name, desc] of sizes) {
  const buf = await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer()
  await sharp(buf).toFile(path.join(outDir, name))
  await sharp(buf).toFile(path.join(pubDir, name))
  lines.push(name)
  lines.push(`  size: ${size}x${size}`)
  lines.push(`  use: ${desc}`)
  lines.push('')
}

await writeFile(path.join(outDir, 'README.txt'), lines.join('\n'), 'utf8')
console.log(lines.join('\n'))
console.log('\nSaved to:', outDir)
exec(`explorer "${outDir}"`)
