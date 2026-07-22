import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from './ui'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Plans', href: '#command-deck' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      if (!open) document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-400 ${
        scrolled
          ? 'border-b border-border/80 bg-bg/88 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-pad mx-auto flex h-14 max-w-7xl items-center justify-between md:h-16">
        <a href="#top" className="text-brand text-base text-text sm:text-lg" aria-label="DiscordOps home">
          Discord<span className="text-accent">Ops</span>
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 xl:gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-medium text-muted transition hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="#order?plan=Full%20Send" variant="primary" className="!px-6 !py-2 text-[13px]">
            Go Full Send
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-text transition hover:border-accent/40 hover:text-accent lg:hidden"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-40 bg-bg/98 backdrop-blur-xl lg:hidden"
          >
            <ul className="section-pad flex flex-col gap-1 py-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex min-h-[48px] items-center rounded-xl px-3 text-base text-muted transition hover:bg-white/[0.03] hover:text-text"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-4">
                <Button href="#order?plan=Full%20Send" variant="primary" className="w-full">
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
