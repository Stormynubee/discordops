import { useEffect, useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Check, MessageCircle } from 'lucide-react'
import { FOUNDERS_SHORT } from '../data/brand'
import { getPlan, PLANS, PRICING_ORDER, type PlanId } from '../data/plans'
import { getLockedPlanFromHash, orderHref } from '../lib/order'
import { PlanMascot } from './PlanMascot'
import { Button } from './ui'

const fieldClass =
  'w-full rounded-xl border border-border/60 bg-elevated/80 px-4 py-3.5 text-sm text-text placeholder:text-muted/70 outline-none transition focus:border-accent/50 focus:bg-elevated'

export function OrderPage() {
  const reduceMotion = useReducedMotion()
  const [planId, setPlanId] = useState<PlanId>(() => getLockedPlanFromHash())
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const sync = () => {
      setPlanId(getLockedPlanFromHash())
      setSubmitted(false)
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const plan = getPlan(planId)!

  const selectPlan = (id: PlanId) => {
    if (id === planId) return
    window.location.hash = orderHref(id)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const discord = String(data.get('discord') ?? '').trim()
    const server = String(data.get('server') ?? '').trim()
    const notes = String(data.get('notes') ?? '').trim()

    const body = [
      `Plan: ${plan.id} ($${plan.price})`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Discord: ${discord}`,
      server ? `Server invite / ID: ${server}` : null,
      '',
      notes || '(no notes)',
    ]
      .filter((line) => line !== null)
      .join('\n')

    const mailto = `mailto:hello@discordops.com?subject=${encodeURIComponent(
      `DiscordOps order: ${plan.id}`,
    )}&body=${encodeURIComponent(body)}`

    window.location.href = mailto
    setSubmitted(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text grain">
      {/* Atmosphere: angled gold wash + discord panel grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 12% -10%, rgba(230,195,100,0.14), transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(88,101,242,0.08), transparent 50%),
            linear-gradient(165deg, #0c0e10 0%, #121416 45%, #1a1c1e 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(230,195,100,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(230,195,100,0.8) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a
          href="#top"
          className="group inline-flex items-center gap-2 text-sm text-muted transition hover:text-text"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
          Back to DiscordOps
        </a>
        <p className="font-display text-sm tracking-wide text-accent/90">DiscordOps</p>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:px-8 lg:pt-8">
        {/* Plan plaque + switcher */}
        <motion.aside
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`relative overflow-hidden rounded-3xl border p-7 sm:p-8 ${
            plan.featured
              ? 'border-accent/40 bg-gradient-to-br from-accent/12 via-card/80 to-discord-panel shadow-[0_0_48px_rgba(230,195,100,0.12)]'
              : 'border-border/70 bg-card/70'
          }`}
        >
          <div className="mb-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Choose your plan</p>
            <div
              role="tablist"
              aria-label="Plan"
              className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border/50 bg-elevated/60 p-1.5"
            >
              {PRICING_ORDER.map((id) => {
                const option = PLANS[id]
                const active = id === planId
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectPlan(id)}
                    className={`relative flex flex-col items-center gap-1 rounded-xl px-1.5 py-2 text-center transition sm:px-2 sm:py-2.5 ${
                      active
                        ? 'bg-accent text-bg shadow-[0_0_20px_rgba(230,195,100,0.25)]'
                        : 'text-muted hover:bg-card/80 hover:text-text'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg sm:h-10 sm:w-10 ${
                        active ? 'bg-bg/90' : 'bg-elevated'
                      }`}
                    >
                      <img
                        src={option.mascot}
                        alt=""
                        aria-hidden
                        className="h-8 w-8 object-contain [mix-blend-mode:lighten] sm:h-9 sm:w-9"
                      />
                    </span>
                    <span className="block text-[11px] font-bold leading-tight sm:text-xs">{option.id}</span>
                    <span className={`block text-[10px] font-medium sm:text-[11px] ${active ? 'text-bg/75' : 'text-muted'}`}>
                      ${option.price}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {plan.featured ? (
                <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-bg">
                  Flagship
                </span>
              ) : null}
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Selected</span>
            </div>
            <PlanMascot plan={plan} size="md" className="-mr-2" />
          </div>

          <motion.div
            key={plan.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{plan.tagline}</p>
            <h1 className="font-display mt-2 text-[clamp(2.4rem,6vw,3.5rem)] leading-[1.1] tracking-tight text-text">
              {plan.id}
            </h1>
            <p className="mt-3 max-w-md text-base text-silver/90">{plan.blurb}</p>

            <div className="mt-8 flex items-end gap-1 border-b border-border/50 pb-6">
              <span className="font-display text-5xl tracking-tight text-accent sm:text-6xl">${plan.price}</span>
              <span className="mb-2 text-sm text-muted">one-time kickoff</span>
            </div>

            <ul className="mt-6 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-sm text-silver/95">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <p className="mt-8 text-xs leading-relaxed text-muted">
            Switch tiers anytime before you send. {FOUNDERS_SHORT} will reply from your email client.
          </p>

          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
          />
        </motion.aside>

        {/* Intake ticket */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-border/60 bg-surface/90 p-7 sm:p-9"
        >
          <div className="mb-2 flex items-center gap-2 text-accent">
            <MessageCircle className="h-5 w-5" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">Order ticket</span>
          </div>
          <h2 className="font-display text-2xl tracking-tight text-text sm:text-3xl">Tell us what we are walking into</h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Opens your email app with everything filled in. No account, no checkout widget. Just send it.
          </p>

          {submitted ? (
            <div className="mt-10 rounded-2xl border border-accent/30 bg-accent/8 p-6">
              <p className="font-display text-xl text-accent">Email client should be open.</p>
              <p className="mt-2 text-sm text-silver">
                If nothing popped up, email{' '}
                <a href="mailto:hello@discordops.com" className="text-accent underline-offset-2 hover:underline">
                  hello@discordops.com
                </a>{' '}
                with plan <strong className="text-text">{plan.id}</strong> in the subject.
              </p>
              <Button href="#top" variant="secondary" className="mt-6">
                Back home
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <input type="hidden" name="plan" value={plan.id} />

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted">Your name</span>
                  <input name="name" required autoComplete="name" className={fieldClass} placeholder="Alex" />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={fieldClass}
                    placeholder="you@company.com"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">Discord handle</span>
                <input
                  name="discord"
                  required
                  className={fieldClass}
                  placeholder="username or user#0000"
                  autoComplete="off"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">
                  Server invite or ID <span className="normal-case tracking-normal text-muted/70">(optional)</span>
                </span>
                <input
                  name="server"
                  className={fieldClass}
                  placeholder="discord.gg/... or server ID"
                  autoComplete="off"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">What is broken / what you want</span>
                <textarea
                  name="notes"
                  rows={5}
                  className={`${fieldClass} resize-y min-h-[120px]`}
                  placeholder="Roles are a mess, welcome flow is dead, mods are drowning… paint the picture."
                />
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted">
                  Selected: <span className="font-semibold text-accent">{plan.id}</span> · ${plan.price}
                </p>
                <Button type="submit" variant="primary" className="w-full sm:w-auto">
                  Send order ticket
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </form>
          )}
        </motion.section>
      </main>
    </div>
  )
}
