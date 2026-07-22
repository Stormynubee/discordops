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
      ? 'bg-accent text-white border-[3px] border-black shadow-[4px_4px_0_#000] hover:bg-lime hover:text-bg hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#000]'
      : variant === 'secondary'
        ? 'bg-cobalt text-white border-[3px] border-yellow shadow-[4px_4px_0_#000] hover:bg-yellow hover:text-bg'
        : 'bg-transparent text-muted border-[3px] border-transparent hover:text-lime hover:border-lime/40'

  const classNameFull = `inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm px-7 py-3 text-sm font-bold tracking-wide transition-all duration-150 disabled:pointer-events-none disabled:opacity-60 ${styles} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick as (e: MouseEvent<HTMLAnchorElement>) => void}
        whileTap={{ scale: 0.97 }}
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
      whileTap={disabled ? undefined : { scale: 0.97 }}
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
      className={`inline-flex items-center rounded-sm border-[2.5px] border-black bg-yellow px-2.5 py-1 text-[11px] font-bold text-bg shadow-[3px_3px_0_#000] ${className}`}
    >
      {children}
    </span>
  )
}

export function Sticker({
  children,
  className = '',
  tone = 'yellow',
}: {
  children: ReactNode
  className?: string
  tone?: 'yellow' | 'pink' | 'orange' | 'lime' | 'cobalt'
}) {
  const tones = {
    yellow: 'bg-yellow text-bg border-black',
    pink: 'bg-accent text-white border-black',
    orange: 'bg-accent text-white border-black',
    lime: 'bg-lime text-bg border-black',
    cobalt: 'bg-cobalt text-white border-yellow',
  }
  return (
    <span
      className={`inline-flex items-center rounded-sm border-[3px] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider shadow-[3px_3px_0_#000] ${tones[tone]} ${className}`}
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
      className={`section-cv relative section-pad section-y ${band ? 'section-band' : ''} ${className}`}
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
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
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
    <Reveal className={`mb-10 sm:mb-12 md:mb-16 ${alignClass}`}>
      <p className="text-label-caps mb-3 inline-block rounded-sm border-[2.5px] border-black bg-lime px-2.5 py-1 text-bg shadow-[3px_3px_0_#000]">
        {eyebrow}
      </p>
      <h2 className="banner-cobalt mt-1">
        <span className="text-pixel-3d block text-[clamp(1.5rem,calc(1.1rem+2.5vw),2.75rem)] text-balance">
          {title}
        </span>
      </h2>
      {description ? (
        <p className={`mt-4 text-[14px] leading-relaxed text-muted sm:text-[15px] md:text-base ${descClass}`}>
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
