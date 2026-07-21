import { FOUNDERS_SHORT } from '../data/brand'

const footerLinks = [{ label: 'Contact', href: '#contact' }]

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-footer">
      <div className="section-pad mx-auto max-w-7xl py-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <a href="#top" className="font-display text-lg font-bold tracking-tight text-text">
              Discord<span className="text-accent">Ops</span>
            </a>
            <p className="mt-1.5 text-[13px] text-muted">Founded by {FOUNDERS_SHORT}</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[15px] text-muted transition hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-[15px] text-muted opacity-80">
            &copy; {new Date().getFullYear()} DiscordOps
          </p>
        </div>
      </div>
    </footer>
  )
}
