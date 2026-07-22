import { FOUNDERS_SHORT } from '../data/brand'
import { BrandLockup } from './BrandMark'

const footerLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  return (
    <footer className="relative z-10 border-t-[3px] border-yellow bg-footer">
      <div className="section-pad mx-auto max-w-7xl py-12 sm:py-14">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-4">
          <div className="text-center md:text-left">
            <a href="#top" className="inline-flex">
              <BrandLockup markSize={30} textClassName="text-brand text-lg text-text" />
            </a>
            <p className="mt-1.5 text-body-sm text-muted">Founded by {FOUNDERS_SHORT}</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[15px] font-bold text-muted transition hover:text-lime"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-[15px] text-muted opacity-80">
            &copy; {new Date().getFullYear()} DeezOps
          </p>
        </div>
      </div>
    </footer>
  )
}
