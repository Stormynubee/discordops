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
    desc: 'Channels, bots, branding, automations. Usually done in 7 to 14 days.',
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
              borderColor: '#39ff9e',
              color: '#ff2d95',
              backgroundColor: '#16122a',
              boxShadow: '4px 4px 0 #000',
            }
          : {
              scale: 0.6,
              opacity: 0.45,
              borderColor: '#3d4dff',
              color: '#c8c4d8',
              backgroundColor: '#0c0a14',
              boxShadow: '0 0 0 #000',
            }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 380, damping: 22, delay: index * 0.05 }
      }
      className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-[3px] border-black bg-bg text-step text-[11px] sm:h-10 sm:w-10"
    >
      {inView && !reduceMotion ? (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-sm border-2 border-lime"
          initial={{ scale: 1, opacity: 0.65 }}
          animate={{ scale: 1.75, opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
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
    offset: ['start 0.8', 'end 0.4'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  })

  const lineScale = useTransform(smoothProgress, [0, 1], [0, 1])

  return (
    <section className="relative section-pad section-y-sm">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Process"
          title="Three steps. Two weeks. Done."
          description="No endless email chains. Just a clear path to a server that works."
        />

        <div ref={listRef} className="relative mt-2 overflow-visible sm:mt-4">
          <div
            aria-hidden
            className="absolute left-[17px] top-4 hidden h-[calc(100%-2rem)] w-px bg-border sm:left-[19px] md:block"
          />
          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="absolute left-[17px] top-4 hidden h-[calc(100%-2rem)] w-px origin-top bg-gradient-to-b from-accent via-lime to-cobalt/50 sm:left-[19px] md:block"
              style={{ scaleY: lineScale }}
            />
          ) : (
            <div
              aria-hidden
              className="absolute left-[17px] top-4 hidden h-[calc(100%-2rem)] w-px bg-accent/45 sm:left-[19px] md:block"
            />
          )}

          <ol className="space-y-9 sm:space-y-11 md:space-y-12">
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
                <div className="min-w-0 flex-1 overflow-visible pt-1">
                  <h3 className="text-title text-lg text-text sm:text-xl md:text-2xl">{step.title}</h3>
                  <p className="mt-1.5 max-w-lg text-[14px] leading-relaxed text-muted sm:mt-2 sm:text-[15px]">
                    {step.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
