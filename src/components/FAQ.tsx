import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { FOUNDERS_SHORT } from '../data/brand'
import { Reveal, SectionHeading, SectionShell } from './ui'

const faqs = [
  {
    q: 'How long until my server is live?',
    a: 'Kickoff and Autopilot usually ship in 3 to 7 days. Full Send takes longer when we stay on for integrations, training, and ongoing ops.',
  },
  {
    q: 'Do you actually build custom bots?',
    a: 'Yeah. Not copy-paste template bots. Slash commands, API hooks, automations. Whatever your server needs.',
  },
  {
    q: 'We already have a server. Can you fix it?',
    a: 'That is half our job. We look at what you have, keep what works, rebuild what does not. Most members will not even notice the switch.',
  },
  {
    q: 'Are Server Boosts included?',
    a: 'Nope. Those are Discord\'s thing, priced separate. We can add them to any package if you want the shiny perks.',
  },
  {
    q: 'What is the difference between Autopilot and Full Send?',
    a: 'Autopilot gets you a solid server with bots and automation. Full Send means we stay on your team: CRM sync, mod training, monthly maintenance, priority support.',
  },
  {
    q: 'Who runs DeezOps?',
    a: `${FOUNDERS_SHORT}. Two people who got tired of bad Discord servers and decided to fix them for a living.`,
  },
  {
    q: 'Who is this for?',
    a: 'SaaS, gaming, creators, Web3, brands. Anyone whose Discord should not look like it was built at 3am. If that is you, hey.',
  },
  {
    q: 'Do you like Wumpus?',
    a: 'Obviously. We built half this site around him. He does not get a paycheck though, that is just us.',
  },
]

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="border-b-[3px] border-yellow/25 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-12 w-full items-center justify-between gap-4 py-5 text-left transition hover:text-accent"
        aria-expanded={open}
      >
        <span className="text-title text-[15px] text-text md:text-lg">{q}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-[2.5px] transition ${
            open ? 'rotate-45 border-lime text-lime' : 'border-black text-muted'
          }`}
        >
          <Plus size={14} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
            }
            className="overflow-hidden"
          >
            <p className="text-body-sm max-w-2xl pb-5 pr-10 text-muted">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <SectionShell id="faq" band>
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="FAQ" title="Questions? Yeah, we got you." />
        <Reveal>
          <div className="max-w-3xl rounded-sm border-[3px] border-black bg-card px-5 shadow-hard md:px-7">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.q}
                q={faq.q}
                a={faq.a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
