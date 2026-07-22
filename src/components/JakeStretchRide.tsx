import { useEffect, useRef, useState } from 'react'
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

/**
 * Stretch progress per link (0 → 1). FAQ = full pill width, never past it.
 */
const PROGRESS_BY_HREF: Record<string, number> = {
  '#services': 0.3,
  '#command-deck': 0.46,
  '#portfolio': 0.62,
  '#pricing': 0.8,
  '#faq': 1,
}

export const JAKE_FRAME_BY_HREF: Record<string, number> = {
  '#services': 0,
  '#command-deck': 1,
  '#portfolio': 3,
  '#pricing': 5,
  '#faq': 6,
}

export const JAKE_PROGRESS_BY_HREF = PROGRESS_BY_HREF

const JAKE_SRC = JAKE_FRAMES[6]

type JakeStretchRideProps = {
  href: string | null
  playSound?: boolean
  className?: string
}

/**
 * Jake inside the nav pill, behind link text.
 * Scales to the pill width — FAQ stretch fills the bar, never overgrows it.
 */
export function JakeStretchRide({ href, playSound = true, className = '' }: JakeStretchRideProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [fitW, setFitW] = useState(260)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const pill = root.closest('ul')
    if (!pill) return

    const measure = () => {
      // Stay inside the pill: leave a couple px so the head never kisses the border
      const next = Math.max(180, Math.floor(pill.clientWidth - 14))
      setFitW(next)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(pill)
    return () => ro.disconnect()
  }, [])

  const show = !reduceMotion && href !== null
  const progress = show ? (PROGRESS_BY_HREF[href!] ?? 0.46) : 0.3
  const targetWidth = Math.round(fitW * progress)

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
  const shellOpacity = useTransform(visible, (v) => v * 0.9)

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
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none absolute overflow-hidden ${className}`}
    >
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
          Jake is scaled to fitW so at FAQ (progress=1) he fills the pill exactly.
          Clip grows left→right; head leads toward FAQ and stops at the right edge.
        */}
        <img
          src={JAKE_SRC}
          alt=""
          height={48}
          draggable={false}
          className="absolute bottom-0 right-0 h-12 max-w-none select-none drop-shadow-[1px_2px_0_rgba(0,0,0,0.28)]"
          style={{ width: fitW }}
        />
      </motion.div>
    </div>
  )
}

type FinnPricingPopProps = {
  active: boolean
  className?: string
}

/** Small Finn peek above Pricing — clear of Jake and label text. */
export function FinnPricingPop({ active, className = '' }: FinnPricingPopProps) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 z-[40] -translate-x-1/2 ${className}`}
      initial={false}
      animate={{
        y: active ? 0 : 10,
        opacity: active ? 1 : 0,
        scale: active ? 1 : 0.82,
      }}
      transition={
        active
          ? { type: 'spring', stiffness: 520, damping: 20, delay: 0.06 }
          : { duration: 0.14 }
      }
      style={{ transformOrigin: 'bottom center' }}
    >
      <img
        src="/stickers/adventure/finn-peek.png"
        alt=""
        width={40}
        height={36}
        draggable={false}
        className="h-9 w-auto max-w-none select-none drop-shadow-[1px_2px_0_rgba(0,0,0,0.45)]"
      />
    </motion.div>
  )
}
