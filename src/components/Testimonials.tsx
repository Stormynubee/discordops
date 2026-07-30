import { FOUNDERS_SHORT } from '../data/brand'
import { Reveal, SectionHeading } from './ui'

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
          description={`Run by ${FOUNDERS_SHORT}. Real Discord DMs — not fake reviews we wrote ourselves.`}
        />

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
