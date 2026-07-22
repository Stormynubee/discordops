import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useParallax } from './ui'

type ChannelId =
  | 'announcements'
  | 'general'
  | 'support-tickets'
  | 'automation-log'
  | 'analytics'

type PromptState = 'idle' | 'prompted' | 'used'

const STICKER = {
  approved: '/stickers/cat-approved.png',
  flowers: '/stickers/cat-flowers.png',
  shush: '/stickers/cat-shush.png',
  crazy: '/stickers/cat-crazy.png',
  peepocop: '/stickers/peepocop.png',
  coffee: '/stickers/pepe-coffee.png',
  clap: '/stickers/emotes/pepe-clap.gif',
  typing: '/stickers/emotes/pepe-typing.gif',
} as const

const ROLE_ICON: Record<'mod' | 'staff', string> = {
  mod: '/stickers/role-moderator.png',
  staff: '/stickers/role-staff.png',
}

type Reaction = { src: string; count: number }

type Message = {
  author: string
  text?: string
  time: string
  role?: 'mod' | 'staff'
  sticker?: string
  clip?: string
  reactions?: Reaction[]
}

type Channel = {
  id: ChannelId
  name: string
  unread: number
  messages: Message[]
}

const channels: Channel[] = [
  {
    id: 'announcements',
    name: 'announcements',
    unread: 2,
    messages: [
      {
        author: 'DeezOps',
        role: 'staff',
        text: 'New members: please pretend you read #rules.',
        time: 'Today at 9:00',
        reactions: [{ src: STICKER.approved, count: 34 }],
      },
      { author: 'DeezOps', role: 'staff', text: "Server's live. Try not to break it.", time: 'Today at 9:01' },
    ],
  },
  {
    id: 'general',
    name: 'general',
    unread: 0,
    messages: [
      {
        author: 'member_42',
        text: 'is it just me or does every general go feral at 2am',
        time: 'Yesterday',
        reactions: [{ src: STICKER.crazy, count: 12 }],
      },
      { author: 'mod_team', role: 'mod', text: 'it is not just you', time: 'Yesterday' },
      {
        author: 'member_42',
        text: 'we just hit 3k members LETS GOOO',
        clip: '/toothless-dance.mp4',
        time: 'Yesterday',
        reactions: [
          { src: STICKER.clap, count: 48 },
          { src: STICKER.flowers, count: 21 },
          { src: STICKER.approved, count: 15 },
        ],
      },
    ],
  },
  {
    id: 'support-tickets',
    name: 'support-tickets',
    unread: 5,
    messages: [
      {
        author: 'OpsBot',
        text: 'Ticket #482: user asked how to download more RAM. Closed with love.',
        time: '2m ago',
        sticker: STICKER.typing,
      },
      {
        author: 'OpsBot',
        text: 'Ticket #483: "where is general". User was already in general.',
        time: '8m ago',
        reactions: [{ src: STICKER.shush, count: 9 }],
      },
    ],
  },
  {
    id: 'automation-log',
    name: 'automation-log',
    unread: 0,
    messages: [
      {
        author: 'WelcomeBot',
        text: 'Hugged 47 newcomers. Zero casualties.',
        time: '1h ago',
        reactions: [{ src: STICKER.flowers, count: 47 }],
      },
      {
        author: 'SheriffBot',
        role: 'mod',
        text: 'Raid attempt blocked. Officer on patrol.',
        time: '1h ago',
        sticker: STICKER.peepocop,
      },
      { author: 'Router', text: 'Routed 12 tickets. 0 escaped into #general.', time: '2h ago' },
    ],
  },
  {
    id: 'analytics',
    name: 'analytics',
    unread: 1,
    messages: [
      {
        author: 'GrowthDash',
        text: 'You grew 8.2% this week. Your mods cannot take credit for this.',
        time: '3h ago',
      },
      {
        author: 'GrowthDash',
        text: '3.1k active members. Someone is doing something right.',
        time: '3h ago',
        sticker: STICKER.coffee,
      },
    ],
  },
]

function AnimatedMetric({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? target : 0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setDisplay(target)
      return
    }

    const duration = 1200
    const start = performance.now()
    let frame: number

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target * 10) / 10)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduceMotion, target])

  return (
    <p ref={ref} className="mt-0.5 text-sm font-semibold tracking-tight text-white">
      {display}
      {suffix}
    </p>
  )
}

function ClipVideo({ src, reduceMotion }: { src: string; reduceMotion: boolean | null }) {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { margin: '-10% 0px' })

  useEffect(() => {
    const video = ref.current
    if (!video || reduceMotion) return
    if (inView) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [inView, reduceMotion])

  return (
    <video
      ref={ref}
      src={src}
      className="mt-1.5 w-[10.5rem] rounded-lg border border-white/10 sm:w-[12.25rem]"
      autoPlay={!reduceMotion}
      loop
      muted
      playsInline
      preload="metadata"
      controls={!!reduceMotion}
    />
  )
}

export function DiscordMockup() {
  const reduceMotion = useReducedMotion()
  const [enableTilt, setEnableTilt] = useState(false)
  const [activeId, setActiveId] = useState<ChannelId>('announcements')
  const [promptState, setPromptState] = useState<PromptState>('idle')
  const commandCenterRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const soundPlayedRef = useRef(false)
  const commandCenterInView = useInView(commandCenterRef, {
    once: true,
    margin: '-20% 0px -20% 0px',
  })
  const { rotateX, rotateY, onMove, onLeave } = useParallax(6)

  const active = channels.find((c) => c.id === activeId) ?? channels[0]

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    setEnableTilt(!coarse && !reduceMotion)
  }, [reduceMotion])

  useEffect(() => {
    if (commandCenterInView) setPromptState('prompted')
  }, [commandCenterInView])

  const playPingOnce = () => {
    if (soundPlayedRef.current || promptState !== 'prompted') return

    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.32
    void audio
      .play()
      .then(() => {
        soundPlayedRef.current = true
      })
      .catch(() => {
        // Hover playback may be blocked until the first click or tap.
      })
  }

  const selectChannel = (id: ChannelId) => {
    setActiveId(id)
    setPromptState('used')
  }

  return (
    <div
      ref={commandCenterRef}
      className="w-full"
      onPointerEnter={playPingOnce}
      onPointerDown={playPingOnce}
    >
      <audio ref={audioRef} src="/command-center-ping.wav" preload="auto" />
      <motion.div
        className="relative mx-auto w-full max-w-full sm:max-w-[33.75rem] lg:max-w-[36rem] perspective-[1200px]"
        style={enableTilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        onMouseMove={enableTilt ? onMove : undefined}
        onMouseLeave={enableTilt ? onLeave : undefined}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="command-frame">
          <div className="relative overflow-hidden rounded-[2px] bg-discord">
            <div className="flex items-center justify-between border-b-[3px] border-black bg-[#14171b] px-3.5 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-[2px] border-2 border-black bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-[2px] border-2 border-black bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-[2px] border-2 border-black bg-[#28c840]" />
              </div>
              <p className="font-display text-[12px] font-bold tracking-wide text-yellow">
                Command Center
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-[1px] border-2 border-black bg-lime" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-lime">
                  Live
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[108px_1fr] sm:grid-cols-[132px_1fr]">
            <aside className="border-r border-white/[0.06] bg-[#1a1d21] p-2 sm:p-2.5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-accent text-[11px] font-bold text-bg">
                DO
              </div>
              <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-[#949ba4]">
                Channels
              </p>
              <ul className="space-y-0.5" role="listbox" aria-label="Channels">
                {channels.map((ch) => {
                  const isActive = ch.id === activeId
                  return (
                    <li key={ch.id}>
                      <motion.button
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => selectChannel(ch.id)}
                        animate={
                          promptState === 'prompted' &&
                          ch.id === 'announcements' &&
                          !reduceMotion
                            ? { x: [0, -3, 3, 0] }
                            : { x: 0 }
                        }
                        transition={{ duration: 0.36, delay: 0.5 }}
                        className={`flex min-h-[36px] w-full items-center justify-between rounded-md px-1.5 py-1.5 text-left text-[11px] transition sm:min-h-[32px] ${
                          isActive
                            ? 'bg-accent/15 text-white'
                            : 'text-[#949ba4] hover:bg-white/[0.04] hover:text-[#dbdee1]'
                        }`}
                      >
                        <span className="flex min-w-0 items-center">
                          <span className="truncate">
                          <span className="mr-0.5 opacity-60">#</span>
                          {ch.name}
                          </span>
                          {promptState === 'prompted' && ch.id === 'announcements' ? (
                            <motion.span
                              initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            />
                          ) : null}
                        </span>
                        {ch.unread > 0 ? (
                          <span className="ml-1 shrink-0 rounded-full bg-accent px-1.5 text-[9px] font-semibold text-bg">
                            {ch.unread}
                          </span>
                        ) : null}
                      </motion.button>
                    </li>
                  )
                })}
              </ul>
            </aside>

            <div className="flex min-h-[17.5rem] flex-col bg-discord-panel sm:min-h-[20rem]">
              <div className="grid grid-cols-4 gap-1.5 border-b border-white/[0.06] p-2 sm:gap-2 sm:p-2.5">
                {[
                  { label: 'Members', value: 12.4, suffix: 'k', animate: true },
                  { label: 'Active', value: '3.1k', animate: false },
                  { label: 'Tickets', value: '47', animate: false },
                  { label: 'Bots', value: '9', animate: false },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-md border border-white/[0.05] bg-[#1a1d21]/90 px-2 py-1.5"
                  >
                    <p className="text-[9px] font-medium text-[#949ba4]">{m.label}</p>
                    {m.animate && typeof m.value === 'number' ? (
                      <AnimatedMetric target={m.value} suffix="k" />
                    ) : (
                      <p className="mt-0.5 text-sm font-semibold text-white">{m.value}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                <p className="mb-2 text-[10px] font-medium text-[#949ba4]">
                  # {active.name}
                </p>
                <AnimatePresence mode="wait">
                  <motion.ul
                    key={activeId}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 space-y-3"
                  >
                    {active.messages.map((msg, i) => (
                      <li key={i} className="flex gap-2">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[9px] font-bold text-accent">
                          {msg.author.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1 text-[11px] font-medium text-white">
                            {msg.author}
                            {msg.role ? (
                              <img
                                src={ROLE_ICON[msg.role]}
                                alt={msg.role === 'mod' ? 'moderator' : 'staff'}
                                className="h-3 w-3"
                              />
                            ) : null}
                            <span className="font-normal text-[#949ba4]">{msg.time}</span>
                          </p>
                          {msg.text ? (
                            <p className="mt-0.5 text-[12px] leading-relaxed text-[#b5bac1]">
                              {msg.text}
                            </p>
                          ) : null}
                          {msg.sticker ? (
                            <img
                              src={msg.sticker}
                              alt="sticker"
                              className="mt-1.5 h-16 w-16 object-contain sm:h-[76px] sm:w-[76px]"
                            />
                          ) : null}
                          {msg.clip ? <ClipVideo src={msg.clip} reduceMotion={reduceMotion} /> : null}
                          {msg.reactions ? (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {msg.reactions.map((r) => (
                                <span
                                  key={r.src}
                                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5"
                                >
                                  <img src={r.src} alt="reaction" className="h-3.5 w-3.5 object-contain" />
                                  <span className="text-[9px] font-semibold text-[#949ba4]">{r.count}</span>
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>
          </div>
          </div>
        </div>
      </motion.div>
      <div className="mt-3.5 flex min-h-10 flex-col items-center gap-2.5 px-1">
        <div className="rule-y2k rule-y2k-thin w-full max-w-[220px] opacity-90" aria-hidden />
        <AnimatePresence mode="wait">
          {promptState === 'prompted' ? (
            <motion.div
              key="prompt-wrap"
              className="flex w-full items-center justify-center gap-2 sm:gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            >
              <span
                aria-hidden
                className="hidden h-1 w-10 shrink-0 bg-lime shadow-[2px_2px_0_#000] sm:block"
              />
              <motion.button
                type="button"
                onClick={() => selectChannel('announcements')}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { x: -1, y: -1, boxShadow: '4px 4px 0 #000' }
                }
                whileTap={
                  reduceMotion
                    ? undefined
                    : { x: 2, y: 2, boxShadow: '1px 1px 0 #000' }
                }
                className="hard-cta text-[11px] sm:text-[12px]"
              >
                <span className="hard-cta-mark" aria-hidden />
                Open it before the mods do.
                <span aria-hidden className="font-display text-[14px] leading-none">
                  →
                </span>
              </motion.button>
              <span
                aria-hidden
                className="hidden h-1 w-10 shrink-0 bg-yellow shadow-[2px_2px_0_#000] sm:block"
              />
            </motion.div>
          ) : promptState === 'used' ? (
            <motion.p
              key="used"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-sm border-[3px] border-black bg-lime px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-bg shadow-[3px_3px_0_#000]"
            >
              Good choice. The buttons work.
            </motion.p>
          ) : null}
        </AnimatePresence>
        <div className="rule-y2k w-full max-w-[280px]" aria-hidden />
      </div>
    </div>
  )
}
