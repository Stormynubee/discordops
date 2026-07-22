import { HowItWorks } from './HowItWorks'
import { Services } from './Services'
import { CommandDeck } from './signature/CommandDeck'
import { Portfolio } from './Portfolio'
import { Testimonials } from './Testimonials'
import { Pricing } from './Pricing'
import { Boosts } from './Boosts'
import { FAQ } from './FAQ'
import { Contact } from './Contact'
import { ProofMarquee } from './ProofMarquee'

/** Below-the-fold home sections — lazy-loaded as one chunk after Hero paints. */
export function HomeBelowFold() {
  return (
    <>
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
    </>
  )
}
