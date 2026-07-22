import { useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

const MOUSE_STRENGTH = 15

export function SiteAtmosphere() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const gridDrift = useTransform(scrollYProgress, [0, 1], [0, 200])
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
    [0.03, 0.05, 0.07, 0.09, 0.07, 0.05, 0.03],
  )
  const gridScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.015, 1.03])

  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  const mouseX = useSpring(rawMouseX, { stiffness: 40, damping: 28 })
  const mouseY = useSpring(rawMouseY, { stiffness: 40, damping: 28 })

  const gridY = useTransform(
    [gridDrift, mouseY],
    ([scroll, mouse]) => (scroll as number) + (mouse as number),
  )

  useEffect(() => {
    if (reduceMotion) return

    let raf = 0
    let last: MouseEvent | null = null
    const flush = () => {
      raf = 0
      if (!last) return
      const nx = (last.clientX / window.innerWidth - 0.5) * 2
      const ny = (last.clientY / window.innerHeight - 0.5) * 2
      rawMouseX.set(nx * MOUSE_STRENGTH)
      rawMouseY.set(ny * MOUSE_STRENGTH)
    }
    const onMove = (e: MouseEvent) => {
      last = e
      if (!raf) raf = window.requestAnimationFrame(flush)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [reduceMotion, rawMouseX, rawMouseY])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--color-bg) 0%, color-mix(in srgb, var(--color-elevated) 50%, var(--color-bg)) 42%, color-mix(in srgb, var(--color-surface) 40%, var(--color-bg)) 58%, var(--color-bg) 100%)',
        }}
      />

      <motion.div
        className="atmosphere-grid absolute -inset-[12%]"
        style={
          reduceMotion
            ? { opacity: 0.05 }
            : {
                opacity: gridOpacity,
                scale: gridScale,
                x: mouseX,
                y: gridY,
                willChange: 'transform',
              }
        }
      />
    </div>
  )
}
