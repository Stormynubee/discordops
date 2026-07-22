import { FOUNDERS_SHORT } from './brand'

export type PlanId = 'Kickoff' | 'Autopilot' | 'Full Send'

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
  features: string[]
  preview: {
    channels: string[]
    status: string
    note: string
  }
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  Kickoff: {
    id: 'Kickoff',
    price: '129',
    tagline: 'stop the embarrassment',
    blurb: 'Your server looks rough. We fix that.',
    featured: false,
    cta: 'Get Kickoff',
    mascot: '/plans/kickoff-wumpus.png',
    mascotAlt: 'Pixel Wumpus wearing a gold crown',
    features: [
      'Server setup & branding',
      'Roles, channels & permissions',
      'Verification & welcome flow',
      'Basic moderation',
      'Ticket system',
      'Basic automations',
      'Optional server boosts (add-on)',
    ],
    preview: {
      channels: ['# welcome', '# rules', '# support'],
      status: 'Welcome bot online. Already looks legit.',
      note: 'Good first impression. Less chaos.',
    },
  },
  Autopilot: {
    id: 'Autopilot',
    price: '249',
    tagline: 'bots do the boring stuff',
    blurb: 'Bots, tickets, analytics. Your mods can breathe again.',
    featured: false,
    cta: 'Get Autopilot',
    mascot: '/plans/autopilot-mod.png',
    mascotAlt: 'Community manager shield badge',
    features: [
      'Everything in Kickoff',
      'Custom bot (slash commands & APIs)',
      'Webhook automation',
      'Analytics dashboard',
      'Leveling, events & suggestion board',
      'AI assistant',
      'Optional server boosts (add-on)',
    ],
    preview: {
      channels: ['# welcome', '# support', '# announcements'],
      status: 'Mod bot online. 12 automations running.',
      note: 'Middle tier if you hate doing things manually.',
    },
  },
  'Full Send': {
    id: 'Full Send',
    price: '459',
    tagline: 'we become your discord dept',
    blurb: 'Everything. Integrations, training, maintenance. We stick around.',
    featured: true,
    cta: 'Go Full Send',
    mascot: '/plans/full-send-king.png',
    mascotAlt: 'King Pepe in royal robes with a scepter',
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
      'Optional server boosts (add-on)',
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
