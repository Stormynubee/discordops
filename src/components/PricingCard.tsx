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

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={reduceMotion ? { y: 0 } : { y: hovered ? -6 : 0 }}
      transition={{
        opacity: { duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
        y: { type: 'spring', stiffness: 320, damping: 26 },
      }}
      className={`relative flex flex-col rounded-2xl p-6 sm:p-8 md:p-10 ${
        plan.featured
          ? 'z-10 border-2 border-accent bg-card shadow-[0_0_48px_-12px_rgba(230,195,100,0.28)] lg:origin-center lg:scale-[1.04]'
          : 'border border-border bg-surface hover:border-accent/40'
      } ${hovered ? 'shadow-[0_0_40px_-8px_rgba(230,195,100,0.35)]' : ''}`}
    >
      {plan.featured ? (
        <div className="absolute right-0 top-0 rounded-bl-xl rounded-tr-2xl bg-accent px-4 py-1.5 text-label-caps text-bg sm:px-5">
          Recommended
        </div>
      ) : null}

      <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
        <h3
          className={`text-headline overflow-visible text-xl sm:text-2xl ${
            plan.featured ? 'text-accent' : 'text-text'
          }`}
        >
          {plan.id}
        </h3>
        <PlanMascot plan={plan} size="sm" className="-mr-1 -mt-1" />
      </div>

      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-price overflow-visible text-[clamp(2.5rem,6vw,4rem)] text-text">
          ${plan.price}
        </span>
        <span className="text-sm text-muted sm:text-base">/once</span>
      </div>

      <p
        className={`mt-3 text-[14px] leading-relaxed text-muted sm:mt-4 sm:text-[15px] ${
          plan.featured ? 'border-b border-border pb-4 sm:pb-5' : ''
        }`}
      >
        {plan.blurb}
      </p>

      <p className="text-label-caps mt-5 text-muted sm:mt-6">What you get</p>
      <ul className="mt-3 flex-1 space-y-2.5 pr-1">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-[13px] leading-snug text-text/90 sm:gap-3 sm:text-[14px] md:text-[15px]"
          >
            <Check size={15} className="mt-0.5 shrink-0 text-accent" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>

      <Button
        href={`#order?plan=${encodeURIComponent(plan.id)}`}
        variant={plan.featured ? 'primary' : 'secondary'}
        className={`mt-7 w-full sm:mt-8 ${plan.featured ? '!py-3.5 text-[15px] sm:!py-4 sm:text-base' : ''}`}
      >
        {plan.cta}
      </Button>
    </motion.article>
  )
}
