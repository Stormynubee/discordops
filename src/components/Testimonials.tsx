import { FOUNDERS_SHORT } from '../data/brand'
import { Reveal, SectionHeading } from './ui'

const brandCreds = [
  {
    brand: 'Bode Piyaj Club',
    aka: 'Bored Ape Yacht Club',
    line: 'Collaboration manager + Discord moderation. Big brand, bigger chaos — we kept collabs and community moving.',
    logo: '/portfolio/logo-bayc.svg',
    logoClass: 'bg-black p-1 object-contain',
  },
  {
    brand: 'Doodles',
    aka: 'Blue-chip NFT brand',
    line: 'Discord management + moderation support. Ops for a community that actually runs like a product.',
    logo: '/portfolio/logo-doodles.jpg',
    logoClass: '',
  },
]

const testimonials = [
  {
    src: '/portfolio/testimonial-legends-of-asians.png',
    alt: 'Discord message from bank.eth saying Very good service, you guys really work hard',
    quote: 'Very good service, you guys really work hard!',
    name: 'bank.eth',
    role: 'Legends of Asians · 0 → 10k',
  },
  {
    src: '/portfolio/testimonial-derrick.jpg',
    alt: 'Discord message from Derrick saying 10/10 and happy about the growth',
    quote: '10/10 you guys, so far pretty happy about the growth!',
    name: 'Derrick',
    role: 'Client · growth',
  },
  {
    src: '/portfolio/testimonial-duke.jpg',
    alt: 'Discord message from Duke saying I love your work and would call again',
    quote: 'I love your work bruh — I would call you for another work soon',
    name: 'Duke',
    role: 'Client',
  },
  {
    src: '/portfolio/testimonial-inferno.png',
    alt: 'Discord message from InfernoDark saying youve made a cool job',
    quote: "you've made a cool job",
    name: 'InfernoDark',
    role: 'Client',
  },
]

export function Testimonials() {
  return (
    <section className="relative section-pad section-band section-y">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Proof"
          title="People said nice things."
          description={`Run by ${FOUNDERS_SHORT}. Real Discord DMs — plus brand work at Bode Piyaj Club and Doodles.`}
        />

        <Reveal>
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {brandCreds.map((c) => (
              <div
                key={c.brand}
                className="flex gap-3 rounded-sm border-[3px] border-black bg-card p-4 shadow-[3px_3px_0_#000]"
              >
                <img
                  src={c.logo}
                  alt=""
                  className={`h-12 w-12 shrink-0 rounded-lg border-2 border-black object-cover ${c.logoClass}`}
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="text-title text-base text-text">{c.brand}</p>
                  <p className="text-[11px] text-accent">{c.aka}</p>
                  <p className="mt-1 text-[13px] leading-snug text-muted">{c.line}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <figure className="overflow-hidden rounded-sm border-[3px] border-black bg-card shadow-[4px_4px_0_#000]">
                <div className="border-b-[3px] border-black bg-[#313338]">
                  <img
                    src={t.src}
                    alt={t.alt}
                    className="block h-auto w-full"
                    loading="lazy"
                  />
                </div>
                <figcaption className="p-4 sm:p-5">
                  <blockquote className="text-[15px] leading-relaxed text-text">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-border pt-3">
                    <p className="text-sm font-medium text-text">{t.name}</p>
                    <p className="text-[11px] text-muted">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
