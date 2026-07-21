import { motion, useReducedMotion } from 'framer-motion'
import type { PlanDefinition } from '../data/plans'

type PlanMascotProps = {
  plan: PlanDefinition
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-14 w-14',
  md: 'h-24 w-24',
  lg: 'h-32 w-32 sm:h-40 sm:w-40',
}

/** Plan sticker art. Black backgrounds knock out via lighten blend on dark UI. */
export function PlanMascot({ plan, className = '', size = 'md' }: PlanMascotProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      key={plan.id}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex shrink-0 items-center justify-center ${sizes[size]} ${className}`}
    >
      <img
        src={plan.mascot}
        alt={plan.mascotAlt}
        width={160}
        height={160}
        draggable={false}
        className="h-full w-full object-contain [mix-blend-mode:lighten] drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
      />
    </motion.div>
  )
}
