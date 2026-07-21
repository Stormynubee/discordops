import { useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { BatFace, DiscordFace, WumpusFace } from './mascots'

export function BackgroundMascot() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const sp = useSpring(scrollYProgress, { stiffness: 70, damping: 26 })

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 120, damping: 20 })
  const my = useSpring(rawY, { stiffness: 120, damping: 20 })

  // Descend and gently pulse in size as the page scrolls.
  const y = useTransform(sp, [0, 1], ['-2vh', '58vh'])
  const scale = useTransform(sp, [0, 0.5, 1], [0.85, 1.12, 1])

  // Tilt from cursor plus a small scroll-driven lean.
  const rotate = useTransform([mx, sp], ([m, s]) => (m as number) * 6 + ((s as number) - 0.5) * 8)

  // Crossfade Clyde -> Wumpus -> bat as the page scrolls.
  const discordOpacity = useTransform(sp, [0, 0.28, 0.36], [1, 1, 0])
  const wumpusOpacity = useTransform(sp, [0.3, 0.42, 0.58, 0.66], [0, 1, 1, 0])
  const batOpacity = useTransform(sp, [0.62, 0.74, 1], [0, 1, 1])

  // Pupils follow the cursor; they also drift down as you scroll.
  const pupilX = useTransform(mx, [-1, 1], [-10, 10])
  const pupilYMouse = useTransform(my, [-1, 1], [-8, 8])
  const scrollGaze = useTransform(sp, [0, 1], [-4, 10])
  const pupilY = useTransform(
    [pupilYMouse, scrollGaze],
    ([m, g]) => (m as number) + (g as number),
  )

  useEffect(() => {
    if (reduceMotion) return
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2)
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduceMotion, rawX, rawY])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute left-1/2 top-0 w-[min(72vmin,640px)]"
        style={
          reduceMotion
            ? { x: '-50%', opacity: 0.08 }
            : { x: '-50%', y, scale, rotate, opacity: 0.14, willChange: 'transform' }
        }
      >
        {/* Soft glow behind the mascot. Radial gradient instead of a blur filter,
            which would force an expensive re-raster on every scroll frame. */}
        <div
          className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 16%, transparent) 0%, transparent 70%)',
          }}
        />

        <svg viewBox="0 0 240 200" className="relative w-full">
          <motion.g style={reduceMotion ? undefined : { opacity: discordOpacity }}>
            <DiscordFace pupilX={pupilX} pupilY={pupilY} reduceMotion={!!reduceMotion} />
          </motion.g>
          {!reduceMotion ? (
            <>
              <motion.g style={{ opacity: wumpusOpacity }}>
                <WumpusFace pupilX={pupilX} pupilY={pupilY} reduceMotion={false} />
              </motion.g>
              <motion.g style={{ opacity: batOpacity }}>
                <BatFace pupilX={pupilX} pupilY={pupilY} reduceMotion={false} />
              </motion.g>
            </>
          ) : null}
        </svg>
      </motion.div>
    </div>
  )
}
