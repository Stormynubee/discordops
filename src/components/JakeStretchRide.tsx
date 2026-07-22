import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type JakeStretchRideProps = {
  stretched: boolean
  className?: string
}

const IDLE_W = 22
const FULL_W = 260
const BODY_H = 34

/**
 * Finn peeks on Jake while Jake's body grows in realtime (width, not scaleX).
 * Head + feet stay crisp; only the yellow midsection elongates.
 */
export function JakeStretchRide({ stretched, className = '' }: JakeStretchRideProps) {
  const reduceMotion = useReducedMotion()
  const active = !reduceMotion && stretched
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio('/stickers/adventure/jake-stretch.mp3')
      a.preload = 'auto'
      a.volume = 0.4
      audioRef.current = a
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    if (active) {
      a.currentTime = 0
      void a.play().catch(() => {
        /* autoplay may be blocked until a user gesture elsewhere */
      })
    } else {
      a.pause()
      a.currentTime = 0
    }
  }, [active])

  const stretchTransition = active
    ? { duration: 2.85, ease: [0.22, 1, 0.36, 1] as const }
    : { duration: 1.1, ease: [0.4, 0, 0.2, 1] as const }

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute overflow-visible ${className}`}
    >
      <div className="relative flex h-[72px] items-end">
        {/* Head cluster + Finn */}
        <div className="relative z-20 mb-[-2px] shrink-0">
          <motion.img
            src="/stickers/adventure/finn-peek.png"
            alt=""
            draggable={false}
            className="absolute left-1/2 top-0 z-30 h-11 w-11 -translate-x-1/2 object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)]"
            animate={{
              y: active ? -22 : 6,
              opacity: active ? 1 : 0.25,
              scale: active ? 1 : 0.85,
            }}
            transition={
              active
                ? { duration: 2.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.85, ease: [0.4, 0, 0.2, 1] }
            }
          />
          <img
            src="/stickers/adventure/jake-head.png"
            alt=""
            draggable={false}
            className="relative z-20 h-[58px] w-[58px] object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* Stretching mid-body — animate WIDTH in realtime */}
        <motion.div
          className="relative z-10 mb-[10px] overflow-hidden"
          style={{ height: BODY_H }}
          initial={false}
          animate={{ width: active ? FULL_W : IDLE_W }}
          transition={stretchTransition}
        >
          {/* Solid tube (crisp at any width) + texture image overlay */}
          <div
            className="absolute inset-y-0 left-0 right-0 rounded-[999px] border-[2.5px] border-black"
            style={{
              background:
                'linear-gradient(180deg, #ffe066 0%, #F5C518 45%, #e0a800 100%)',
              borderLeftWidth: 0,
              borderRightWidth: 0,
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.12)',
            }}
          />
          <img
            src="/stickers/adventure/jake-body.png"
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-fill opacity-90 mix-blend-multiply"
          />
        </motion.div>

        {/* Feet ride the end of the stretch */}
        <img
          src="/stickers/adventure/jake-feet.png"
          alt=""
          draggable={false}
          className="relative z-20 mb-[4px] ml-[-6px] h-11 w-11 shrink-0 object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
        />
      </div>
    </div>
  )
}
