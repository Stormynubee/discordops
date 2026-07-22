import { useEffect, useState, type FormEvent } from 'react'
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import { CONTACT_EMAIL, FOUNDER_ARYA, FOUNDER_HANSRAJ } from '../data/brand'
import { DEFAULT_PLAN, PLAN_IDS } from '../data/plans'
import { sendFormSubmit } from '../lib/formsubmit'
import { Button, Reveal, SectionHeading } from './ui'

const timeline = [
  { step: '1', title: 'We read your message', time: 'Within 24h' },
  { step: '2', title: 'Quick call if needed', time: 'No calendar hell' },
  { step: '3', title: 'Plan and price, straight up', time: '2 to 3 days max' },
]

const VALID_PLANS = [...PLAN_IDS, 'Custom / Consultation'] as const

function getPlanFromUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_PLAN
  const hash = window.location.hash
  const queryStart = hash.indexOf('?')
  if (queryStart === -1) return DEFAULT_PLAN
  const params = new URLSearchParams(hash.slice(queryStart + 1))
  const plan = params.get('plan')
  if (plan && (VALID_PLANS as readonly string[]).includes(plan)) {
    return plan
  }
  return DEFAULT_PLAN
}

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<string>(DEFAULT_PLAN)

  useEffect(() => {
    setPlan(getPlanFromUrl())
    const onHashChange = () => setPlan(getPlanFromUrl())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    const form = e.currentTarget as HTMLFormElement
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const type = String(data.get('type') ?? plan)
    const message = String(data.get('message') ?? '').trim()
    if (String(data.get('_honey') ?? '')) return

    setSending(true)
    setError(null)
    try {
      await sendFormSubmit({
        _subject: `DeezOps inquiry: ${type}`,
        form: 'Contact',
        plan: type,
        name,
        email,
        message,
      })
      setSubmitted(true)
      form.reset()
    } catch {
      setError('Could not send. Try again, or email us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section-cv relative section-pad section-y">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Contact"
          title="Hit us up."
          description="Tell us what is broken. We reply in 24 hours, not next month."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-6">
              <div>
                <p className="text-label-caps mb-4 text-silver">
                  What happens next
                </p>
                <ol className="space-y-4">
                  {timeline.map((item) => (
                    <li key={item.step} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-step text-[11px] text-silver">
                        {item.step}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-text">{item.title}</p>
                        <p className="text-[12px] text-muted">{item.time}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-3 border-t border-border pt-6">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group flex items-center gap-4 rounded-sm border-[3px] border-black bg-card p-5 shadow-[3px_3px_0_#000] transition hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#000]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm border-[2.5px] border-black bg-accent text-white">
                    <Mail size={17} />
                  </span>
                  <div>
                    <p className="text-[12px] text-muted">Email</p>
                    <p className="text-sm font-medium text-text group-hover:text-accent">{CONTACT_EMAIL}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 rounded-sm border-[3px] border-black bg-card p-5 shadow-[3px_3px_0_#000]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm border-[2.5px] border-black bg-lime text-bg">
                    <MessageCircle size={17} />
                  </span>
                  <div>
                    <p className="text-[12px] text-muted">Response time</p>
                    <p className="text-sm font-medium text-text">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={onSubmit} className="panel p-6 md:p-8">
              {submitted ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <ArrowUpRight size={18} />
                  </div>
                  <h3 className="text-title text-xl text-text">Got it.</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    {FOUNDER_HANSRAJ} or {FOUNDER_ARYA} will get back to you. Usually within a day.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
                  <label className="block">
                    <span className="mb-1.5 block text-label text-muted">Name</span>
                    <input
                      required
                      name="name"
                      className="w-full rounded-sm border-[3px] border-black bg-bg px-3.5 py-2.5 text-sm text-text shadow-[3px_3px_0_#000] outline-none transition focus:border-lime"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-label text-muted">Email</span>
                    <input
                      required
                      type="email"
                      name="email"
                      className="w-full rounded-sm border-[3px] border-black bg-bg px-3.5 py-2.5 text-sm text-text shadow-[3px_3px_0_#000] outline-none transition focus:border-lime"
                      placeholder="you@company.com"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-label text-muted">Package</span>
                    <select
                      name="type"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className="w-full rounded-sm border-[3px] border-black bg-bg px-3.5 py-2.5 text-sm text-text shadow-[3px_3px_0_#000] outline-none transition focus:border-lime"
                    >
                      {PLAN_IDS.map((id) => (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      ))}
                      <option>Custom / Consultation</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-label text-muted">Message</span>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      className="w-full resize-none rounded-sm border-[3px] border-black bg-bg px-3.5 py-2.5 text-sm text-text shadow-[3px_3px_0_#000] outline-none transition focus:border-lime"
                      placeholder="What's wrong with your server? Be honest."
                    />
                  </label>
                  {error ? (
                    <p className="sm:col-span-2 text-sm text-red-400" role="alert">
                      {error}{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                  ) : null}
                  <div className="sm:col-span-2">
                    <Button type="submit" variant="primary" className="w-full" disabled={sending}>
                      {sending ? 'Sending…' : 'Send it'}
                      {!sending ? <ArrowUpRight size={16} /> : null}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
