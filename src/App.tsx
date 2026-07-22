import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { SplashScreen } from './components/SplashScreen'
import { StickyPurchaseBar } from './components/signature/StickyPurchaseBar'
import { SiteAtmosphere } from './components/SiteAtmosphere'
import { isOrderHash } from './lib/order'

const HomeBelowFold = lazy(() =>
  import('./components/HomeBelowFold').then((m) => ({ default: m.HomeBelowFold })),
)
const FinalCta = lazy(() =>
  import('./components/FinalCta').then((m) => ({ default: m.FinalCta })),
)
const Footer = lazy(() =>
  import('./components/Footer').then((m) => ({ default: m.Footer })),
)
const OrderPage = lazy(() =>
  import('./components/OrderPage').then((m) => ({ default: m.OrderPage })),
)
const DiscordOrb = lazy(() =>
  import('./components/DiscordOrb').then((m) => ({ default: m.DiscordOrb })),
)
const BackgroundMascot = lazy(() =>
  import('./components/BackgroundMascot').then((m) => ({ default: m.BackgroundMascot })),
)

function readIsOrder(): boolean {
  return typeof window !== 'undefined' && isOrderHash(window.location.hash)
}

function BelowFoldFallback() {
  return <div className="min-h-[50vh]" aria-hidden />
}

export default function App() {
  const [isOrder, setIsOrder] = useState(readIsOrder)
  const [showSplash, setShowSplash] = useState(() => !readIsOrder())

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  useEffect(() => {
    const sync = () => {
      const order = isOrderHash(window.location.hash)
      setIsOrder(order)
      if (order) setShowSplash(false)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    if (isOrder || !showSplash) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [showSplash, isOrder])

  // Warm the below-fold chunk after first paint / splash
  useEffect(() => {
    if (isOrder || showSplash) return
    const warm = () => {
      void import('./components/HomeBelowFold')
    }
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm, { timeout: 1800 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(warm, 400)
    return () => window.clearTimeout(t)
  }, [isOrder, showSplash])

  if (isOrder) {
    return (
      <div className="relative min-h-screen bg-bg text-text">
        <Suspense fallback={<div className="min-h-screen bg-bg" aria-hidden />}>
          <OrderPage />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-bg text-text grain">
      <SiteAtmosphere />
      {!showSplash ? (
        <Suspense fallback={null}>
          <BackgroundMascot />
        </Suspense>
      ) : null}
      {showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : null}
      <Navbar />
      <div className="relative z-10">
        <StickyPurchaseBar />
        <main className="pb-[max(6.5rem,calc(env(safe-area-inset-bottom,0px)+5.5rem))]">
          <Hero />
          <Suspense fallback={<BelowFoldFallback />}>
            <HomeBelowFold />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <FinalCta />
          <Footer />
        </Suspense>
      </div>
      {!showSplash ? (
        <Suspense fallback={null}>
          <DiscordOrb />
        </Suspense>
      ) : null}
    </div>
  )
}
