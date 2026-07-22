import { useReducedMotion } from 'framer-motion'
import { Button, Sticker } from './ui'

export function FinalCta() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative z-10 section-y-sm">
      <div className="section-pad mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-sm border-[3px] border-black bg-accent px-6 py-12 text-center shadow-[6px_6px_0_#000] sm:px-10 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20 checker-bg" />
          {!reduceMotion ? (
            <img
              src="/stickers/emotes/pepe-laugh.gif"
              alt=""
              aria-hidden
              loading="lazy"
              className="pointer-events-none absolute -right-1 -top-1 z-[1] h-14 w-14 rotate-[8deg] drop-shadow-[3px_3px_0_#000] sm:right-2 sm:top-2 sm:h-16 sm:w-16"
            />
          ) : null}
          <div className="relative z-10">
            <Sticker tone="yellow" className="mb-4 inline-flex sticker-rotate">
              Last call
            </Sticker>
            <h2 className="text-display text-[clamp(1.75rem,calc(1.2rem+3vw),3.25rem)] text-white">
              Ready to stop winging it?
            </h2>
            <p className="text-body mx-auto mt-3 max-w-md text-white/90 sm:mt-4">
              No @everyone abuse. No 2am #general meltdowns. Just a server that works. Full Send is
              $459 and has basically everything, or just say hi.
            </p>
            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                href="#order?plan=Full%20Send"
                variant="secondary"
                className="!bg-bg !text-text hover:!bg-yellow hover:!text-bg"
              >
                Go Full Send for $459
              </Button>
              <Button
                href="#contact"
                variant="ghost"
                className="!min-h-[48px] !border-white/50 !text-white hover:!border-lime hover:!bg-black/15 hover:!text-lime"
              >
                Just say hi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
