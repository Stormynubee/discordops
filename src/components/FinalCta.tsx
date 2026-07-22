import { Button } from './ui'

export function FinalCta() {
  return (
    <section className="relative z-10 bg-accent section-y-sm">
      <div className="section-pad mx-auto max-w-4xl text-center">
        <h2 className="text-display text-[clamp(1.75rem,calc(1.2rem+3vw),3.5rem)] overflow-visible text-bg">
          Ready to stop winging it?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-bg/75 sm:mt-4 sm:text-base">
          No @everyone abuse. No 2am #general meltdowns. Just a server that works. Full Send is
          $459 and has basically everything, or just say hi.
        </p>
        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            href="#order?plan=Full%20Send"
            variant="secondary"
            className="!border-border !bg-bg !text-text hover:!border-bg hover:!bg-surface"
          >
            Go Full Send for $459
          </Button>
          <Button
            href="#contact"
            variant="secondary"
            className="!border-bg/30 !bg-transparent !text-bg hover:!bg-bg/10"
          >
            Just say hi
          </Button>
        </div>
      </div>
    </section>
  )
}
