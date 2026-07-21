import { useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { MouseEvent } from 'react'
import { FOUNDERS_SHORT } from '../data/brand'
import { Badge, Button, Reveal } from './ui'
import { InteractiveGotham } from './Effects'
import { DiscordMockup } from './DiscordMockup'

const trustTypes = ['SaaS', 'Gaming', 'Web3', 'Creators', 'Brands']

export function Hero() {
  const rawX = useMotionValue(50)
  const rawY = useMotionValue(82)
  const x = useSpring(rawX, { stiffness: 70, damping: 22 })
  const y = useSpring(rawY, { stiffness: 70, damping: 22 })

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set(((e.clientX - rect.left) / rect.width) * 100)
    const py = ((e.clientY - rect.top) / rect.height) * 100
    rawY.set(Math.min(95, Math.max(55, 55 + py * 0.45)))
  }

  const onLeave = () => {
    rawX.set(50)
    rawY.set(82)
  }

  return (
    <section
      id="top"
      className="relative min-h-screen pt-24 md:pt-28"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 overflow-visible md:h-64 lg:h-72">
        <InteractiveGotham x={x} y={y} />
      </div>

      <div className="section-pad relative z-10 mx-auto grid max-w-7xl items-center gap-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24">
        <div className="max-w-xl">
          <Reveal>
            <h1 className="text-display-sm overflow-visible text-text">Your Discord deserves better.</h1>
            <p className="text-headline-lg mt-3 overflow-visible text-accent">We build it. You take the credit.</p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-md border-l-2 border-accent pl-4 text-[16px] leading-relaxed text-muted">
              Setup, bots, branding. Live in two weeks. You run the vibes, we run the rest.
            </p>
          </Reveal>

          <Reveal delay={0.14} className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="#order?plan=Full%20Send" variant="primary">
              Go Full Send
              <ArrowUpRight size={16} strokeWidth={2} />
            </Button>
            <Button href="#pricing" variant="secondary">
              See pricing
            </Button>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-3 text-[12px] text-muted">
              We read the #rules so your members don&apos;t have to. Wumpus-approved. Built by{' '}
              {FOUNDERS_SHORT}.
            </p>
          </Reveal>

          <Reveal delay={0.22} className="mt-8">
            <p className="text-label-caps mb-2 text-muted">Works for</p>
            <div className="flex flex-wrap gap-2">
              {trustTypes.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative z-10 w-full max-w-full lg:-mr-6 lg:pl-2">
          <DiscordMockup />
        </div>
      </div>
    </section>
  )
}
