import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/** Progressive stretch by nav href — Services short → FAQ longest */
export const JAKE_STRETCH_BY_HREF: Record<string, number> = {
  '#services': 40,
  '#command-deck': 95,
  '#portfolio': 150,
  '#pricing': 210,
  '#faq': 280,
}

type JakeStretchRideProps = {
  href: string | null
  playSound?: boolean
  className?: string
}

const Y = '#F5C518'
const YD = '#E8B000'
const H = 42
const BODY_H = 22
const FEET_W = 32
const HEAD_W = 40
const MAX_BODY = 280
const SVG_W = FEET_W + MAX_BODY + HEAD_W

/**
 * Seamless Jake inside the nav pill (behind link text).
 * One continuous yellow body — no cut PNG pieces.
 * Stretch length grows with the hovered link.
 */
export function JakeStretchRide({ href, playSound = true, className = '' }: JakeStretchRideProps) {
  const reduceMotion = useReducedMotion()
  const show = !reduceMotion && href !== null
  const bodyW = show ? (JAKE_STRETCH_BY_HREF[href!] ?? 100) : 18
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const wasShowing = useRef(false)

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio('/stickers/adventure/jake-stretch.mp3')
      a.preload = 'auto'
      a.volume = 0.3
      audioRef.current = a
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    if (show && playSound && !wasShowing.current) {
      a.currentTime = 0
      void a.play().catch(() => {})
    }
    if (!show) {
      a.pause()
      a.currentTime = 0
    }
    wasShowing.current = show
  }, [show, playSound])

  if (reduceMotion) return null

  const headX = FEET_W + bodyW - 8
  const visibleW = FEET_W + bodyW + HEAD_W - 8
  const bodyY = (H - BODY_H) / 2
  const t = { duration: show ? 0.48 : 0.28, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div aria-hidden className={`pointer-events-none absolute overflow-visible ${className}`}>
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{ opacity: show ? 0.9 : 0, width: Math.max(visibleW, 1) }}
        transition={t}
        style={{ height: H, marginLeft: 'auto' }}
      >
        <svg
          width={SVG_W}
          height={H}
          viewBox={`0 0 ${SVG_W} ${H}`}
          className="drop-shadow-[1px_2px_0_rgba(0,0,0,0.28)]"
          style={{ display: 'block' }}
        >
          {/* Stretching mid-body — continuous yellow */}
          <motion.rect
            x={FEET_W - 10}
            y={bodyY}
            height={BODY_H}
            rx={BODY_H / 2}
            fill={Y}
            stroke="#000"
            strokeWidth="2.2"
            initial={false}
            animate={{ width: bodyW + 20 }}
            transition={t}
          />
          <motion.rect
            x={FEET_W - 4}
            y={bodyY + BODY_H - 6}
            height={4}
            rx={2}
            fill={YD}
            opacity={0.3}
            initial={false}
            animate={{ width: bodyW + 8 }}
            transition={t}
          />

          {/* Rear / feet — fixed left, overlaps tube */}
          <g>
            <rect x={FEET_W - 12} y={bodyY + 1} width={14} height={BODY_H - 2} fill={Y} />
            <path
              d={`M${FEET_W - 6} ${bodyY}
                  C 16 ${bodyY}, 3 ${bodyY + 4}, 3 ${H / 2}
                  C 3 ${H - bodyY - 4}, 16 ${H - bodyY}, ${FEET_W - 6} ${H - bodyY}
                  Z`}
              fill={Y}
              stroke="#000"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <line x1={FEET_W - 6} y1={bodyY} x2={FEET_W + 4} y2={bodyY} stroke="#000" strokeWidth="2.2" />
            <line
              x1={FEET_W - 6}
              y1={H - bodyY}
              x2={FEET_W + 4}
              y2={H - bodyY}
              stroke="#000"
              strokeWidth="2.2"
            />
            <ellipse cx="11" cy={bodyY} rx="4" ry="4.5" fill={Y} stroke="#000" strokeWidth="1.8" />
            <path
              d={`M9 ${H - bodyY - 1} L7 ${H - 1} L13 ${H - 1} L14 ${H - bodyY - 1}`}
              fill={Y}
              stroke="#000"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d={`M17 ${H - bodyY - 1} L16 ${H - 1} L22 ${H - 1} L21 ${H - bodyY - 1}`}
              fill={Y}
              stroke="#000"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>

          {/* Head — rides the right end of the stretch */}
          <motion.g initial={false} animate={{ x: headX }} transition={t}>
            <rect x={-8} y={bodyY + 1} width={14} height={BODY_H - 2} fill={Y} />
            <line x1={-8} y1={bodyY} x2={2} y2={bodyY} stroke="#000" strokeWidth="2.2" />
            <line x1={-8} y1={H - bodyY} x2={2} y2={H - bodyY} stroke="#000" strokeWidth="2.2" />
            <ellipse cx="18" cy="16" rx="15" ry="13.5" fill={Y} stroke="#000" strokeWidth="2.2" />
            <ellipse cx="7" cy="7" rx="3.6" ry="4.5" fill={Y} stroke="#000" strokeWidth="1.7" />
            <ellipse cx="28" cy="7" rx="3.6" ry="4.5" fill={Y} stroke="#000" strokeWidth="1.7" />
            <circle cx="12.5" cy="13.5" r="5.4" fill="#fff" stroke="#000" strokeWidth="1.2" />
            <circle cx="23.5" cy="13.5" r="5.4" fill="#fff" stroke="#000" strokeWidth="1.2" />
            <circle cx="13.4" cy="14" r="2" fill="#000" />
            <circle cx="24.4" cy="14" r="2" fill="#000" />
            <ellipse cx="18" cy="21.5" rx="6.5" ry="4.2" fill="#F0D070" stroke="#000" strokeWidth="1.15" />
            <ellipse cx="18" cy="20" rx="1.6" ry="1.2" fill="#000" />
            <path d="M14.5 23.2 Q18 25.5 21.5 23.2" fill="none" stroke="#000" strokeWidth="1.15" strokeLinecap="round" />
            <ellipse cx="11" cy="32.5" rx="5" ry="3.4" fill={Y} stroke="#000" strokeWidth="1.7" />
            <ellipse cx="24" cy="32.5" rx="5" ry="3.4" fill={Y} stroke="#000" strokeWidth="1.7" />
          </motion.g>
        </svg>
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
