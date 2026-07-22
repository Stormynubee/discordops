/**
 * Copy Jake stretch frames to Pictures with size + description in filenames.
 */
import sharp from 'sharp'
import { mkdir, copyFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outRoot = path.join(process.env.USERPROFILE || '', 'Pictures', 'JakeStretchFrames')
const processedDir = path.join(outRoot, 'navbar-ready-48px')
const sourcesDir = path.join(outRoot, 'full-resolution-sources')

const processed = [
  ['01.png', 'short', 'Services hover — shortest stretch'],
  ['02.png', 'medium', 'Plans hover — medium stretch'],
  ['03.png', 'mid', 'Between Plans and Portfolio'],
  ['04.png', 'long', 'Portfolio hover — long stretch'],
  ['05.png', 'longer', 'Between Portfolio and Pricing'],
  ['06.png', 'very-long', 'Pricing hover — very long stretch'],
  ['07.png', 'max', 'FAQ hover — maximum stretch'],
]

const sources = [
  ['jake-stretch-01-short.png', 'short', 'Full-res source — shortest stretch'],
  ['jake-stretch-02-medium.png', 'medium', 'Full-res source — medium stretch'],
  ['jake-stretch-02c-mid.png', 'mid', 'Full-res source — mid stretch'],
  ['jake-stretch-03-long.png', 'long', 'Full-res source — long stretch'],
  ['jake-stretch-02b.png', 'longer', 'Full-res source — longer stretch'],
  ['jake-stretch-03b-long.png', 'very-long', 'Full-res source — very long stretch'],
  ['jake-stretch-04-max.png', 'max', 'Full-res source — maximum stretch'],
]

const srcAssets = path.resolve(
  'C:/Users/storm/.cursor/projects/c-Users-storm-Projects-discordops/assets',
)
const framesDir = path.join(root, 'public/stickers/adventure/frames')

await mkdir(processedDir, { recursive: true })
await mkdir(sourcesDir, { recursive: true })

const lines = [
  'Jake stretch frames',
  `Saved: ${new Date().toLocaleString()}`,
  `Folder: ${outRoot}`,
  '',
  '=== navbar-ready-48px (transparent BG, used on the website) ===',
  '',
]

for (let i = 0; i < processed.length; i++) {
  const [file, label, desc] = processed[i]
  const input = path.join(framesDir, file)
  const meta = await sharp(input).metadata()
  const name = `Jake_${String(i + 1).padStart(2, '0')}_${label}_${meta.width}x${meta.height}px.png`
  await copyFile(input, path.join(processedDir, name))
  lines.push(name)
  lines.push(`  size: ${meta.width}x${meta.height}px`)
  lines.push(`  description: ${desc}`)
  lines.push('')
}

lines.push('=== full-resolution-sources (original gens, paper background) ===', '')

for (let i = 0; i < sources.length; i++) {
  const [file, label, desc] = sources[i]
  const input = path.join(srcAssets, file)
  const meta = await sharp(input).metadata()
  const name = `Jake_source_${String(i + 1).padStart(2, '0')}_${label}_${meta.width}x${meta.height}px.png`
  await copyFile(input, path.join(sourcesDir, name))
  lines.push(name)
  lines.push(`  size: ${meta.width}x${meta.height}px`)
  lines.push(`  description: ${desc}`)
  lines.push('')
}

await writeFile(path.join(outRoot, 'README.txt'), lines.join('\n'), 'utf8')
console.log(lines.join('\n'))
console.log('\nSaved to:', outRoot)
