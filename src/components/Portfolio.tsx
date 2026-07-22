import { Reveal, SectionHeading } from './ui'

const projects = [
  {
    name: 'Nova Collective',
    type: 'SaaS Community',
    members: '18.2k',
    metric: '+3.4× growth',
    tint: 'bg-accent/10',
    iconBg: 'bg-accent',
    channels: ['product-updates', 'founders-lounge', 'support'],
    active: 1,
  },
  {
    name: 'Aether Games',
    type: 'Gaming Network',
    members: '42.6k',
    metric: '+2.8× engagement',
    tint: 'bg-white/[0.04]',
    iconBg: 'bg-silver/80',
    channels: ['matchmaking', 'tournaments', 'creators'],
    active: 0,
  },
  {
    name: 'Ledger Circle',
    type: 'Web3 / DAO',
    members: '9.4k',
    metric: '+5.1× retention',
    tint: 'bg-accent/8',
    iconBg: 'bg-accent',
    channels: ['proposals', 'treasury', 'governance'],
    active: 2,
  },
  {
    name: 'Signal Brand',
    type: 'Creator HQ',
    members: '27.1k',
    metric: '+4.2× active users',
    tint: 'bg-white/[0.03]',
    iconBg: 'bg-[#3a3a42]',
    channels: ['drops', 'vip-access', 'collabs'],
    active: 1,
  },
]

export function Portfolio() {
  return (
    <section id="portfolio" className="section-cv relative section-pad section-y">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Servers we have built."
          description="Real communities with real members, mods, and boosts. Not mockups."
        />

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
          {projects.map((project, i) => (
            <Reveal
              key={project.name}
              delay={i * 0.06}
              className="w-[min(85vw,420px)] shrink-0 snap-start md:w-auto"
            >
              <article className="group h-full overflow-hidden rounded-sm border-[3px] border-black bg-card shadow-[4px_4px_0_#000] transition duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000]">
                <div className={`relative h-40 ${project.tint}`}>
                  <div className="absolute inset-x-5 bottom-0 top-5 overflow-hidden rounded-t-lg border border-b-0 border-white/10 bg-discord shadow-lg">
                    <div className="flex gap-3 border-b border-white/[0.06] px-3 py-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${project.iconBg} text-[10px] font-bold text-white`}
                      >
                        {project.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="truncate text-[12px] font-semibold text-white">
                          {project.name}
                        </p>
                        <p className="text-[10px] text-[#949ba4]">{project.members} members</p>
                      </div>
                    </div>
                    <div className="space-y-0.5 bg-discord-panel px-2 py-2">
                      {project.channels.map((ch, idx) => (
                        <div
                          key={ch}
                          className={`rounded px-2 py-1 text-[11px] ${
                            idx === project.active
                              ? 'bg-white/[0.08] text-white'
                              : 'text-[#949ba4]'
                          }`}
                        >
                          <span className="opacity-50">#</span> {ch}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <p className="text-label-caps text-accent">
                      {project.type}
                    </p>
                    <h3 className="text-title mt-1 text-xl text-text">
                      {project.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-title text-lg text-accent">{project.metric}</p>
                    <p className="text-[11px] text-muted">{project.members} members</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
