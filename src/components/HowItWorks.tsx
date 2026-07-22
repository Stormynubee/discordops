import { useRef } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { SectionHeading } from './ui'

const steps = [
  {
    num: '01',
    title: 'Tell us what you need',
    desc: 'Send a message. We reply within 24 hours. Faster if the coffee hit.',
  },
  {
    num: '02',
    title: 'We build your server',
    desc: 'Channels, bots, branding, automations. Usually done in 3 to 7 days.',
  },
  {
    num: '03',
    title: 'You go live',
    desc: 'Launch day. Training included. Panic sold separately.',
  },
]

function StepPointer({
  num,
  index,
  reduceMotion,
}: {
  num: string
  index: number
  reduceMotion: boolean | null
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.75, margin: '-6% 0px' })

  return (
    <motion.span
      ref={ref}
      initial={reduceMotion ? false : { scale: 0.6, opacity: 0.4 }}
      animate={
        inView
          ? {
              scale: 1,
              opacity: 1,
              borderColor: 'var(--color-lime)',
              color: 'var(--color-accent)',
              backgroundColor: 'var(--color-surface)',
            }
          : {
              scale: 0.6,
              opacity: 0.45,
              borderColor: 'var(--color-cobalt)',
              color: 'var(--color-silver)',
              backgroundColor: 'var(--color-bg)',
            }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 380, damping: 22, delay: index * 0.05 }
      }
      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border-[3px] bg-bg text-step text-[11px] sm:h-11 sm:w-11 sm:text-xs ${
        inView ? 'step-node-glow' : 'border-black shadow-[4px_4px_0_#000]'
      }`}
    >
      {inView && !reduceMotion ? (
        <motion.span
          aria-hidden
          className="absolute inset-[-3px] rounded-sm border-2 border-lime"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 1.85, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      ) : null}
      {num}
    </motion.span>
  )
}

export function HowItWorks() {
  const reduceMotion = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.75', 'end 0.45'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  })

  const lineScale = useTransform(smoothProgress, [0, 1], [0, 1])
  const beadTop = useTransform(smoothProgress, [0, 1], ['1.25rem', 'calc(100% - 1.25rem)'])

  return (
    <section className="section-cv relative section-pad section-y-sm">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Process"
          title="Three steps. 3–7 days. Done."
          description="No endless email chains. Just a clear path to a server that works."
        />

        <div ref={listRef} className="relative mt-2 overflow-visible sm:mt-4">
          {/* Track — always visible so the pathway reads on mobile too */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[19px] top-5 bottom-5 w-[3px] -translate-x-1/2 rounded-full bg-cobalt/35 sm:left-[21px]"
          />

          {/* Filled pathway that grows with scroll */}
          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-[19px] top-5 bottom-5 w-[3px] origin-top -translate-x-1/2 rounded-full step-pathway-fill sm:left-[21px]"
              style={{ scaleY: lineScale }}
            />
          ) : (
            <div
              aria-hidden
              className="pointer-events-none absolute left-[19px] top-5 bottom-5 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-accent via-lime to-lime/60 sm:left-[21px]"
            />
          )}

          {/* Traveling glow bead along the path */}
          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-[19px] h-3 w-3 -translate-x-1/2 rounded-full bg-lime step-pathway-bead sm:left-[21px]"
              style={{ top: beadTop }}
            />
          ) : null}

          <ol className="space-y-10 sm:space-y-12 md:space-y-14">
            {steps.map((step, i) => (
              <motion.li
                key={step.num}
                initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-4 overflow-visible sm:gap-6 md:gap-8"
              >
                <StepPointer num={step.num} index={i} reduceMotion={reduceMotion} />
                <div className="min-w-0 flex-1 overflow-visible pt-1.5">
                  <h3 className="text-title text-lg text-text sm:text-xl md:text-2xl">{step.title}</h3>
                  <p className="mt-1.5 text-body-sm text-muted">{step.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
