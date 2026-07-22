import { FOUNDERS_SHORT } from '../data/brand'
import { Reveal, SectionHeading } from './ui'

const featured = {
  quote:
    'They rebuilt our whole Discord in 3 to 7 days. Felt like we hired in-house people, not some agency that ghosts you after invoice day.',
  name: 'Elena Voss',
  role: 'Head of Community, NovaSaaS',
  initials: 'EV',
}

const secondary = [
  {
    quote:
      'The bots alone probably save us 30 hours a week. Tickets, onboarding, roles. It just runs now.',
    name: 'Marcus Chen',
    role: 'Founder, Apex Gaming',
    initials: 'MC',
  },
  {
    quote:
      'We wanted a server that looked like we gave a damn. Investors mention it on calls now. Weird, but nice.',
    name: 'Sofia Ramirez',
    role: 'COO, LedgerDAO',
    initials: 'SR',
  },
]

export function Testimonials() {
  return (
    <section className="relative section-pad section-band section-y">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Proof"
          title="People said nice things."
          description={`Run by ${FOUNDERS_SHORT}. These are from clients, not us cosplaying as customers.`}
        />

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <figure>
              <blockquote className="text-headline text-[clamp(1.35rem,2.8vw,2rem)] text-text">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-border pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-[12px] font-semibold text-accent">
                  {featured.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{featured.name}</p>
                  <p className="text-[12px] text-muted">{featured.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>

          <div className="flex flex-col gap-6">
            {secondary.map((t, i) => (
              <Reveal key={t.name} delay={0.08 + i * 0.06}>
                <figure className="quote-mark">
                  <blockquote className="text-[15px] leading-relaxed text-text/90">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-silver">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-text">{t.name}</p>
                      <p className="text-[11px] text-muted">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
