import { ArrowUpRight } from 'lucide-react'
import { Button, Reveal, Sticker } from './ui'
import { formatPlanBoosts, PLANS, PRICING_ORDER } from '../data/plans'

export function Boosts() {
  return (
    <section className="relative section-pad pb-8 md:pb-16">
      <Reveal>
        <div className="mx-auto max-w-7xl rounded-sm border-[3px] border-black bg-card px-6 py-10 shadow-[4px_4px_0_#000] md:px-10 md:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <Sticker tone="lime" className="mb-3">
                Included with plans
              </Sticker>
              <h3 className="text-title mt-2 text-2xl text-text md:text-3xl">
                Discord Server Boosts
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-[15px]">
                Every package includes Discord boosts baked in. Bigger plan, more boosts, longer
                coverage.
              </p>
              <Button href="#pricing" variant="ghost" className="mt-5 !px-0">
                See what&apos;s in each plan
                <ArrowUpRight size={16} />
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6">
              {PRICING_ORDER.map((id) => {
                const plan = PLANS[id]
                const monthLabel =
                  plan.boosts.months === 1 ? '1 month' : `${plan.boosts.months} months`
                return (
                  <div
                    key={plan.id}
                    className="min-w-[110px] rounded-sm border-[3px] border-black bg-elevated px-4 py-3 shadow-[3px_3px_0_#000]"
                  >
                    <p className="text-label text-lime">{plan.id}</p>
                    <p className="text-title mt-1 text-xl text-text sm:text-2xl">
                      {plan.boosts.amount}× boosts
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted">{monthLabel}</p>
                    <p className="sr-only">{formatPlanBoosts(plan.boosts)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
