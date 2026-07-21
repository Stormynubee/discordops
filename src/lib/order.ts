import { DEFAULT_PLAN, getPlan, PLAN_IDS, type PlanId } from '../data/plans'

export function isOrderHash(hash: string): boolean {
  return hash === '#order' || hash.startsWith('#order?')
}

export function orderHref(plan: PlanId): string {
  return `#order?plan=${encodeURIComponent(plan)}`
}

export function getLockedPlanFromHash(hash = typeof window !== 'undefined' ? window.location.hash : ''): PlanId {
  const queryStart = hash.indexOf('?')
  if (queryStart === -1) return DEFAULT_PLAN
  const plan = new URLSearchParams(hash.slice(queryStart + 1)).get('plan')
  if (plan && (PLAN_IDS as readonly string[]).includes(plan) && getPlan(plan)) {
    return plan as PlanId
  }
  return DEFAULT_PLAN
}
