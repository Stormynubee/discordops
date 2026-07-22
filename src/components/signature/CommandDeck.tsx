import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { DEFAULT_PLAN, PLAN_IDS, PLANS, type PlanId } from '../../data/plans'
import { PlanMascot } from '../PlanMascot'
import { Button, Reveal, SectionHeading } from '../ui'

export function CommandDeck() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<PlanId>(DEFAULT_PLAN)
  const tier = PLANS[active]

  return (
    <section id="command-deck" className="relative section-pad section-y">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Plan Picker"
          title="See what you are actually buying."
          description="Tap a package. Peek the channels, bots, and boosts. No mystery."
        />

        <Reveal>
          <div className="overflow-hidden rounded-xl border border-border bg-card/50">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0 border-b border-border p-4 md:p-5">
              {PLAN_IDS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  className={`inline-flex shrink-0 min-h-[44px] items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition sm:px-5 ${
                    active === key
                      ? 'bg-accent text-bg'
                      : 'border border-border text-muted hover:border-silver/30 hover:text-text'
                  } ${key === 'Full Send' ? 'ring-1 ring-accent/30' : ''}`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center overflow-hidden rounded-full ${
                      active === key ? 'bg-bg/90' : 'bg-elevated'
                    }`}
                  >
                    <img
                      src={PLANS[key].mascot}
                      alt=""
                      aria-hidden
                      className="h-6 w-6 object-contain [mix-blend-mode:lighten]"
                    />
                  </span>
                  {key}
                  <span className="text-[10px] font-normal opacity-80">· ${PLANS[key].price}</span>
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-2">
              <div className="border-b border-border p-6 md:p-8 lg:border-b-0 lg:border-r">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-label-caps text-muted">Included in {active}</p>
                  <PlanMascot plan={tier} size="sm" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.ul
                    key={active}
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: 12 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 max-h-[320px] space-y-2.5 overflow-y-auto pr-2"
                  >
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[14px] text-text/90">
                        <Check size={15} className="mt-0.5 shrink-0 text-accent" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>

              <div className="bg-discord p-6 md:p-8">
                <p className="text-label-caps text-[#949ba4]">
                  What your server looks like
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 space-y-3"
                  >
                    <div className="rounded-lg border border-white/[0.06] bg-discord-panel p-3">
                      <p className="mb-2 text-label text-[#949ba4]">
                        Channels
                      </p>
                      <ul className="space-y-1">
                        {tier.preview.channels.map((ch) => (
                          <li key={ch} className="text-[12px] text-white">
                            {ch}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-white/[0.06] bg-discord-panel px-3 py-2.5">
                      <p className="text-[11px] text-accent">{tier.preview.status}</p>
                      <p className="mt-1 text-[10px] text-[#949ba4]">{tier.preview.note}</p>
                    </div>
                    <div className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-2">
                      <p className="text-[11px] font-medium text-accent">
                        ${tier.price} one-time · {active}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-4 border-t border-border p-6 sm:flex-row sm:items-center md:p-8">
              <p className="text-sm text-muted">
                {active === 'Full Send'
                  ? 'This is the one. Seriously.'
                  : `Like it? We can build your ${active} server.`}
              </p>
              <Button
                href={`#order?plan=${encodeURIComponent(active)}`}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {active === 'Full Send' ? `Go Full Send for $${tier.price}` : `Get ${active} for $${tier.price}`}
                <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
