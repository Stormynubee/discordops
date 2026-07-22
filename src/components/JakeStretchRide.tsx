import { motion, useReducedMotion } from 'framer-motion'

type JakeStretchRideProps = {
  stretched: boolean
  className?: string
}

/** Horizontal Finn-on-Jake stretch easter egg. Decorative only. */
export function JakeStretchRide({ stretched, className = '' }: JakeStretchRideProps) {
  const reduceMotion = useReducedMotion()
  const active = !reduceMotion && stretched

  const out = { duration: 2.8, ease: [0.22, 1, 0.36, 1] as const }
  const back = { duration: 1.15, ease: [0.4, 0, 0.2, 1] as const }
  const t = active ? out : back

  // Body grows left→right; compact idle is a short stump
  const bodyScale = active ? 1 : 0.18
  const bodyWidth = 220
  const feetX = active ? bodyWidth - 8 : bodyWidth * 0.18 - 4
  const finnY = active ? -10 : 14
  const finnOpacity = active ? 1 : 0.35

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute h-14 w-[280px] overflow-visible ${className}`}
    >
      <div className="relative h-full w-full">
        {/* Stretch body */}
        <motion.div
          className="absolute left-[36px] top-[22px] h-7 origin-left"
          style={{ width: bodyWidth }}
          animate={{ scaleX: bodyScale }}
          transition={t}
        >
          <svg viewBox="0 0 220 28" className="h-full w-full" preserveAspectRatio="none">
            <rect x="0" y="2" width="220" height="24" rx="12" fill="#F5C518" stroke="#1a1a1a" strokeWidth="2.5" />
          </svg>
        </motion.div>

        {/* Feet at stretch end */}
        <motion.div
          className="absolute top-[26px]"
          animate={{ x: feetX }}
          transition={t}
        >
          <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
            <ellipse cx="10" cy="14" rx="8" ry="6" fill="#F5C518" stroke="#1a1a1a" strokeWidth="2" />
            <ellipse cx="26" cy="14" rx="8" ry="6" fill="#F5C518" stroke="#1a1a1a" strokeWidth="2" />
            <path d="M6 12 Q10 6 14 12" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
            <path d="M22 12 Q26 6 30 12" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
          </svg>
        </motion.div>

        {/* Jake head (fixed left) */}
        <div className="absolute left-0 top-[10px] z-10">
          <svg width="52" height="44" viewBox="0 0 52 44" fill="none">
            <ellipse cx="26" cy="24" rx="20" ry="16" fill="#F5C518" stroke="#1a1a1a" strokeWidth="2.5" />
            {/* muzzle */}
            <ellipse cx="26" cy="30" rx="11" ry="8" fill="#F5C518" stroke="#1a1a1a" strokeWidth="2" />
            <ellipse cx="26" cy="28" rx="3.2" ry="2.4" fill="#1a1a1a" />
            {/* eyes */}
            <circle cx="18" cy="20" r="6.5" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="34" cy="20" r="6.5" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="19.5" cy="21" r="2.2" fill="#1a1a1a" />
            <circle cx="35.5" cy="21" r="2.2" fill="#1a1a1a" />
            {/* arms */}
            <path
              d="M8 28 Q2 34 8 38"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="8" cy="38" r="3.5" fill="#F5C518" stroke="#1a1a1a" strokeWidth="2" />
            <path
              d="M44 28 Q50 34 44 38"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="44" cy="38" r="3.5" fill="#F5C518" stroke="#1a1a1a" strokeWidth="2" />
          </svg>
        </div>

        {/* Finn peeking on Jake's head */}
        <motion.div
          className="absolute left-[10px] top-0 z-20"
          animate={{ y: finnY, opacity: finnOpacity }}
          transition={{
            ...(active
              ? { duration: 2.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.9, ease: [0.4, 0, 0.2, 1] }),
          }}
        >
          <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
            {/* hood */}
            <ellipse cx="20" cy="16" rx="14" ry="13" fill="#F4F0E8" stroke="#1a1a1a" strokeWidth="2" />
            <ellipse cx="11" cy="6" rx="3.5" ry="4" fill="#F4F0E8" stroke="#1a1a1a" strokeWidth="1.75" />
            <ellipse cx="29" cy="6" rx="3.5" ry="4" fill="#F4F0E8" stroke="#1a1a1a" strokeWidth="1.75" />
            {/* face hole */}
            <ellipse cx="20" cy="18" rx="8" ry="7.5" fill="#F5C9A8" stroke="#1a1a1a" strokeWidth="1.75" />
            <circle cx="17" cy="17" r="1.3" fill="#1a1a1a" />
            <circle cx="23" cy="17" r="1.3" fill="#1a1a1a" />
            <path d="M16 21 Q20 24 24 21" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* shirt peek */}
            <rect x="12" y="28" width="16" height="7" rx="2" fill="#6EC1E4" stroke="#1a1a1a" strokeWidth="1.75" />
            {/* arms out when peeking */}
            <path d="M12 30 L4 26" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 30 L36 26" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="4" cy="26" r="2.5" fill="#F5C9A8" stroke="#1a1a1a" strokeWidth="1.5" />
            <circle cx="36" cy="26" r="2.5" fill="#F5C9A8" stroke="#1a1a1a" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
