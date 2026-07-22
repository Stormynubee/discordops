import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BrandMark } from './BrandMark'

type SplashScreenProps = {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const reduceMotion = useReducedMotion()
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      const t = window.setTimeout(onComplete, 150)
      return () => window.clearTimeout(t)
    }
    const exitTimer = window.setTimeout(() => setExiting(true), 1500)
    return () => window.clearTimeout(exitTimer)
  }, [reduceMotion, onComplete])

  useEffect(() => {
    if (!exiting) return
    const done = window.setTimeout(onComplete, 900)
    return () => window.clearTimeout(done)
  }, [exiting, onComplete])

  if (reduceMotion) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
        role="presentation"
        aria-hidden
      />
    )
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      role="presentation"
      aria-hidden
      style={{ pointerEvents: exiting ? 'none' : 'auto' }}
    >
      {/* Backdrop — fades to reveal site underneath */}
      <motion.div
        className="absolute inset-0 bg-bg"
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.75, delay: exiting ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Signal rings — stroke only, no glow fill */}
        <motion.span
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 md:h-52 md:w-52"
          initial={{ opacity: 0, scale: 0.55 }}
          animate={
            exiting
              ? { opacity: 0, scale: 1.8 }
              : { opacity: [0, 0.5, 0], scale: [0.55, 1.35, 1.6] }
          }
          transition={
            exiting
              ? { duration: 0.4, ease: 'easeOut' }
              : { duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
          }
        />
        <motion.span
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 md:h-52 md:w-52"
          initial={{ opacity: 0, scale: 0.55 }}
          animate={
            exiting
              ? { opacity: 0, scale: 1.5 }
              : { opacity: [0, 0.35, 0], scale: [0.55, 1.15, 1.45] }
          }
          transition={
            exiting
              ? { duration: 0.35, ease: 'easeOut' }
              : { duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
        />

        {/* Cop Peepo mark — enters, then lifts into the site */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={
            exiting
              ? {
                  opacity: [1, 1, 0],
                  scale: [1, 0.55, 0.2],
                  y: [0, -120, -280],
                  x: [0, -40, -120],
                  rotate: [0, -8, -18],
                }
              : { opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 }
          }
          transition={
            exiting
              ? { duration: 0.85, ease: [0.33, 0.1, 0.25, 1], times: [0, 0.45, 1] }
              : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <BrandMark size={112} className="drop-shadow-[4px_4px_0_#000]" />
        </motion.div>

        {/* Wordmark — fades as mark departs */}
        <motion.p
          className="text-brand mt-6 text-xl text-text md:text-2xl"
          initial={{ opacity: 0, y: 8 }}
          animate={
            exiting
              ? { opacity: 0, y: 12 }
              : { opacity: 1, y: 0 }
          }
          transition={
            exiting
              ? { duration: 0.3, ease: 'easeOut' }
              : { duration: 0.35, delay: 1.05, ease: [0.22, 1, 0.36, 1] }
          }
        >
          Deez<span className="text-accent">Ops</span>
        </motion.p>
      </div>
    </div>
  )
}
