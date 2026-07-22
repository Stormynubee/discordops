type BrandMarkProps = {
  size?: number
  className?: string
}

/** Cop-Peepo DeezOps mark — transparent PNG. */
export function BrandMark({ size = 28, className = '' }: BrandMarkProps) {
  return (
    <img
      src="/brand/deezops-logo.png"
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={`shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

type BrandLockupProps = {
  markSize?: number
  className?: string
  textClassName?: string
}

/** Mark + DeezOps wordmark. */
export function BrandLockup({
  markSize = 28,
  className = '',
  textClassName = 'text-brand text-base text-text sm:text-lg',
}: BrandLockupProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <BrandMark size={markSize} />
      <span className={textClassName}>
        Deez<span className="text-accent">Ops</span>
      </span>
    </span>
  )
}
