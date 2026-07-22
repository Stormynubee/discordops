import { ArrowUpRight } from 'lucide-react'
import { Button, Reveal, Sticker } from './ui'

const boosts = [
  { level: 'Pack I', amount: '2 Boosts', note: 'Level 1 perks' },
  { level: 'Pack II', amount: '7 Boosts', note: 'Level 2 perks' },
  { level: 'Pack III', amount: '14 Boosts', note: 'Level 3 perks' },
]

export function Boosts() {
  return (
    <section className="relative section-pad pb-8 md:pb-16">
      <Reveal>
        <div className="mx-auto max-w-7xl rounded-sm border-[3px] border-black bg-card px-6 py-10 shadow-[4px_4px_0_#000] md:px-10 md:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <Sticker tone="lime" className="mb-3">
                Optional add-on
              </Sticker>
              <h3 className="text-title mt-2 text-2xl text-text md:text-3xl">
                Discord Server Boosts
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-[15px]">
                Want the shiny Discord perks? Boost packs are separate from build pricing. Add
                them if you want, skip if you do not.
              </p>
              <Button href="#contact" variant="ghost" className="mt-5 !px-0">
                Add boosts to your plan
                <ArrowUpRight size={16} />
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6">
              {boosts.map((b) => (
                <div
                  key={b.level}
                  className="min-w-[110px] rounded-sm border-[3px] border-black bg-elevated px-4 py-3 shadow-[3px_3px_0_#000]"
                >
                  <p className="text-label text-lime">{b.level}</p>
                  <p className="text-title mt-1 text-xl text-text sm:text-2xl">{b.amount}</p>
                  <p className="mt-0.5 text-[12px] text-muted">{b.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
