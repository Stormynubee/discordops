import { Bot, LayoutGrid, Shield, type LucideIcon } from 'lucide-react'
import { Reveal, SectionHeading } from './ui'

type ServiceRow = {
  icon: LucideIcon
  title: string
  items: string[]
}

const rows: ServiceRow[] = [
  {
    icon: LayoutGrid,
    title: 'Server setup & branding',
    items: [
      'Roles, channels, permissions that make sense',
      'Welcome flows that don\'t scare people off',
      'Looks like your brand, not a template',
    ],
  },
  {
    icon: Bot,
    title: 'Bots & automation',
    items: [
      'Custom bots with slash commands and hooks',
      'Tickets, moderation, leveling, giveaways',
      'Stuff that saves your team hours every week',
    ],
  },
  {
    icon: Shield,
    title: 'Growth & support',
    items: [
      'Dashboards so you know what\'s working',
      'Mod training and monthly maintenance',
      'Website, portal, and payment hooks',
    ],
  },
]

export function Services() {
  return (
    <section id="services" className="relative section-band section-y">
      <div className="section-pad relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Services"
          title="What we actually do"
          description="We build and maintain your Discord so you can talk to humans instead of fixing channels."
        />

        <div className="divide-y divide-border">
          {rows.map((row, i) => (
            <Reveal key={row.title} delay={i * 0.08}>
              <article className="grid gap-4 py-8 md:grid-cols-[1fr_1.2fr] md:items-start md:gap-12 md:py-10">
                <div className="flex items-start gap-3">
                  <row.icon size={20} className="mt-0.5 shrink-0 text-accent" strokeWidth={1.75} />
                  <h3 className="text-title text-xl text-text md:text-2xl">
                    {row.title}
                  </h3>
                </div>
                <ul className="space-y-2.5 md:pt-1">
                  {row.items.map((item) => (
                    <li key={item} className="text-[15px] leading-relaxed text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
