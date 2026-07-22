import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Check } from 'lucide-react'
import type { PlanDefinition } from '../data/plans'
import { PlanMascot } from './PlanMascot'
import { Button, Sticker } from './ui'

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
      animate={reduceMotion ? { y: 0 } : { y: hovered ? -4 : 0 }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
        y: { type: 'spring', stiffness: 320, damping: 26 },
      }}
      className={`relative flex flex-col rounded-sm border-[3px] border-black bg-card p-6 shadow-[4px_4px_0_#000] sm:p-8 md:p-10 ${
        plan.featured
          ? 'z-10 border-accent bg-card lg:origin-center lg:scale-[1.03]'
          : 'hover:border-lime'
      } ${hovered ? 'shadow-[6px_6px_0_#000]' : ''}`}
    >
      {plan.featured ? (
        <div className="absolute -right-1 -top-3 rotate-3">
          <Sticker tone="yellow">Recommended</Sticker>
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
        <span className="text-price overflow-visible text-[clamp(2.5rem,6vw,4rem)] text-lime">
          ${plan.price}
        </span>
        <span className="text-sm text-muted sm:text-base">/once</span>
      </div>

      <p
        className={`mt-3 text-[14px] leading-relaxed text-muted sm:mt-4 sm:text-[15px] ${
          plan.featured ? 'border-b-[3px] border-yellow/40 pb-4 sm:pb-5' : ''
        }`}
      >
        {plan.blurb}
      </p>

      <p className="text-label-caps mt-5 text-lime sm:mt-6">What you get</p>
      <ul className="mt-3 flex-1 space-y-2.5 pr-1">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-[13px] leading-snug text-text/90 sm:gap-3 sm:text-[14px] md:text-[15px]"
          >
            <Check size={15} className="mt-0.5 shrink-0 text-accent" strokeWidth={3} />
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
