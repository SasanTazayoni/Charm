import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Pricing from '@/components/Pricing'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Pricing />
      <ScrollToTop />
    </main>
  )
}
