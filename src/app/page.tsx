import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import LanguageToggle from "@/components/LanguageToggle";
import Divider from "@/components/Divider";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Home() {
  return (
    <LanguageProvider>
    <main>
      <Navbar />
      <div className="language-toggle-hero">
        <LanguageToggle />
      </div>
      <Hero />
      <About />
      <Divider />
      <Pricing />
      <Divider />
      <Gallery />
      <Divider />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
    </LanguageProvider>
  );
}
