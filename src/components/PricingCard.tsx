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

  const baseScale = plan.featured ? 1.08 : 1
  const hoverScale = plan.featured ? 1.1 : 1.05

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={
        reduceMotion
          ? { scale: baseScale, y: 0 }
          : {
              scale: hovered ? hoverScale : baseScale,
              y: hovered ? -8 : 0,
            }
      }
      transition={{
        opacity: { duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
        y: { type: 'spring', stiffness: 320, damping: 26 },
        scale: { type: 'spring', stiffness: 320, damping: 26 },
      }}
      className={`relative flex min-h-[32rem] flex-col rounded-2xl p-9 md:min-h-[36rem] md:p-11 ${
        plan.featured
          ? 'z-10 border-2 border-accent bg-card lg:min-h-[38rem]'
          : 'border border-border bg-surface hover:border-accent/40'
      } ${hovered ? 'shadow-[0_0_48px_-8px_rgba(230,195,100,0.4)]' : plan.featured ? 'shadow-[0_0_48px_-12px_rgba(230,195,100,0.28)]' : ''}`}
    >
      {plan.featured ? (
        <div className="absolute right-0 top-0 rounded-bl-xl rounded-tr-2xl bg-accent px-5 py-1.5 text-label-caps text-bg">
          Recommended
        </div>
      ) : null}

      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className={`text-headline overflow-visible text-2xl ${plan.featured ? 'text-accent' : 'text-text'}`}>
          {plan.id}
        </h3>
        <PlanMascot plan={plan} size="sm" className="-mr-1 -mt-1" />
      </div>

      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-display overflow-visible text-[clamp(3rem,5vw,4.25rem)] text-text">
          ${plan.price}
        </span>
        <span className="text-base text-muted">/once</span>
      </div>

      <p
        className={`mt-4 text-[15px] leading-relaxed text-muted ${plan.featured ? 'border-b border-border pb-5' : ''}`}
      >
        {plan.blurb}
      </p>

      <p className="text-label-caps mt-6 text-muted">What you get</p>
      <ul className="mt-3 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[14px] leading-snug text-text/90 md:text-[15px]">
            <Check size={16} className="mt-0.5 shrink-0 text-accent" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>

      <Button
        href={`#order?plan=${encodeURIComponent(plan.id)}`}
        variant={plan.featured ? 'primary' : 'secondary'}
        className={`mt-8 w-full ${plan.featured ? '!py-4 text-base' : ''}`}
      >
        {plan.cta}
      </Button>
    </motion.article>
  )
}
