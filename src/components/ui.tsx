import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import {
  useRef,
  type ReactNode,
  type MouseEvent,
  type ButtonHTMLAttributes,
  type RefObject,
} from 'react'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  className?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  href,
  type = 'button',
  disabled = false,
  onClick,
}: ButtonProps) {
  const styles =
    variant === 'primary'
      ? 'bg-accent text-bg hover:shadow-[0_0_24px_rgba(230,195,100,0.35)] hover:brightness-105'
      : variant === 'secondary'
        ? 'bg-transparent text-text border border-silver/25 hover:border-accent/50 hover:bg-accent/5'
        : 'bg-transparent text-muted hover:text-text'

  const classNameFull = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-[-0.01em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-60 ${styles} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick as (e: MouseEvent<HTMLAnchorElement>) => void}
        whileTap={{ scale: 0.98 }}
        className={classNameFull}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick as (e: MouseEvent<HTMLButtonElement>) => void}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={classNameFull}
    >
      {children}
    </motion.button>
  )
}

export const MagneticButton = Button

export function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`panel ${className}`}>{children}</div>
}

export function Badge({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-silver ${className}`}
    >
      {children}
    </span>
  )
}

export function SectionShell({
  id,
  children,
  className = '',
  band = false,
}: {
  id?: string
  children: ReactNode
  className?: string
  band?: boolean
}) {
  return (
    <section
      id={id}
      className={`relative section-pad py-20 md:py-28 ${band ? 'bg-surface/50' : ''} ${className}`}
    >
      {children}
    </section>
  )
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 24,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`overflow-visible ${className}`.trim()}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left max-w-3xl'
  const descClass = align === 'center' ? 'mx-auto max-w-lg' : 'max-w-xl'

  return (
    <Reveal className={`mb-12 md:mb-16 ${alignClass}`}>
      <p className="text-label-caps mb-2 text-muted">
        {eyebrow}
      </p>
      <h2 className="text-display overflow-visible text-[clamp(1.75rem,4vw,3rem)] text-text text-balance">
        {title}
      </h2>
      {description ? (
        <p className={`mt-3 text-[15px] leading-relaxed text-muted sm:text-base ${descClass}`}>
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}

export function useParallax(strength = 12) {
  const ref = useRef<HTMLElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 90, damping: 22 })
  const springY = useSpring(y, { stiffness: 90, damping: 22 })
  const rotateX = useTransform(springY, [-strength, strength], [4, -4])
  const rotateY = useTransform(springX, [-strength, strength], [-4, 4])

  const onMove = (e: MouseEvent<HTMLElement>) => {
    ref.current = e.currentTarget
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width - 0.5) * strength * 2
    const py = ((e.clientY - rect.top) / rect.height - 0.5) * strength * 2
    x.set(px)
    y.set(py)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { springX, springY, rotateX, rotateY, onMove, onLeave, ref: ref as RefObject<HTMLElement> }
}
