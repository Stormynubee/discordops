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
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] pt-[env(safe-area-inset-top,0px)] transition-all duration-300 ${
        open || scrolled
          ? 'border-b-[3px] border-yellow bg-bg shadow-[0_4px_0_#000]'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-pad relative z-[81] mx-auto flex h-14 max-w-7xl items-center justify-between md:h-16">
        <a
          href="#top"
          className="text-brand text-base text-text sm:text-lg"
          aria-label="DiscordOps home"
          onClick={() => setOpen(false)}
        >
          Discord<span className="text-accent">Ops</span>
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 xl:gap-6 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-bold text-muted transition hover:text-lime"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

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
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07] checker-bg"
            />
            <ul className="section-pad relative z-10 flex h-full flex-col gap-1 overflow-y-auto border-t-[3px] border-yellow py-6 pb-10">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.04, duration: 0.25 }}
                >
                  <a
                    href={link.href}
                    className="flex min-h-[52px] items-center rounded-sm border-[2.5px] border-black bg-card px-4 text-base font-bold text-text shadow-[3px_3px_0_#000] transition hover:border-lime hover:text-lime"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-5">
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
