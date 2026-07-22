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
