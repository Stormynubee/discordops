type BlueprintGridProps = {
  className?: string
}

export function BlueprintGrid({ className = '' }: BlueprintGridProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="blueprint-bg absolute inset-0 opacity-80" />
      {/* Corner registration marks */}
      <span className="absolute left-4 top-4 h-5 w-5 border-l border-t border-silver/20 md:left-8 md:top-8" />
      <span className="absolute right-4 top-4 h-5 w-5 border-r border-t border-silver/20 md:right-8 md:top-8" />
      <span className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-silver/20 md:bottom-8 md:left-8" />
      <span className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-silver/20 md:bottom-8 md:right-8" />
    </div>
  )
}
