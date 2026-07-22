import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { DEFAULT_PLAN, PLANS } from '../../data/plans'
import { Button } from '../ui'

const DISMISS_KEY = 'deezops-sticky-dismissed'

export function StickyPurchaseBar() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const flagship = PLANS[DEFAULT_PLAN]

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) {
      setDismissed(true)
      return
    }

    const onScroll = () => {
      const hero = document.getElementById('top')
      if (!hero) return
      const passed = window.scrollY > hero.offsetHeight * 0.65
      setVisible(passed)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dismiss = () => {
    setDismissed(true)
    sessionStorage.setItem(DISMISS_KEY, '1')
  }

  const show = visible && !dismissed

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={reduceMotion ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t-[3px] border-yellow bg-cobalt px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_0_#000]"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-white sm:text-sm">
                Full Send · <span className="text-yellow">${flagship.price}</span>
                <span className="hidden sm:inline"> · the one that actually fixes everything</span>
              </p>
              <p className="hidden text-[12px] text-white/70 sm:block">
                Integrations, training, maintenance. We stick around.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                href={`#order?plan=${encodeURIComponent(DEFAULT_PLAN)}`}
                variant="primary"
                className="!min-h-[42px] !px-4 !py-2 text-[13px] sm:!px-5"
              >
                Go Full Send
                <ArrowUpRight size={14} />
              </Button>
              <button
                type="button"
                onClick={dismiss}
                className="flex h-11 w-11 items-center justify-center rounded-sm border-[3px] border-black bg-bg text-muted shadow-[3px_3px_0_#000] transition hover:text-lime"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
