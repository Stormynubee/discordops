# Command Center Unread Ping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the passive Command Center hint with a one-time Discord-style unread prompt and quiet ping that draws visitors into clicking a channel.

**Architecture:** Keep the feature local to `DiscordMockup.tsx`. A three-state interaction (`idle`, `prompted`, `used`) controls the unread dot, notice, channel nudge, and final copy; an `HTMLAudioElement` plays a small local WAV once on the first hover/tap attempt. Framer Motion animates only opacity and transforms.

**Tech Stack:** React 19, TypeScript, Framer Motion 12, Vite, Tailwind CSS 4

---

## File structure

- Create `public/command-center-ping.wav`: short, quiet two-tone notification sound.
- Modify `src/components/DiscordMockup.tsx`: prompt state, audio trigger, unread UI, channel nudge, dismissal, and reduced-motion behavior.

### Task 1: Add the local ping sound

**Files:**
- Create: `public/command-center-ping.wav`

- [ ] **Step 1: Generate a short WAV file**

Run this PowerShell command from the repository root. It generates a 140 ms, low-volume two-tone PCM WAV without adding a dependency:

```powershell
@'
const fs = require('fs');
const rate = 44100;
const duration = 0.14;
const samples = Math.floor(rate * duration);
const data = Buffer.alloc(samples * 2);
for (let i = 0; i < samples; i++) {
  const t = i / rate;
  const frequency = t < 0.07 ? 740 : 988;
  const envelope = Math.sin(Math.PI * i / samples);
  const value = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.12;
  data.writeInt16LE(Math.round(value * 32767), i * 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(rate, 24);
header.writeUInt32LE(rate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);
fs.writeFileSync('public/command-center-ping.wav', Buffer.concat([header, data]));
'@ | node
```

Expected: `public/command-center-ping.wav` exists and is approximately 12 KB.

- [ ] **Step 2: Verify the WAV header**

Run:

```powershell
$bytes = [System.IO.File]::ReadAllBytes("public\command-center-ping.wav")
[System.Text.Encoding]::ASCII.GetString($bytes[0..3])
```

Expected: `RIFF`

### Task 2: Add the prompt state and sound trigger

**Files:**
- Modify: `src/components/DiscordMockup.tsx`

- [ ] **Step 1: Add prompt state and refs**

Inside `DiscordMockup`, add:

```tsx
type PromptState = 'idle' | 'prompted' | 'used'

const commandCenterRef = useRef<HTMLDivElement>(null)
const audioRef = useRef<HTMLAudioElement>(null)
const soundPlayedRef = useRef(false)
const commandCenterInView = useInView(commandCenterRef, {
  once: true,
  margin: '-20% 0px -20% 0px',
})
const [promptState, setPromptState] = useState<PromptState>('idle')
```

- [ ] **Step 2: Show the prompt when the mockup enters view**

Add:

```tsx
useEffect(() => {
  if (commandCenterInView) setPromptState('prompted')
}, [commandCenterInView])
```

Expected: state transitions from `idle` to `prompted` once.

- [ ] **Step 3: Add the one-time ping function**

Add:

```tsx
const playPingOnce = () => {
  if (soundPlayedRef.current || promptState !== 'prompted') return

  const audio = audioRef.current
  if (!audio) return

  audio.volume = 0.32
  void audio.play().then(() => {
    soundPlayedRef.current = true
  }).catch(() => {
    // Hover playback can be blocked until a click/tap.
    // Keep it armed so onPointerDown can retry.
  })
}
```

This attempts playback on desktop hover. If browser autoplay policy blocks hover audio, the same function retries on the first tap/click.

- [ ] **Step 4: Attach the ref, audio, and interaction handlers**

Update the root:

```tsx
<div
  ref={commandCenterRef}
  className="w-full"
  onPointerEnter={playPingOnce}
  onPointerDown={playPingOnce}
>
  <audio ref={audioRef} src="/command-center-ping.wav" preload="auto" />
```

Expected: audio is local, preloaded, and never loops.

### Task 3: Render the unread affordance and dismiss it on channel use

**Files:**
- Modify: `src/components/DiscordMockup.tsx`

- [ ] **Step 1: Centralize channel selection**

Add:

```tsx
const selectChannel = (id: ChannelId) => {
  setActiveId(id)
  setPromptState('used')
}
```

Change each channel button from:

```tsx
onClick={() => setActiveId(ch.id)}
```

to:

```tsx
onClick={() => selectChannel(ch.id)}
```

- [ ] **Step 2: Add the one-time channel nudge and unread dot**

Convert the channel button to `motion.button` and add:

```tsx
animate={
  promptState === 'prompted' && ch.id === 'announcements' && !reduceMotion
    ? { x: [0, -3, 3, 0] }
    : { x: 0 }
}
transition={{ duration: 0.36, delay: 0.5 }}
```

Render this beside the announcements label:

```tsx
{promptState === 'prompted' && ch.id === 'announcements' ? (
  <motion.span
    initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
  />
) : null}
```

Expected: one subtle nudge and one gold unread dot. No looping.

- [ ] **Step 3: Replace the passive footer text**

Replace both mobile and desktop copies with one responsive `AnimatePresence` block:

```tsx
<div className="mt-3 flex min-h-8 justify-center">
  <AnimatePresence mode="wait">
    {promptState === 'prompted' ? (
      <motion.button
        key="prompt"
        type="button"
        onClick={() => selectChannel('announcements')}
        initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent"
      >
        <motion.span
          animate={reduceMotion ? undefined : { scale: [1, 1.35, 1] }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="h-1.5 w-1.5 rounded-full bg-accent"
        />
        Open it before the mods do.
      </motion.button>
    ) : promptState === 'used' ? (
      <motion.p
        key="used"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[11px] text-muted"
      >
        Good choice. The buttons work.
      </motion.p>
    ) : null}
  </AnimatePresence>
</div>
```

Expected: the prompt itself is clickable and opens announcements.

### Task 4: Verify behavior and performance

**Files:**
- Verify: `src/components/DiscordMockup.tsx`
- Verify: `public/command-center-ping.wav`

- [ ] **Step 1: Run lint**

Run:

```powershell
npm run lint
```

Expected: exit code 0.

- [ ] **Step 2: Run the production build**

Run:

```powershell
npm run build
```

Expected: TypeScript and Vite build pass.

- [ ] **Step 3: Verify in the browser**

With `npm run dev -- --host`:

1. Reload and scroll the Command Center into view.
2. Confirm the unread dot, one channel nudge, and prompt appear.
3. Hover the Command Center; confirm one quiet ping. If hover is blocked by browser policy, click/tap and confirm the fallback ping.
4. Click a channel; confirm the dot and prompt disappear and the success copy appears.
5. Move away and back; confirm the ping does not repeat.
6. Enable reduced motion; confirm the prompt appears without movement.
7. Scroll while the prompt is visible; confirm there is no new jank.
