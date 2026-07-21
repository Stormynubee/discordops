import { Reveal, SectionHeading } from './ui'

const steps = [
  {
    num: '01',
    title: 'Tell us what you need',
    desc: 'Send a message. We reply within 24 hours. Faster if the coffee hit.',
  },
  {
    num: '02',
    title: 'We build your server',
    desc: 'Channels, bots, branding, automations. Usually done in 7 to 14 days.',
  },
  {
    num: '03',
    title: 'You go live',
    desc: 'Launch day. Training included. Panic sold separately.',
  },
]

export function HowItWorks() {
  return (
    <section className="relative section-pad py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Process"
          title="Three steps. Two weeks. Done."
          description="No endless email chains. Just a clear path to a server that works."
        />

        <div className="relative mt-4 overflow-visible">
          <div
            aria-hidden
            className="absolute left-[15px] top-4 hidden h-[calc(100%-2rem)] w-px bg-border md:left-[19px] md:block"
          />
          <ol className="space-y-10 md:space-y-12">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.08}>
                <li className="relative flex gap-5 overflow-visible md:gap-8">
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-bg font-mono text-[11px] font-medium text-silver md:h-10 md:w-10">
                    {step.num}
                  </span>
                  <div className="overflow-visible pt-0.5 md:pt-1">
                    <h3 className="font-display text-xl font-semibold text-text md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted">{step.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
