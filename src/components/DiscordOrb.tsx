import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { BatFace } from './mascots'

const ACCENT = '#ff6b1a'

export function DiscordOrb() {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLButtonElement | null>(null)
  const [hovered, setHovered] = useState(false)

  const { scrollYProgress } = useScroll()
  const ringProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  const badgeTilt = useTransform(scrollYProgress, [0, 1], [-7, 7])

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const px = useSpring(rawX, { stiffness: 200, damping: 18 })
  const py = useSpring(rawY, { stiffness: 200, damping: 18 })

  // Pupils track the cursor (face coordinate units) and look down as you scroll.
  const scrollGaze = useTransform(scrollYProgress, [0, 1], [-3, 8])
  const pupilX = useTransform(px, [-1, 1], [-9, 9])
  const pupilYMouse = useTransform(py, [-1, 1], [-8, 8])
  const pupilY = useTransform([pupilYMouse, scrollGaze], ([m, g]) => (m as number) + (g as number))

  const centerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reduceMotion) return

    // Cache the orb center instead of reading layout on every mouse move.
    // It is fixed-positioned, so it only shifts on resize.
    const measure = () => {
      const node = ref.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    }
    measure()
    const settle = window.setTimeout(measure, 1600)
    window.addEventListener('resize', measure)

    let raf = 0
    let last: MouseEvent | null = null
    const flush = () => {
      raf = 0
      if (!last) return
      const { x, y } = centerRef.current
      rawX.set(Math.max(-1, Math.min(1, (last.clientX - x) / 260)))
      rawY.set(Math.max(-1, Math.min(1, (last.clientY - y) / 260)))
    }
    const onMove = (e: MouseEvent) => {
      last = e
      if (!raf) raf = requestAnimationFrame(flush)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('resize', measure)
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduceMotion, rawX, rawY])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-40 md:bottom-8 md:right-8">
      <motion.button
        ref={ref}
        type="button"
        onClick={scrollTop}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        aria-label="Back to top"
        className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full outline-none md:h-[4.5rem] md:w-[4.5rem]"
        style={reduceMotion ? undefined : { rotate: badgeTilt }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.6, y: 24 }}
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, y: hovered ? 0 : [0, -6, 0] }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                opacity: { duration: 0.4, delay: 1.4 },
                scale: { type: 'spring', stiffness: 260, damping: 18, delay: 1.4 },
                y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        whileHover={reduceMotion ? undefined : { scale: 1.12 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[4px_4px_0_#000]">
          <circle cx="50" cy="50" r="47" fill="var(--color-card)" stroke="#ffe600" strokeWidth="3" />

          {/* Scroll progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={ACCENT}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              pathLength: reduceMotion ? 0.25 : ringProgress,
              rotate: -90,
              transformOrigin: '50% 50%',
              filter: 'drop-shadow(3px 3px 0 #000)',
            }}
          />

          {/* Hover glow */}
          <motion.circle
            cx="50"
            cy="52"
            r="30"
            fill={ACCENT}
            animate={{ opacity: hovered && !reduceMotion ? 0.16 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Bat character, scaled into the badge */}
          <g transform="translate(4.4 12) scale(0.38)">
            <BatFace pupilX={pupilX} pupilY={pupilY} reduceMotion={!!reduceMotion} />
          </g>
        </svg>
      </motion.button>
    </div>
  )
}
