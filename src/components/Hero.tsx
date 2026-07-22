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
}: {
  src: string
  alt: string
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      className={`pointer-events-none absolute select-none drop-shadow-[3px_3px_0_#000] ${className}`}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.7, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 260, damping: 18 }}
    />
  )
}

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden pt-20 sm:pt-24 md:pt-28">
      {/* Checker patch behind collage */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-5%] top-24 hidden h-48 w-64 rotate-[-8deg] opacity-40 checker-bg border-[3px] border-black md:block"
      />

      <div className="section-pad relative z-10 mx-auto grid max-w-7xl items-center gap-10 pb-16 sm:gap-12 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24">
        <div className="relative max-w-xl">
          {/* Notification pill */}
          <Reveal>
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 rounded-sm border-[2.5px] border-black bg-elevated px-2.5 py-1.5 text-[11px] shadow-[3px_3px_0_#000]">
                <img src="/stickers/y2k/heart.svg" alt="" className="h-4 w-4" />
                <span className="text-silver">Hansraj + Arya + crew</span>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <Sticker tone="pink" className="mb-3 sticker-rotate">
              Staff picks
            </Sticker>
            <h1 className="banner-cobalt mt-2 max-w-full">
              <span className="text-pixel-3d block text-[clamp(1.65rem,calc(1rem+3.2vw),3.1rem)]">
                Your Discord
              </span>
              <span className="text-pixel-3d mt-1 block text-[clamp(1.65rem,calc(1rem+3.2vw),3.1rem)]">
                deserves better.
              </span>
            </h1>
            <p className="text-headline-lg mt-4 text-lime">We build it. You take the credit.</p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-5 max-w-md border-l-4 border-accent pl-3.5 text-[15px] leading-relaxed text-muted sm:mt-6 sm:pl-4 sm:text-[16px]">
              Setup, bots, branding. Live in two weeks. You run the vibes, we run the rest.
            </p>
          </Reveal>

          <Reveal
            delay={0.14}
            className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
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
          <FloatingSticker
            src="/stickers/y2k/coin.svg"
            alt=""
            className="right-2 top-[-12px] z-20 h-10 w-10 sm:h-12 sm:w-12"
            delay={0.2}
          />
          <FloatingSticker
            src="/stickers/y2k/heart.svg"
            alt=""
            className="left-[-8px] bottom-16 z-20 hidden h-9 w-9 sm:block"
            delay={0.3}
          />
          <FloatingSticker
            src="/stickers/y2k/vhs.svg"
            alt=""
            className="bottom-[-10px] right-6 z-20 hidden h-12 w-16 md:block"
            delay={0.35}
          />
          <FloatingSticker
            src="/stickers/y2k/sparkle.svg"
            alt=""
            className="left-4 top-8 z-20 h-7 w-7"
            delay={0.25}
          />

          <div className="hard-card overflow-visible bg-discord p-1.5 sm:p-2">
            <DiscordMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
