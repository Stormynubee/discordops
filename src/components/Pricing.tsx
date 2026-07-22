import { Reveal, SectionHeading } from './ui'
import { PricingCard } from './PricingCard'
import { FOUNDERS_SHORT } from '../data/brand'
import { PLANS, PRICING_ORDER } from '../data/plans'

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="section-pad relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Pick your package."
          description="Everything listed is included. No weird upsells."
          align="center"
        />

        <div className="grid items-stretch gap-8 lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {PRICING_ORDER.map((id, i) => (
            <PricingCard key={id} plan={PLANS[id]} index={i} />
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12 text-center">
          <p className="text-[15px] text-muted">
            Still picking?{' '}
            <a href="#order?plan=Full%20Send" className="font-medium text-accent underline-offset-4 hover:underline">
              Full Send ($459)
            </a>{' '}
            is what {FOUNDERS_SHORT} would pick.{' '}
            <a href="#contact" className="font-medium text-accent underline-offset-4 hover:underline">
              Or just say hi
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  )
}
