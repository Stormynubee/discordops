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
import { DEFAULT_PLAN, getPlan } from '../data/plans'
import { orderHref } from '../lib/order'

const ACCENT = '#ff6b1a'
const FLAGSHIP = getPlan(DEFAULT_PLAN) ?? { price: '459' }

/**
 * Floating bat orb — scroll progress ring + primary CTA to Full Send.
 */
export function DiscordOrb() {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLAnchorElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const [deep, setDeep] = useState(false)

  const { scrollYProgress } = useScroll()
  const ringProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  const badgeTilt = useTransform(scrollYProgress, [0, 1], [-7, 7])

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const px = useSpring(rawX, { stiffness: 200, damping: 18 })
  const py = useSpring(rawY, { stiffness: 200, damping: 18 })

  const scrollGaze = useTransform(scrollYProgress, [0, 1], [-3, 8])
  const pupilX = useTransform(px, [-1, 1], [-9, 9])
  const pupilYMouse = useTransform(py, [-1, 1], [-8, 8])
  const pupilY = useTransform([pupilYMouse, scrollGaze], ([m, g]) => (m as number) + (g as number))

  const centerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setDeep(v >= 0.55)
    })
    return unsub
  }, [scrollYProgress])

  useEffect(() => {
    if (reduceMotion) return

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

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2 md:bottom-8 md:right-8">
      {/* Hint after you’ve scrolled deep enough */}
      <motion.div
        aria-hidden
        className="pointer-events-none rounded-sm border-2 border-black bg-elevated px-2 py-1 shadow-[2px_2px_0_#000]"
        initial={false}
        animate={{
          opacity: hovered || deep ? 1 : 0,
          y: hovered || deep ? 0 : 6,
          scale: hovered || deep ? 1 : 0.92,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      >
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-lime">
          {deep ? 'Ready?' : 'Full Send'}
        </p>
        <p className="text-[9px] font-bold text-yellow">${FLAGSHIP.price}</p>
      </motion.div>

      <motion.a
        ref={ref}
        href={orderHref(DEFAULT_PLAN)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        aria-label={`Go Full Send for $${FLAGSHIP.price}`}
        title={`Go Full Send · $${FLAGSHIP.price}`}
        className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:h-[4.5rem] md:w-[4.5rem]"
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

          {/* Scroll progress = “how far you’ve read” before committing */}
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

          <motion.circle
            cx="50"
            cy="52"
            r="30"
            fill={ACCENT}
            animate={{ opacity: hovered && !reduceMotion ? 0.16 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <g transform="translate(4.4 12) scale(0.38)">
            <BatFace pupilX={pupilX} pupilY={pupilY} reduceMotion={!!reduceMotion} />
          </g>
        </svg>
      </motion.a>
    </div>
  )
}
