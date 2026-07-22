import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/** Full-character stretch frames (alpha cleaned) — short → max. */
export const JAKE_FRAMES = [
  '/stickers/adventure/frames/01.png',
  '/stickers/adventure/frames/02.png',
  '/stickers/adventure/frames/03.png',
  '/stickers/adventure/frames/04.png',
  '/stickers/adventure/frames/05.png',
  '/stickers/adventure/frames/06.png',
  '/stickers/adventure/frames/07.png',
] as const

/** Native widths at 48px height — keep slot sized so head stays right-aligned. */
const FRAME_WIDTHS = [113, 141, 159, 177, 205, 339, 362] as const

/** Nav links map onto the frame ladder (Services short → FAQ max). */
export const JAKE_FRAME_BY_HREF: Record<string, number> = {
  '#services': 0,
  '#command-deck': 1,
  '#portfolio': 3,
  '#pricing': 5,
  '#faq': 6,
}

type JakeStretchRideProps = {
  href: string | null
  playSound?: boolean
  className?: string
}

/**
 * Jake inside the nav pill, behind link text.
 * Scrubs full-character stretch frames as the cursor moves across links.
 */
export function JakeStretchRide({ href, playSound = true, className = '' }: JakeStretchRideProps) {
  const reduceMotion = useReducedMotion()
  const show = !reduceMotion && href !== null
  const frameIndex = show ? (JAKE_FRAME_BY_HREF[href!] ?? 1) : 0
  const slotW = show ? FRAME_WIDTHS[frameIndex] : FRAME_WIDTHS[0]
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const wasShowing = useRef(false)
  const lastIndex = useRef(frameIndex)

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio('/stickers/adventure/jake-stretch.mp3')
      a.preload = 'auto'
      a.volume = 0.28
      audioRef.current = a
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const grew = show && frameIndex > lastIndex.current
    if (show && playSound && (!wasShowing.current || grew)) {
      a.currentTime = 0
      void a.play().catch(() => {})
    }
    if (!show) {
      a.pause()
      a.currentTime = 0
    }
    wasShowing.current = show
    lastIndex.current = frameIndex
  }, [show, playSound, frameIndex])

  useEffect(() => {
    for (const src of JAKE_FRAMES) {
      const img = new Image()
      img.src = src
    }
  }, [])

  if (reduceMotion) return null

  const t = { duration: show ? 0.36 : 0.2, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div aria-hidden className={`pointer-events-none absolute overflow-visible ${className}`}>
      <motion.div
        className="relative overflow-visible"
        initial={false}
        animate={{
          opacity: show ? 0.88 : 0,
          width: slotW,
        }}
        transition={t}
        style={{ height: 48, marginLeft: 'auto' }}
      >
        {JAKE_FRAMES.map((src, i) => {
          const dist = Math.abs(i - frameIndex)
          // Soft neighbor blend so scrubbing feels continuous
          const opacity = !show ? 0 : dist === 0 ? 1 : dist === 1 ? 0.22 : dist === 2 ? 0.06 : 0
          return (
            <motion.img
              key={src}
              src={src}
              alt=""
              draggable={false}
              className="absolute bottom-0 right-0 h-12 w-auto max-w-none select-none drop-shadow-[1px_2px_0_rgba(0,0,0,0.28)]"
              initial={false}
              animate={{ opacity }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

type FinnPricingPopProps = {
  active: boolean
  className?: string
}

/** Small peek just above Pricing — stays close to the word. */
export function FinnPricingPop({ active, className = '' }: FinnPricingPopProps) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 z-[25] -translate-x-1/2 ${className}`}
      initial={false}
      animate={{
        y: active ? 0 : 8,
        opacity: active ? 1 : 0,
        scale: active ? 1 : 0.75,
      }}
      transition={
        active
          ? { type: 'spring', stiffness: 600, damping: 22, delay: 0.04 }
          : { duration: 0.12 }
      }
      style={{ transformOrigin: 'bottom center' }}
    >
      <svg width="30" height="32" viewBox="0 0 30 32" className="drop-shadow-[1px_2px_0_rgba(0,0,0,0.4)]">
        <path
          d="M4 13 C4 4 26 4 26 13 L26 18 L4 18 Z"
          fill="#fff"
          stroke="#000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <ellipse cx="9" cy="5.5" rx="2.8" ry="3.5" fill="#fff" stroke="#000" strokeWidth="1.3" />
        <ellipse cx="21" cy="5.5" rx="2.8" ry="3.5" fill="#fff" stroke="#000" strokeWidth="1.3" />
        <ellipse cx="15" cy="18" rx="8.5" ry="7" fill="#F5C9A8" stroke="#000" strokeWidth="1.5" />
        <circle cx="12" cy="17" r="1.15" fill="#000" />
        <circle cx="18" cy="17" r="1.15" fill="#000" />
        <path d="M11 21 Q15 23.5 19 21" fill="none" stroke="#000" strokeWidth="1.1" strokeLinecap="round" />
        <path
          d="M6 23 L24 23 L25 32 L5 32 Z"
          fill="#4A9FE8"
          stroke="#000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 23 L8 29" stroke="#6BCF4A" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 23 L22 29" stroke="#6BCF4A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}
