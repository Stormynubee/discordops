import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

/** Kept for preload / export tooling — runtime uses the max frame only. */
export const JAKE_FRAMES = [
  '/stickers/adventure/frames/01.png',
  '/stickers/adventure/frames/02.png',
  '/stickers/adventure/frames/03.png',
  '/stickers/adventure/frames/04.png',
  '/stickers/adventure/frames/05.png',
  '/stickers/adventure/frames/06.png',
  '/stickers/adventure/frames/07.png',
] as const

/** Native widths at 48px height — used as spring targets per link. */
const WIDTH_BY_HREF: Record<string, number> = {
  '#services': 113,
  '#command-deck': 155,
  '#portfolio': 210,
  '#pricing': 290,
  '#faq': 362,
}

export const JAKE_FRAME_BY_HREF: Record<string, number> = {
  '#services': 0,
  '#command-deck': 1,
  '#portfolio': 3,
  '#pricing': 5,
  '#faq': 6,
}

export const JAKE_PROGRESS_BY_HREF: Record<string, number> = {
  '#services': 0,
  '#command-deck': 0.25,
  '#portfolio': 0.5,
  '#pricing': 0.75,
  '#faq': 1,
}

const JAKE_SRC = JAKE_FRAMES[6]
const JAKE_FULL_W = 362

type JakeStretchRideProps = {
  href: string | null
  playSound?: boolean
  className?: string
}

/**
 * Jake inside the nav pill, behind link text.
 * Single PNG only — anchored at Services (left), spring grows toward FAQ (right).
 * Image is right-aligned in the clip so the head leads the stretch.
 */
export function JakeStretchRide({ href, playSound = true, className = '' }: JakeStretchRideProps) {
  const reduceMotion = useReducedMotion()
  const show = !reduceMotion && href !== null
  const targetWidth = show ? (WIDTH_BY_HREF[href!] ?? 155) : 113

  const widthTarget = useMotionValue(targetWidth)
  const visibleTarget = useMotionValue(show ? 1 : 0)

  const width = useSpring(widthTarget, {
    stiffness: 80,
    damping: 17,
    mass: 0.48,
  })
  const visible = useSpring(visibleTarget, {
    stiffness: 150,
    damping: 24,
    mass: 0.35,
  })
  const shellOpacity = useTransform(visible, (v) => v * 0.95)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastWidth = useRef(targetWidth)
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
    const img = new Image()
    img.src = JAKE_SRC
  }, [])

  useEffect(() => {
    widthTarget.set(targetWidth)
  }, [widthTarget, targetWidth])

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
    const grew = targetWidth > lastWidth.current + 4
    if (playSound && (!wasShowing.current || grew)) {
      a.currentTime = 0
      void a.play().catch(() => {})
    }
    wasShowing.current = true
    lastWidth.current = targetWidth
  }, [show, playSound, targetWidth])

  if (reduceMotion) return null

  return (
    <div aria-hidden className={`pointer-events-none absolute overflow-visible ${className}`}>
      <motion.div
        className="relative overflow-hidden"
        style={{
          height: 48,
          marginRight: 'auto',
          width,
          opacity: shellOpacity,
        }}
      >
        {/*
          Left-anchored clip grows toward FAQ.
          Image stays right-aligned inside so the head leads to the right.
        */}
        <img
          src={JAKE_SRC}
          alt=""
          width={JAKE_FULL_W}
          height={48}
          draggable={false}
          className="absolute bottom-0 right-0 h-12 max-w-none select-none drop-shadow-[1px_2px_0_rgba(0,0,0,0.28)]"
          style={{ width: JAKE_FULL_W }}
        />
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
