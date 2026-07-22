# Jake + Finn Navbar Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the uncanny SVG Jake/Finn nav gag with reference-faithful PNG caps + a CSS yellow stretch tube, layered so Jake elongates under the nav, Finn peeks only on Pricing, and the preview never collides.

**Architecture:** Keep characters in `JakeStretchRide.tsx` (Jake stretch + exported `FinnPricingPop`). `Navbar.tsx` owns hover state and layer-cake stacking: links on top, Finn above Pricing, Jake in a strip under the nav pill, preview offset below Jake. Mid-body elongates by animating `width` (not `scaleX`). Assets are transparent PNGs cut from the user's Adventure Time references.

**Tech Stack:** React 19, TypeScript, Framer Motion 12, Vite, Tailwind CSS 4, existing trimmed MP3 under `public/stickers/adventure/`

**Spec:** `docs/superpowers/specs/2026-07-22-jake-finn-navbar-design.md`

---

## File structure

- Replace: `public/stickers/adventure/jake-head.png` — transparent head with white eyes + pupils (from user refs)
- Replace: `public/stickers/adventure/jake-feet.png` — transparent rear/feet with open edge toward tube
- Replace: `public/stickers/adventure/finn-peek.png` — transparent Finn upper-body peek (from user Finn ref)
- Keep: `public/stickers/adventure/jake-stretch.mp3` — already trimmed; re-trim from Downloads source only if missing/broken
- Optional delete: `public/stickers/adventure/jake-body.png` — unused once CSS tube is the mid-body (remove if present after rebuild)
- Rewrite: `src/components/JakeStretchRide.tsx` — PNG Jake + CSS tube + Finn peek; no SVG faces
- Modify: `src/components/Navbar.tsx` — layer-cake positions, Jake on any hover, Finn on Pricing, preview offset

---

### Task 1: Prepare transparent PNG caps from references

**Files:**
- Replace: `public/stickers/adventure/jake-head.png`
- Replace: `public/stickers/adventure/jake-feet.png`
- Replace: `public/stickers/adventure/finn-peek.png`

- [ ] **Step 1: Generate or crop reference-faithful assets**

Use the user's reference images (chat attachments / `assets/` Jake stretch refs + Finn vertical stretch image). Prefer Cursor `GenerateImage` with explicit constraints, then process:

- Jake head: large **white** circular eyes with black pupils, yellow dog, thick black outline, paws at bottom, **transparent background** (no white/black/checker box).
- Jake feet: rear + tail + hind legs, **straight open vertical edge on the side that meets the tube**, transparent background.
- Finn peek: white hat, blue shirt, green straps, upper body only, transparent background.

Save generated files into the workspace `assets/` folder first if using GenerateImage, then copy into `public/stickers/adventure/`.

- [ ] **Step 2: Strip backgrounds with edge flood only (preserve white eyes)**

From repo root, run (uses already-available `sharp` if present; otherwise `npm install sharp --no-save`):

```powershell
@'
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
'@ | Set-Content -Encoding utf8 scripts\prep-adventure-caps.mjs
node scripts/prep-adventure-caps.mjs
```

Expected: three PNGs rewritten; console prints dimensions; opening each file shows transparent checker around the character and **Jake still has white eyes**.

- [ ] **Step 3: Confirm stretch audio exists**

```powershell
Test-Path public\stickers\adventure\jake-stretch.mp3
```

Expected: `True`. If `False`, trim ~2.8s from `C:\Users\storm\Downloads\ADVENTURE TIME! - JAKE STRETCHING FOREVER - AsianRobinHood (128k) (1).mp3` with ffmpeg into that path.

- [ ] **Step 4: Commit assets**

```bash
git add public/stickers/adventure/jake-head.png public/stickers/adventure/jake-feet.png public/stickers/adventure/finn-peek.png public/stickers/adventure/jake-stretch.mp3 scripts/prep-adventure-caps.mjs
git commit -m "Add transparent Jake/Finn PNG caps for navbar stretch."
```

---

### Task 2: Rebuild JakeStretchRide with PNG caps + CSS tube

**Files:**
- Rewrite: `src/components/JakeStretchRide.tsx`

- [ ] **Step 1: Replace the component with this implementation**

Overwrite `src/components/JakeStretchRide.tsx` with:

```tsx
import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type JakeStretchRideProps = {
  active: boolean
  playSound?: boolean
  className?: string
}

const IDLE_BODY = 28
const FULL_BODY = 240
const BODY_H = 28
const JAKE_YELLOW = '#F5C518'
const JAKE_YELLOW_DARK = '#E0A800'

/**
 * Jake stretches under the navbar on hover.
 * PNG head/feet stay crisp; CSS tube elongates by width.
 */
export function JakeStretchRide({ active, playSound = true, className = '' }: JakeStretchRideProps) {
  const reduceMotion = useReducedMotion()
  const show = !reduceMotion && active
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio('/stickers/adventure/jake-stretch.mp3')
      a.preload = 'auto'
      a.volume = 0.35
      audioRef.current = a
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    if (show && playSound) {
      a.currentTime = 0
      void a.play().catch(() => {})
    } else {
      a.pause()
      a.currentTime = 0
    }
  }, [show, playSound])

  if (reduceMotion) return null

  const stretch = show
    ? { duration: 2.6, ease: [0.22, 1, 0.36, 1] as const }
    : { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const }

  return (
    <div aria-hidden className={`pointer-events-none absolute overflow-visible ${className}`}>
      <motion.div
        className="flex items-center"
        initial={false}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }}
        transition={{ duration: show ? 0.18 : 0.22 }}
        style={{ transformOrigin: 'right center' }}
      >
        <img
          src="/stickers/adventure/jake-feet.png"
          alt=""
          draggable={false}
          className="relative z-20 mb-[2px] mr-[-3px] h-11 w-11 shrink-0 object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]"
        />

        <motion.div
          className="relative z-10 shrink-0 overflow-hidden"
          style={{ height: BODY_H }}
          initial={false}
          animate={{ width: show ? FULL_BODY : IDLE_BODY }}
          transition={stretch}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, #ffe066 0%, ${JAKE_YELLOW} 42%, ${JAKE_YELLOW_DARK} 100%)`,
              borderTop: '2.5px solid #000',
              borderBottom: '2.5px solid #000',
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.12)',
            }}
          />
        </motion.div>

        <img
          src="/stickers/adventure/jake-head.png"
          alt=""
          draggable={false}
          className="relative z-20 ml-[-3px] h-[52px] w-[52px] shrink-0 object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]"
        />
      </motion.div>
    </div>
  )
}

type FinnPricingPopProps = {
  active: boolean
  className?: string
}

/** Finn peeks above Pricing only — not attached to Jake. */
export function FinnPricingPop({ active, className = '' }: FinnPricingPopProps) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 z-[95] -translate-x-1/2 ${className}`}
      initial={false}
      animate={{
        y: active ? 0 : 22,
        opacity: active ? 1 : 0,
        scale: active ? 1 : 0.55,
      }}
      transition={
        active
          ? { type: 'spring', stiffness: 520, damping: 18, delay: 0.06 }
          : { duration: 0.16, ease: [0.4, 0, 1, 1] }
      }
      style={{ transformOrigin: 'bottom center' }}
    >
      <img
        src="/stickers/adventure/finn-peek.png"
        alt=""
        draggable={false}
        className="h-11 w-11 object-contain drop-shadow-[2px_3px_0_rgba(0,0,0,0.45)]"
      />
    </motion.div>
  )
}
```

- [ ] **Step 2: Typecheck the component**

```powershell
npx tsc -b --pretty false
```

Expected: exit code 0 (or only pre-existing errors unrelated to this file).

- [ ] **Step 3: Commit**

```bash
git add src/components/JakeStretchRide.tsx
git commit -m "Rebuild Jake stretch with PNG caps and CSS tube."
```

---

### Task 3: Wire layer-cake stacking in Navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Ensure imports**

At the top of `Navbar.tsx`, keep:

```tsx
import { FinnPricingPop, JakeStretchRide } from './JakeStretchRide'
```

- [ ] **Step 2: Update DesktopNavItem for Finn + preview offset**

Inside `DesktopNavItem`, keep `isPricing = link.href === '#pricing'`.

Render Finn **above** the Pricing label (not inside the `<a>` text flow in a way that shifts layout). Use:

```tsx
{isPricing ? (
  <FinnPricingPop active={showPreview} className="bottom-[calc(100%+2px)]" />
) : null}
```

Place this as a sibling before the `<a>`, on the `<li className="relative">`.

Set the preview panel class to always clear Jake's strip:

```tsx
className="pointer-events-auto absolute left-1/2 top-[calc(100%+4rem)] z-[83] -translate-x-1/2"
```

Keep the diamond pointer and `NavPreviewCard` as they are.

Link `<a>` stays `relative z-[86]` so text stays above characters.

- [ ] **Step 3: Mount Jake under the nav pill (any hover)**

In the centered desktop nav wrapper (the `absolute left-1/2 top-1/2 ... lg:block` div), place Jake **before** the `<ul>`, with:

```tsx
<JakeStretchRide
  active={hovered !== null}
  playSound={hovered !== null}
  className="right-2 top-[calc(100%+4px)] z-[94]"
/>
```

Requirements:
- `top-[calc(100%+4px)]` = under the pill (not above the viewport)
- `z-[94]` above the preview (`z-[83]`), below nothing that blocks links (`links` stay `z-[86]` for hit targets; Jake is non-interactive)
- Parent containers (`header`, `nav`, center wrapper, `ul`) must allow `overflow-visible`

- [ ] **Step 4: Remove any old SVG-only positioning / Pricing-only Jake mounts**

Delete leftover mounts such as:
- Jake inside a single Pricing `li`
- `bottom-[calc(100%+…)]` placements that clip Jake off-screen
- Inline SVG Finn inside Jake

- [ ] **Step 5: Build**

```powershell
npm run build
```

Expected: Vite build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "Wire Jake under nav and Finn Pricing peek without collisions."
```

---

### Task 4: Visual QA on localhost

**Files:** none (manual)

- [ ] **Step 1: Run the dev server**

```powershell
npm run dev
```

Open `http://localhost:5173/` (hard refresh).

- [ ] **Step 2: Checklist against the spec**

| Check | Pass? |
| --- | --- |
| No white/black boxes on Jake/Finn | |
| Jake eyes white with pupils | |
| Stretch is continuous (no gaps) | |
| Jake under nav, fully visible | |
| Preview does not overlap Jake/Finn | |
| Finn peeks only on Pricing, above the label | |
| Jake on any nav hover; gone on leave | |
| Audio plays on Jake activate (gesture context) | |
| Reduced-motion: no characters | |

- [ ] **Step 3: Fix any failed check in the same PR/commit batch**

If eyes are missing, re-run Task 1 flood with stricter bg rules (do not key out interior whites). If gaps appear, nudge `mr-[-3px]` / `ml-[-3px]` overlap. If collision, increase preview `top` to `4.5rem` or `5rem`.

- [ ] **Step 4: Final commit if polish landed**

```bash
git add -A
git status
git commit -m "Polish Jake/Finn nav layering after visual QA."
git push origin HEAD
```

---

## Spec coverage self-review

| Spec requirement | Task |
| --- | --- |
| Layer cake stacking | Task 3 |
| Jake any hover / Finn Pricing only | Task 3 |
| PNG caps + CSS tube | Tasks 1–2 |
| Transparent assets, white eyes | Task 1 |
| Width stretch ~2.6s | Task 2 |
| Stretch SFX | Task 2 |
| Preview offset / no collision | Task 3 |
| Reduced motion | Task 2 |
| No new deps / nav-only scope | All tasks |
| Acceptance QA | Task 4 |

## Out of scope (do not implement)

- Mobile character animation
- Body PNG tiling / video frames
- Non-nav section redesign
