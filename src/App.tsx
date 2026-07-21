import { useCallback, useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Services } from './components/Services'
import { CommandDeck } from './components/signature/CommandDeck'
import { Portfolio } from './components/Portfolio'
import { Testimonials } from './components/Testimonials'
import { Pricing } from './components/Pricing'
import { Boosts } from './components/Boosts'
import { FAQ } from './components/FAQ'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { SplashScreen } from './components/SplashScreen'
import { StickyPurchaseBar } from './components/signature/StickyPurchaseBar'
import { SiteAtmosphere } from './components/SiteAtmosphere'
import { ProofMarquee } from './components/ProofMarquee'
import { FinalCta } from './components/FinalCta'
import { DiscordOrb } from './components/DiscordOrb'
import { BackgroundMascot } from './components/BackgroundMascot'
import { OrderPage } from './components/OrderPage'
import { isOrderHash } from './lib/order'

function readIsOrder(): boolean {
  return typeof window !== 'undefined' && isOrderHash(window.location.hash)
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

  if (isOrder) {
    return (
      <div className="relative min-h-screen bg-bg text-text">
        <OrderPage />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-bg text-text grain">
      <SiteAtmosphere />
      {!showSplash ? <BackgroundMascot /> : null}
      {showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : null}
      <div className="relative z-10">
        <Navbar />
        <StickyPurchaseBar />
        <main className="pb-24">
          <Hero />
          <ProofMarquee />
          <HowItWorks />
          <Services />
          <CommandDeck />
          <Portfolio />
          <Testimonials />
          <Pricing />
          <Boosts />
          <FAQ />
          <Contact />
        </main>
        <FinalCta />
        <Footer />
      </div>
      {!showSplash ? <DiscordOrb /> : null}
    </div>
  )
}
