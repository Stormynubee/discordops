const items = [
  '180+ communities built',
  '99.9% uptime',
  '3.4x avg growth',
  '+340% retention at Nova SaaS',
  '47 bots down to 3 at Apex Gaming',
  'Launch day: zero chaos at Ledger Circle',
  '0 @everyone disasters',
  'Boost level 3, unlocked',
  '999+ unread, all triaged',
  'Raids: handled',
]

export function ProofMarquee() {
  const doubled = [...items, ...items]

  return (
    <section
      id="proof"
      className="relative z-10 border-y border-border bg-elevated/50 py-10"
      aria-label="Client results"
    >
      <div className="marquee-container w-full">
        <div className="marquee-content items-center gap-12 px-8 text-[13px] font-medium text-muted">
          {doubled.map((item, i) => (
            <span key={`${item}-${i}`} className="inline-flex shrink-0 items-center gap-12">
              {item}
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent pulse-gold" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
