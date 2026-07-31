import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Reveal, SectionHeading } from './ui'

type Project = {
  name: string
  type: string
  members: string
  metric: string
  logo: string
  logoAlt: string
  channels: string[]
  active: number
  featured?: boolean
  logoClass?: string
}

type BrandGig = {
  name: string
  aka?: string
  role: string
  blurb: string
  logo: string
  logoAlt: string
  tags: string[]
  logoClass?: string
}

const brandGigs: BrandGig[] = [
  {
    name: 'Bode Piyaj Club',
    aka: 'Bored Ape Yacht Club',
    role: 'Collaboration Manager',
    blurb:
      'Collab ops + Discord moderation on one of the biggest NFT brands. Partnerships, vibes, and keeping the server from catching fire.',
    logo: '/portfolio/logo-bayc.svg',
    logoAlt: 'Bored Ape Yacht Club official skull logo',
    tags: ['Collabs', 'Moderation', 'Growth'],
    logoClass: 'bg-black p-1.5 object-contain',
  },
  {
    name: 'Doodles',
    role: 'Discord Management',
    blurb:
      'Day-to-day Discord ops for Doodles — structure, moderation, and community growth support for a blue-chip brand.',
    logo: '/portfolio/logo-doodles.jpg',
    logoAlt: 'Doodles community mark',
    tags: ['Discord ops', 'Moderation', 'Growth'],
  },
]

const projects: Project[] = [
  {
    name: 'Nightmare-X',
    type: 'Chill Community',
    members: '110k',
    metric: '0 → 110k',
    logo: '/portfolio/logo-nightmare-x.jpg',
    logoAlt: 'Nightmare-X logo',
    channels: ['welcome', 'general', 'chill'],
    active: 1,
    featured: true,
  },
  {
    name: 'Viberry',
    type: 'Chill Community',
    members: '~50k',
    metric: '0 → ~50k',
    logo: '/portfolio/logo-viberry.jpg',
    logoAlt: 'Viberry logo',
    channels: ['announcements', 'vibe', 'chat'],
    active: 0,
  },
  {
    name: 'Fluffy Frens',
    type: 'Gaming · NFT Brand',
    members: '30k',
    metric: '0 → 30k',
    logo: '/portfolio/logo-fluffy-frens.png',
    logoAlt: 'Fluffy Frens logo',
    channels: ['welcome', 'frens', 'drops'],
    active: 2,
  },
  {
    name: 'Rise Angle',
    type: 'Gaming · Crypto',
    members: '30k',
    metric: '0 → 30k',
    logo: '/portfolio/logo-rise-angle.png',
    logoAlt: 'Rise Angle logo',
    channels: ['intro', 'alpha', 'lounge'],
    active: 1,
  },
]

const moreRuns = [
  { name: 'Legends of Asians', metric: '0 → 10k' },
  { name: 'Speaking Cat', metric: '0 → 10k' },
  { name: 'Community build', metric: '0 → 40k' },
]

function SwipeHint({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion()

  if (!visible) return null

  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-16 items-center justify-end md:hidden"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden
    >
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg via-bg/80 to-transparent" />
      <motion.div
        className="relative mr-1 flex flex-col items-center gap-1 rounded-sm border-2 border-black bg-yellow px-2 py-2 text-black shadow-[3px_3px_0_#000]"
        animate={
          reduce
            ? undefined
            : {
                x: [0, 6, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
                repeat: Infinity,
                repeatDelay: 0.35,
              }
        }
      >
        <ChevronRight className="h-5 w-5" strokeWidth={3} />
        <span className="text-[9px] font-bold uppercase tracking-wide">Swipe</span>
      </motion.div>
    </motion.div>
  )
}

export function Portfolio() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [showSwipeHint, setShowSwipeHint] = useState(true)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => {
      if (el.scrollLeft > 36) setShowSwipeHint(false)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="portfolio" className="section-cv relative section-pad section-y">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Servers we have built."
          description="Blue-chip Discord ops, real growth from zero, and brands that actually matter. Not stock mockups."
        />

        <Reveal>
          <div className="mb-8">
            <p className="text-label-caps mb-3 text-lime">Brands we&apos;ve worked with</p>
            <div className="grid gap-4 md:grid-cols-2">
              {brandGigs.map((brand) => (
                <article
                  key={brand.name}
                  className="overflow-hidden rounded-sm border-[3px] border-black bg-card shadow-[4px_4px_0_#000]"
                >
                  <div className="flex gap-4 p-4 sm:p-5">
                    <img
                      src={brand.logo}
                      alt={brand.logoAlt}
                      className={`h-16 w-16 shrink-0 rounded-xl border-2 border-black object-cover sm:h-[4.5rem] sm:w-[4.5rem] ${brand.logoClass ?? ''}`}
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-label-caps text-accent">{brand.role}</p>
                      <h3 className="text-title mt-1 text-xl text-text sm:text-2xl">
                        {brand.name}
                      </h3>
                      {brand.aka ? (
                        <p className="mt-0.5 text-[12px] text-muted">{brand.aka}</p>
                      ) : null}
                      <p className="text-body mt-2 text-sm text-muted">{brand.blurb}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {brand.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-sm border border-black bg-elevated px-2 py-0.5 text-[10px] font-medium text-text"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mb-8 overflow-hidden rounded-sm border-[3px] border-black bg-card shadow-[4px_4px_0_#000]">
            <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[180px] border-b-[3px] border-black md:min-h-[220px] md:border-b-0 md:border-r-[3px]">
                <picture>
                  <source
                    srcSet="/portfolio/banner-founders-for-founders.webp"
                    type="image/webp"
                  />
                  <img
                    src="/portfolio/banner-founders-for-founders.jpg"
                    alt="Founders for Founders animated community banner"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <div className="flex flex-col justify-center gap-3 p-5 sm:p-6">
                <p className="text-label-caps text-lime">Also shipped</p>
                <h3 className="text-title text-xl text-text sm:text-2xl">
                  Founders for Founders
                </h3>
                <p className="text-body text-sm text-muted">
                  Brand + Discord banner for a founder community. Same ops energy —
                  visuals that actually look like a real server.
                </p>
                <p className="text-title text-accent">Banner · brand pack</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <p className="text-label-caps text-accent">Growth runs</p>
          <p className="text-[11px] text-muted md:hidden">Swipe sideways for more →</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {moreRuns.map((run) => (
            <span
              key={run.name}
              className="inline-flex items-center gap-2 rounded-sm border-2 border-black bg-elevated px-3 py-1.5 text-[12px] text-text shadow-[2px_2px_0_#000]"
            >
              <span className="font-medium">{run.name}</span>
              <span className="text-accent">{run.metric}</span>
            </span>
          ))}
        </div>

        <div className="relative">
          <SwipeHint visible={showSwipeHint} />
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:[-ms-overflow-style:auto] md:[scrollbar-width:auto] [&::-webkit-scrollbar]:hidden md:[&::-webkit-scrollbar]:block"
          >
            {projects.map((project, i) => (
              <Reveal
                key={project.name}
                delay={i * 0.06}
                className="w-[min(85vw,420px)] shrink-0 snap-start md:w-auto"
              >
                <article className="group h-full overflow-hidden rounded-sm border-[3px] border-black bg-card shadow-[4px_4px_0_#000] transition duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000]">
                  <div className="relative h-44 bg-elevated">
                    <div className="absolute inset-x-5 bottom-0 top-5 overflow-hidden rounded-t-lg border border-b-0 border-white/10 bg-discord shadow-lg">
                      <div className="flex gap-3 border-b border-white/[0.06] px-3 py-2.5">
                        <img
                          src={project.logo}
                          alt={project.logoAlt}
                          className={`h-8 w-8 shrink-0 rounded-xl object-cover ${project.logoClass ?? ''}`}
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="truncate text-[12px] font-semibold text-white">
                            {project.name}
                          </p>
                          <p className="text-[10px] text-[#949ba4]">
                            {project.members} members
                          </p>
                        </div>
                        {project.featured ? (
                          <span className="self-start rounded bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
                            Flagship
                          </span>
                        ) : null}
                      </div>
                      <div className="space-y-0.5 bg-discord-panel px-2 py-2">
                        {project.channels.map((ch, idx) => (
                          <div
                            key={ch}
                            className={`rounded px-2 py-1 text-[11px] ${
                              idx === project.active
                                ? 'bg-white/[0.08] text-white'
                                : 'text-[#949ba4]'
                            }`}
                          >
                            <span className="opacity-50">#</span> {ch}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-4 p-5">
                    <div>
                      <p className="text-label-caps text-accent">{project.type}</p>
                      <h3 className="text-title mt-1 text-xl text-text">
                        {project.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-title text-lg text-accent">{project.metric}</p>
                      <p className="text-[11px] text-muted">{project.members} members</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
