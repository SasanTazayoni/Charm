import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import ScrollToTop from "@/components/ScrollToTop";
import Divider from "@/components/Divider";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Divider />
      <Pricing />
      <Divider />
      <Gallery />
      <Divider />
      <Contact />
      <ScrollToTop />
    </main>
  );
}
