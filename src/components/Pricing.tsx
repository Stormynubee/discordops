import { Reveal, SectionHeading } from './ui'
import { PricingCard } from './PricingCard'
import { FOUNDERS_SHORT } from '../data/brand'
import { PLANS, PRICING_ORDER } from '../data/plans'

export function Pricing() {
  return (
    <section id="pricing" className="relative section-y">
      <div className="section-pad relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Pick your package."
          description="Everything listed is included. No weird upsells."
          align="center"
        />

        <div className="mx-auto grid max-w-md items-stretch gap-7 pt-4 sm:gap-8 lg:max-w-none lg:grid-cols-3 lg:items-center lg:gap-6 xl:gap-8">
          {PRICING_ORDER.map((id, i) => (
            <PricingCard key={id} plan={PLANS[id]} index={i} />
          ))}
        </div>

        <Reveal delay={0.2} className="mt-10 px-1 text-center sm:mt-12">
          <p className="text-[14px] leading-relaxed text-muted sm:text-[15px]">
            Still picking?{' '}
            <a href="#order?plan=Full%20Send" className="font-bold text-accent underline-offset-4 hover:underline">
              Full Send ($459)
            </a>{' '}
            is what {FOUNDERS_SHORT} would pick.{' '}
            <a href="#contact" className="font-bold text-lime underline-offset-4 hover:underline">
              Or just say hi
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  )
}
