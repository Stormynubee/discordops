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
    <section id="proof" className="relative z-10 py-0" aria-label="Client results">
      <div className="marquee-container w-full py-4">
        <div className="marquee-content items-center gap-10 px-8 text-[13px] font-bold uppercase tracking-wide text-white">
          {doubled.map((item, i) => (
            <span key={`${item}-${i}`} className="inline-flex shrink-0 items-center gap-10">
              {item}
              <span className="h-2 w-2 shrink-0 rotate-45 bg-yellow" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
