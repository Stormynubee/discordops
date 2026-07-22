import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Check } from 'lucide-react'
import type { PlanDefinition } from '../data/plans'
import { PlanMascot } from './PlanMascot'
import { Button } from './ui'

type PricingCardProps = {
  plan: PlanDefinition
  index: number
}

export function PricingCard({ plan, index }: PricingCardProps) {
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const featured = plan.featured

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={reduceMotion ? { y: 0 } : { y: hovered ? -6 : 0 }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
        y: { type: 'spring', stiffness: 320, damping: 26 },
      }}
      className={[
        'relative flex h-full flex-col rounded-sm border-[3px] bg-card-deep p-6 sm:p-7 md:p-8',
        featured
          ? 'z-10 border-accent shadow-[8px_8px_0_#000] lg:py-9'
          : 'border-black shadow-[6px_6px_0_#000] hover:border-lime',
        hovered && !featured ? 'shadow-[8px_8px_0_#000]' : '',
        hovered && featured ? 'shadow-[10px_10px_0_#000]' : '',
      ].join(' ')}
    >
      {featured ? (
        <motion.div
          className="pointer-events-none absolute -right-2 -top-3 z-20 sm:-right-3 sm:-top-4"
          aria-hidden
          initial={reduceMotion ? false : { rotate: 8, y: -6, opacity: 0 }}
          whileInView={{ rotate: 8, y: 0, opacity: 1 }}
          viewport={{ once: true }}
          animate={
            reduceMotion
              ? { rotate: 8 }
              : hovered
                ? { rotate: [8, 12, 6, 8], y: [0, -2, 0] }
                : { rotate: 8 }
          }
          transition={{ duration: hovered ? 0.7 : 0.4, ease: 'easeInOut' }}
        >
          <span className="inline-flex items-center rounded-sm border-[3px] border-black bg-yellow px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-bg shadow-[4px_4px_0_#000] sm:px-3.5 sm:py-2 sm:text-xs">
            Recommended
          </span>
        </motion.div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={[
              'text-headline text-[1.35rem] leading-none sm:text-[1.55rem] md:text-[1.7rem]',
              featured ? 'text-accent' : 'text-text',
            ].join(' ')}
          >
            {plan.id}
          </h3>
          <p className="mt-1.5 text-[12px] font-medium leading-snug text-muted sm:text-[13px]">
            {plan.tagline}
          </p>
        </div>
        <PlanMascot plan={plan} size="card" className="-mr-1 -mt-0.5" />
      </div>

      <div className="mt-5 sm:mt-6">
        <div className="flex items-end gap-2.5 pb-3">
          <p
            className="text-price flex items-baseline gap-0.5 text-[clamp(3rem,calc(2.2rem+3.4vw),4.15rem)] text-lime"
            aria-label={`${plan.price} dollars`}
          >
            <span className="text-[0.55em] font-black tracking-normal">$</span>
            <span>{plan.price}</span>
          </p>
          <span className="mb-2 text-[13px] font-semibold tracking-wide text-muted sm:text-sm">
            / once
          </span>
        </div>
        <div className="space-y-1" aria-hidden>
          <div className="rule-y2k-thin rule-y2k" />
          <div className="rule-y2k" />
        </div>
      </div>

      <p className="mt-4 text-body text-text/85">{plan.blurb}</p>

      <div className="mt-6 flex items-center gap-2 sm:mt-7">
        <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-lime sm:text-sm">
          What you get
        </p>
        <motion.span
          aria-hidden
          className="h-px flex-1 bg-gradient-to-r from-lime/80 via-yellow/50 to-transparent"
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
        />
      </div>

      <ul className="mt-3 flex-1 space-y-2.5 sm:mt-3.5 sm:space-y-3">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-body-sm text-text sm:gap-3 sm:text-[14.5px]"
          >
            <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] bg-accent/15 sm:h-5 sm:w-5">
              <Check size={12} className="text-accent" strokeWidth={3.5} aria-hidden />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        href={`#order?plan=${encodeURIComponent(plan.id)}`}
        variant={featured ? 'primary' : 'secondary'}
        className={[
          'mt-7 w-full sm:mt-8',
          featured ? '!min-h-[52px] !py-3.5 text-[15px] sm:!min-h-[56px] sm:text-base' : '',
        ].join(' ')}
      >
        {plan.cta}
      </Button>
    </motion.article>
  )
}
