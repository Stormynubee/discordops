import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Button } from './ui'
import { FinnPricingPop, JakeStretchRide } from './JakeStretchRide'

type NavLink = {
  label: string
  href: string
  sectionId: string
  blurb: string
  preview: 'services' | 'plans' | 'portfolio' | 'pricing' | 'faq'
}

const links: NavLink[] = [
  {
    label: 'Services',
    href: '#services',
    sectionId: 'services',
    blurb: 'Setup, bots, branding, and the boring ops stuff.',
    preview: 'services',
  },
  {
    label: 'Plans',
    href: '#command-deck',
    sectionId: 'command-deck',
    blurb: 'Kickoff, Autopilot, Full Send. Flip through the deck.',
    preview: 'plans',
  },
  {
    label: 'Portfolio',
    href: '#portfolio',
    sectionId: 'portfolio',
    blurb: 'Servers that stopped looking like group projects.',
    preview: 'portfolio',
  },
  {
    label: 'Pricing',
    href: '#pricing',
    sectionId: 'pricing',
    blurb: '$129 / $249 / $459. Everything listed is included.',
    preview: 'pricing',
  },
  {
    label: 'FAQ',
    href: '#faq',
    sectionId: 'faq',
    blurb: 'Timing, ownership, boosts, and the awkward questions.',
    preview: 'faq',
  },
]

function LiveSectionPeek({ sectionId, fallback }: { sectionId: string; fallback: NavLink['preview'] }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const section = document.getElementById(sectionId)
    const host = hostRef.current
    if (!host) return

    host.replaceChildren()
    setReady(false)

    if (!section) return

    const clone = section.cloneNode(true) as HTMLElement
    clone.removeAttribute('id')
    clone.setAttribute('aria-hidden', 'true')
    clone.querySelectorAll('video, audio, iframe, canvas').forEach((el) => el.remove())
    clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
    clone.style.width = `${Math.max(section.offsetWidth, 720)}px`
    clone.style.pointerEvents = 'none'
    clone.style.userSelect = 'none'
    host.appendChild(clone)
    setReady(true)

    return () => {
      host.replaceChildren()
    }
  }, [sectionId])

  return (
    <div className="relative h-[128px] overflow-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] opacity-15 checker-bg" />
      {!ready ? (
        <div className="relative z-[2]">
          <PreviewArt kind={fallback} />
        </div>
      ) : null}
      <div
        ref={hostRef}
        className={`origin-top-left scale-[0.2] ${ready ? 'opacity-100' : 'opacity-0'}`}
        style={{ width: '500%', minHeight: '640px' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-10 bg-gradient-to-t from-card to-transparent"
      />
    </div>
  )
}

function PreviewArt({ kind }: { kind: NavLink['preview'] }) {
  if (kind === 'services') {
    return (
      <div className="space-y-1.5 p-2.5">
        {['Server build', 'Custom bots', 'Brand kit'].map((row, i) => (
          <div
            key={row}
            className="flex items-center gap-2 rounded-sm border-2 border-black bg-elevated px-2 py-1.5 shadow-[2px_2px_0_#000]"
          >
            <span
              className={`h-2.5 w-2.5 rounded-[2px] ${i === 1 ? 'bg-accent' : i === 2 ? 'bg-yellow' : 'bg-lime'}`}
            />
            <span className="text-[10px] font-bold text-text">{row}</span>
          </div>
        ))}
      </div>
    )
  }

  if (kind === 'plans') {
    return (
      <div className="p-2.5">
        <div className="mb-2 flex gap-1">
          {['Kickoff', 'Full Send', 'Autopilot'].map((t, i) => (
            <span
              key={t}
              className={`rounded-sm border-2 border-black px-1.5 py-0.5 text-[8px] font-extrabold uppercase ${
                i === 1 ? 'bg-accent text-white' : 'bg-elevated text-muted'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="rounded-sm border-2 border-black bg-discord p-2 shadow-[2px_2px_0_#000]">
          <div className="mb-1.5 h-1.5 w-2/3 rounded-sm bg-lime/80" />
          <div className="mb-1 h-1 w-full rounded-sm bg-white/10" />
          <div className="h-1 w-4/5 rounded-sm bg-white/10" />
          <div className="mt-2 inline-flex rounded-sm border border-black bg-accent px-2 py-0.5 text-[8px] font-bold text-white">
            Preview live
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'portfolio') {
    return (
      <div className="grid grid-cols-3 gap-1.5 p-2.5">
        {['bg-accent/30', 'bg-cobalt/50', 'bg-lime/25', 'bg-yellow/30', 'bg-accent/20', 'bg-cobalt/35'].map(
          (bg, i) => (
            <div
              key={i}
              className={`aspect-square rounded-sm border-2 border-black ${bg} shadow-[2px_2px_0_#000]`}
            />
          ),
        )}
      </div>
    )
  }

  if (kind === 'pricing') {
    return (
      <div className="flex items-end gap-1.5 p-2.5">
        {[
          { p: '$129', h: 'h-16', featured: false },
          { p: '$459', h: 'h-20', featured: true },
          { p: '$249', h: 'h-16', featured: false },
        ].map((c) => (
          <div
            key={c.p}
            className={`flex flex-1 flex-col justify-end rounded-sm border-[2.5px] bg-card p-1.5 shadow-[2px_2px_0_#000] ${
              c.featured ? 'border-accent' : 'border-black'
            } ${c.h}`}
          >
            <span className={`font-display text-[11px] font-bold ${c.featured ? 'text-lime' : 'text-text'}`}>
              {c.p}
            </span>
            <span className="mt-auto h-1 w-full rounded-sm bg-yellow" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1.5 p-2.5">
      {['How long does it take?', 'Who owns the server?', 'Can we add boosts?'].map((q, i) => (
        <div
          key={q}
          className="flex items-center justify-between rounded-sm border-2 border-black bg-elevated px-2 py-1.5 shadow-[2px_2px_0_#000]"
        >
          <span className="truncate text-[9px] font-semibold text-text">{q}</span>
          <span className={`text-[10px] font-black ${i === 0 ? 'text-lime' : 'text-muted'}`}>+</span>
        </div>
      ))}
    </div>
  )
}

function NavPreviewCard({ link }: { link: NavLink }) {
  return (
    <div className="w-[260px] overflow-hidden rounded-md border-[3px] border-black bg-card shadow-[6px_6px_0_#000]">
      <div className="flex items-center justify-between border-b-[3px] border-yellow bg-cobalt px-2.5 py-1.5">
        <span className="font-display text-[11px] font-bold tracking-wide text-white">{link.label}</span>
        <span className="rounded-sm border-2 border-black bg-yellow px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-bg">
          Preview
        </span>
      </div>
      <LiveSectionPeek sectionId={link.sectionId} fallback={link.preview} />
      <div className="border-t-[3px] border-black bg-elevated px-2.5 py-2">
        <p className="text-[11px] leading-snug text-[#ffd6ea]">{link.blurb}</p>
        <p className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-lime">
          Jump in <ArrowUpRight size={11} strokeWidth={3} />
        </p>
      </div>
    </div>
  )
}

function DesktopNavItem({
  link,
  active,
  onHover,
  onLeave,
  showPreview,
}: {
  link: NavLink
  active: boolean
  onHover: () => void
  onLeave: () => void
  showPreview: boolean
}) {
  const reduceMotion = useReducedMotion()
  const panelId = useId()
  const isPricing = link.href === '#pricing'

  return (
    <li
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
    >
      {/* Finn peeks just above Pricing — tight to the label */}
      {isPricing ? (
        <FinnPricingPop active={showPreview} className="bottom-[calc(100%-6px)]" />
      ) : null}

      <a
        href={link.href}
        aria-describedby={showPreview ? panelId : undefined}
        className={`nav-jake-label group relative z-[20] inline-flex items-center px-1.5 py-2 text-[13px] font-bold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-elevated ${
          active || showPreview ? 'is-active text-lime' : 'text-white hover:text-lime'
        }`}
      >
        {link.label}
        <span
          aria-hidden
          className={`absolute inset-x-0.5 -bottom-0.5 h-[3px] origin-left rounded-sm bg-accent transition-transform duration-200 ${
            active || showPreview ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          }`}
        />
      </a>

      <AnimatePresence>
        {showPreview ? (
          <motion.div
            id={panelId}
            role="tooltip"
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="pointer-events-auto absolute left-1/2 top-[calc(100%+0.75rem)] z-[30] -translate-x-1/2"
          >
            <div
              aria-hidden
              className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l-[3px] border-t-[3px] border-black bg-cobalt"
            />
            <a href={link.href} className="block">
              <NavPreviewCard link={link} />
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const leaveTimer = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const ids = links.map((l) => l.sectionId)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.08, 0.2, 0.4] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const clearLeave = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
  }

  const handleHover = (href: string) => {
    clearLeave()
    setHovered(href)
  }

  const handleLeave = () => {
    clearLeave()
    leaveTimer.current = window.setTimeout(() => setHovered(null), 120)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] overflow-visible pt-[env(safe-area-inset-top,0px)] transition-all duration-300 ${
        open || scrolled
          ? 'border-b-[3px] border-yellow bg-bg/95 shadow-[0_4px_0_#000] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-pad relative z-[81] mx-auto flex h-14 max-w-7xl items-center justify-between overflow-visible md:h-16">
        <a
          href="#top"
          className="group inline-flex items-center"
          aria-label="DiscordOps home"
          onClick={() => setOpen(false)}
        >
          <span className="inline-flex items-center rounded-sm border-[3px] border-black bg-elevated px-2.5 py-1 shadow-[3px_3px_0_#000] transition group-hover:-translate-x-px group-hover:-translate-y-px group-hover:shadow-[4px_4px_0_#000]">
            <span className="text-brand text-base text-text sm:text-lg">
              Discord<span className="text-accent">Ops</span>
            </span>
          </span>
        </a>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 overflow-visible lg:block">
          <ul className="relative z-[82] flex items-center gap-1 overflow-visible rounded-sm border-[3px] border-black bg-elevated/90 px-3 shadow-[3px_3px_0_#000] backdrop-blur-sm xl:gap-2 xl:px-4">
            {/* Jake rides under transparent stroked labels */}
            <JakeStretchRide
              href={hovered}
              playSound={hovered !== null}
              className="left-1 top-1/2 z-0 -translate-y-1/2"
            />
            {links.map((link) => (
              <DesktopNavItem
                key={link.href}
                link={link}
                active={activeSection === link.sectionId}
                showPreview={hovered === link.href}
                onHover={() => handleHover(link.href)}
                onLeave={handleLeave}
              />
            ))}
          </ul>
        </div>

        <div className="hidden lg:block">
          <Button href="#order?plan=Full%20Send" variant="primary" className="!min-h-[40px] !px-5 !py-2 text-[13px]">
            Go Full Send
          </Button>
        </div>

        <button
          type="button"
          className="relative z-[82] flex h-11 w-11 items-center justify-center rounded-sm border-[3px] border-black bg-cobalt text-white shadow-[3px_3px_0_#000] lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[79] bg-bg lg:hidden"
            style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}
          >
            <div className="absolute inset-0 bg-bg" aria-hidden />
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] checker-bg" />
            <ul className="section-pad relative z-10 flex h-full flex-col gap-3 overflow-y-auto border-t-[3px] border-yellow py-6 pb-10">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.04, duration: 0.25 }}
                >
                  <a
                    href={link.href}
                    className="block overflow-hidden rounded-sm border-[3px] border-black bg-card shadow-[4px_4px_0_#000]"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center justify-between border-b-2 border-yellow/60 bg-cobalt px-3 py-2">
                      <span className="font-display text-sm font-bold text-white">{link.label}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-yellow">Peek</span>
                    </div>
                    <div className="max-h-[100px] overflow-hidden opacity-90">
                      <PreviewArt kind={link.preview} />
                    </div>
                    <p className="border-t-2 border-black px-3 py-2 text-[12px] leading-snug text-[#ffd6ea]">
                      {link.blurb}
                    </p>
                  </a>
                </motion.li>
              ))}
              <li className="pt-3">
                <Button
                  href="#order?plan=Full%20Send"
                  variant="primary"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Go Full Send
                </Button>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
