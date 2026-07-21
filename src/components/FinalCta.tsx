import { Button } from './ui'

export function FinalCta() {
  return (
    <section className="relative z-10 bg-accent py-20 md:py-24">
      <div className="section-pad mx-auto max-w-4xl text-center">
        <h2 className="text-display text-[clamp(2rem,5vw,3.5rem)] overflow-visible text-bg">
          Ready to stop winging it?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-bg/75">
          No @everyone abuse. No 2am #general meltdowns. Just a server that works. Full Send is
          $447 and has basically everything, or just say hi.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            href="#order?plan=Full%20Send"
            variant="secondary"
            className="!border-border !bg-bg !text-text hover:!border-bg hover:!bg-surface"
          >
            Go Full Send for $447
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
