import { FOUNDERS_SHORT } from './brand'

export type PlanId = 'Kickoff' | 'Autopilot' | 'Full Send'

export type PlanBoosts = {
  /** Discord server boost count included with the plan */
  amount: number
  /** How many months those boosts are covered */
  months: number
}

export type PlanDefinition = {
  id: PlanId
  price: string
  blurb: string
  featured: boolean
  cta: string
  tagline: string
  /** Plan mascot art under /public/plans */
  mascot: string
  mascotAlt: string
  /** Included Discord boosts (not an add-on) */
  boosts: PlanBoosts
  features: string[]
  preview: {
    channels: string[]
    status: string
    note: string
  }
}

export function formatPlanBoosts(boosts: PlanBoosts): string {
  const boostLabel = `${boosts.amount}× boost${boosts.amount === 1 ? '' : 's'}`
  const monthLabel = boosts.months === 1 ? '1 month' : `${boosts.months} months`
  return `${boostLabel} for ${monthLabel}`
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  Kickoff: {
    id: 'Kickoff',
    price: '60',
    tagline: 'stop the embarrassment',
    blurb: 'Your server looks rough. We fix that.',
    featured: false,
    cta: 'Get Kickoff',
    mascot: '/plans/kickoff-wumpus.png',
    mascotAlt: 'Pixel Wumpus wearing a gold crown',
    boosts: { amount: 2, months: 1 },
    features: [
      'Server setup & branding',
      'Roles, channels & permissions',
      'Verification & welcome flow',
      'Basic moderation',
      'Ticket system',
      'Basic automations',
      '2× boosts for 1 month',
    ],
    preview: {
      channels: ['# welcome', '# rules', '# support'],
      status: 'Welcome bot online. Already looks legit.',
      note: 'Good first impression. Less chaos.',
    },
  },
  Autopilot: {
    id: 'Autopilot',
    price: '120',
    tagline: 'bots do the boring stuff',
    blurb: 'Bots, tickets, analytics. Your mods can breathe again.',
    featured: false,
    cta: 'Get Autopilot',
    mascot: '/plans/autopilot-mod.png',
    mascotAlt: 'Community manager shield badge',
    boosts: { amount: 8, months: 2 },
    features: [
      'Everything in Kickoff',
      'Custom bot (slash commands & APIs)',
      'Webhook automation',
      'Analytics dashboard',
      'Leveling, events & suggestion board',
      'AI assistant',
      '8× boosts for 2 months',
    ],
    preview: {
      channels: ['# welcome', '# support', '# announcements'],
      status: 'Mod bot online. 12 automations running.',
      note: 'Middle tier if you hate doing things manually.',
    },
  },
  'Full Send': {
    id: 'Full Send',
    price: '259',
    tagline: 'we become your discord dept',
    blurb: 'Everything. Integrations, training, maintenance. We stick around.',
    featured: true,
    cta: 'Go Full Send',
    mascot: '/plans/full-send-king.png',
    mascotAlt: 'King Pepe in royal robes with a scepter',
    boosts: { amount: 14, months: 3 },
    features: [
      'Everything in Autopilot',
      'Advanced bots & deep integrations',
      'CRM & website sync',
      'Private client portal',
      'Payment sync',
      'Moderator training',
      'Community management',
      'Monthly maintenance & priority support',
      'Unlimited consultation',
      '14× boosts for 3 months',
    ],
    preview: {
      channels: ['# vip-lounge', '# support', '# governance'],
      status: 'Full ops suite. Priority on everything.',
      note: `What ${FOUNDERS_SHORT} would pick.`,
    },
  },
}

/** Pricing grid order — flagship in the center */
export const PRICING_ORDER: PlanId[] = ['Kickoff', 'Full Send', 'Autopilot']

export const PLAN_IDS = Object.keys(PLANS) as PlanId[]

export function getPlan(id: string): PlanDefinition | undefined {
  return PLANS[id as PlanId]
}

export const DEFAULT_PLAN: PlanId = 'Full Send'
