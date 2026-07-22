import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { FOUNDERS_SHORT } from '../data/brand'
import { Badge, Button, Reveal, Sticker } from './ui'
import { DiscordMockup } from './DiscordMockup'

const trustTypes = ['SaaS', 'Gaming', 'Web3', 'Creators', 'Brands']

function FloatingSticker({
  src,
  alt,
  className,
  delay = 0,
  lazy = false,
}: {
  src: string
  alt: string
  className?: string
  delay?: number
  lazy?: boolean
}) {
  const reduceMotion = useReducedMotion()

  // Decorative animated emotes: hide when user prefers reduced motion
  if (reduceMotion && src.endsWith('.gif')) return null

  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      loading={lazy ? 'lazy' : 'eager'}
      className={`pointer-events-none absolute select-none drop-shadow-[3px_3px_0_#000] ${className}`}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.7, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 260, damping: 18 }}
    />
  )
}

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      {/* Checker patch behind collage */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-5%] top-24 hidden h-48 w-64 rotate-[-8deg] opacity-40 checker-bg border-[3px] border-black md:block"
      />

      <div className="section-pad relative z-10 mx-auto grid max-w-7xl items-center gap-8 pb-12 sm:gap-10 sm:pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-20 xl:gap-12">
        <div className="relative max-w-2xl lg:max-w-xl xl:max-w-2xl">
          <Reveal>
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <Badge className="!bg-elevated !text-white gap-2 !font-bold tracking-[0.12em]">
                <span className="font-display text-[11px] tracking-[0.16em] text-yellow">01</span>
                <span aria-hidden className="h-3 w-px bg-white/25" />
                <span className="uppercase">Server ops</span>
              </Badge>
              <Sticker tone="lime" className="!border-[2.5px] !px-2.5 !py-1 !text-[11px] tracking-[0.08em] sm:!text-[12px]">
                Live in 3–7 days
              </Sticker>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              <Sticker tone="orange" className="sticker-rotate">
                Staff picks
              </Sticker>
              {!reduceMotion ? (
                <img
                  src="/stickers/emotes/staff-badge.gif"
                  alt=""
                  aria-hidden
                  className="h-8 w-8 drop-shadow-[2px_2px_0_#000] sm:h-9 sm:w-9"
                />
              ) : null}
            </div>
            <h1 className="banner-cobalt mt-1.5 max-w-full">
              <span className="text-pixel-3d block text-[clamp(1.75rem,calc(1rem+3.2vw),3.25rem)]">
                Your Discord
              </span>
              <span className="text-pixel-3d mt-1 block text-[clamp(1.75rem,calc(1rem+3.2vw),3.25rem)]">
                deserves better.
              </span>
            </h1>
            <p className="text-headline-lg mt-3 text-lime">We build it. You take the credit.</p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="text-body mt-4 max-w-md border-l-4 border-accent pl-3.5 text-muted sm:mt-5 sm:pl-4">
              Setup, bots, branding. Live in 3–7 days. You run the vibes, we run the rest.
            </p>
          </Reveal>

          <Reveal
            delay={0.14}
            className="mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Button href="#order?plan=Full%20Send" variant="primary" className="w-full sm:w-auto">
              Go Full Send
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Button>
            <Button href="#pricing" variant="secondary" className="w-full sm:w-auto">
              See pricing
            </Button>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-3 max-w-md text-[12px] leading-relaxed text-muted sm:text-[13px]">
              We read the #rules so your members don&apos;t have to. Wumpus-approved. Built by{' '}
              {FOUNDERS_SHORT}.
            </p>
          </Reveal>

          <Reveal delay={0.22} className="mt-7 sm:mt-8">
            <p className="text-label-caps mb-2.5 text-muted">Works for</p>
            <div className="flex flex-wrap gap-2">
              {trustTypes.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Reveal>

          <img
            src="/stickers/y2k/rewind.svg"
            alt=""
            aria-hidden
            className="mt-6 hidden h-9 w-auto drop-shadow-[3px_3px_0_#000] sm:block sticker-rotate"
          />
        </div>

        <div className="relative z-10 w-full min-w-0 max-w-full lg:pl-2">
          {/* Mobile: 1 emote. Desktop: 2 emotes + light SVG accents */}
          <FloatingSticker
            src="/stickers/emotes/peepo-pat.gif"
            alt=""
            className="right-1 top-[-14px] z-20 h-14 w-14 sm:right-2 sm:top-[-18px] sm:h-16 sm:w-16"
            delay={0.2}
          />
          <FloatingSticker
            src="/stickers/y2k/coin.svg"
            alt=""
            className="right-10 top-10 z-20 hidden h-8 w-8 md:block"
            delay={0.25}
          />
          <FloatingSticker
            src="/stickers/y2k/sparkle.svg"
            alt=""
            className="left-6 top-6 z-20 hidden h-6 w-6 lg:block"
            delay={0.28}
          />

          <div className="overflow-visible">
            <DiscordMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
