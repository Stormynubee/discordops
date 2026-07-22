import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

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

const WIDTH_MIN = 113
const WIDTH_MAX = 362

/**
 * Even progress across the 5 nav links (0 → 1).
 * Spring eases through the in-between frames so stretch isn't a hard cut.
 */
export const JAKE_PROGRESS_BY_HREF: Record<string, number> = {
  '#services': 0,
  '#command-deck': 0.25,
  '#portfolio': 0.5,
  '#pricing': 0.75,
  '#faq': 1,
}

/** @deprecated kept for any old imports — prefer JAKE_PROGRESS_BY_HREF */
export const JAKE_FRAME_BY_HREF: Record<string, number> = {
  '#services': 0,
  '#command-deck': 1,
  '#portfolio': 3,
  '#pricing': 5,
  '#faq': 6,
}

const LAST = JAKE_FRAMES.length - 1

type JakeStretchRideProps = {
  href: string | null
  playSound?: boolean
  className?: string
}

function JakeFrame({
  src,
  index,
  frameFloat,
}: {
  src: string
  index: number
  frameFloat: MotionValue<number>
}) {
  // Triangle blend: only the two nearest frames are visible — no ghost stack.
  const opacity = useTransform(frameFloat, (v) => {
    const d = Math.abs(v - index)
    if (d >= 1) return 0
    return 1 - d
  })

  return (
    <motion.img
      src={src}
      alt=""
      draggable={false}
      style={{ opacity }}
      className="absolute bottom-0 right-0 h-12 w-auto max-w-none select-none drop-shadow-[1px_2px_0_rgba(0,0,0,0.28)]"
    />
  )
}

/**
 * Jake inside the nav pill, behind link text.
 * Spring-smoothed stretch: continuous width + adjacent-frame crossfade.
 */
export function JakeStretchRide({ href, playSound = true, className = '' }: JakeStretchRideProps) {
  const reduceMotion = useReducedMotion()
  const show = !reduceMotion && href !== null
  const targetProgress = show ? (JAKE_PROGRESS_BY_HREF[href!] ?? 0.25) : 0

  const progressTarget = useMotionValue(targetProgress)
  const visibleTarget = useMotionValue(show ? 1 : 0)

  const progress = useSpring(progressTarget, {
    stiffness: 70,
    damping: 18,
    mass: 0.5,
  })
  const visible = useSpring(visibleTarget, {
    stiffness: 140,
    damping: 22,
    mass: 0.4,
  })

  // Continuous rubber-band width (smooth — no stepped jumps between frame sizes)
  const width = useTransform(progress, [0, 1], [WIDTH_MIN, WIDTH_MAX])
  const frameFloat = useTransform(progress, [0, 1], [0, LAST])
  const shellOpacity = useTransform(visible, (v) => v * 0.92)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastProgress = useRef(targetProgress)
  const wasShowing = useRef(false)

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio('/stickers/adventure/jake-stretch.mp3')
      a.preload = 'auto'
      a.volume = 0.28
      audioRef.current = a
    }
  }, [])

  useEffect(() => {
    for (const src of JAKE_FRAMES) {
      const img = new Image()
      img.src = src
    }
  }, [])

  useEffect(() => {
    progressTarget.set(targetProgress)
  }, [progressTarget, targetProgress])

  useEffect(() => {
    visibleTarget.set(show ? 1 : 0)
  }, [visibleTarget, show])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    if (!show) {
      a.pause()
      a.currentTime = 0
      wasShowing.current = false
      return
    }
    const grew = targetProgress > lastProgress.current + 0.04
    if (playSound && (!wasShowing.current || grew)) {
      a.currentTime = 0
      void a.play().catch(() => {})
    }
    wasShowing.current = true
    lastProgress.current = targetProgress
  }, [show, playSound, targetProgress])

  if (reduceMotion) return null

  return (
    <div aria-hidden className={`pointer-events-none absolute overflow-visible ${className}`}>
      <motion.div
        className="relative overflow-hidden"
        style={{
          height: 48,
          marginLeft: 'auto',
          width,
          opacity: shellOpacity,
        }}
      >
        {JAKE_FRAMES.map((src, i) => (
          <JakeFrame key={src} src={src} index={i} frameFloat={frameFloat} />
        ))}
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
