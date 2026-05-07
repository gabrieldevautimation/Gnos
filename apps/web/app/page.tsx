import { Hero }      from '@/components/sections/Hero'
import { Manifesto } from '@/components/sections/Manifesto'
import { Services }  from '@/components/sections/Services'
import { Process }   from '@/components/sections/Process'
import { Contact }   from '@/components/sections/Contact'
import { Footer }    from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <Process />
      <Contact />
      <Footer />
    </>
  )
}
