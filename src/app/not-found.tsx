import Link from "next/link";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CascadeButton from "@/components/CascadeButton";
import { LanguageProvider, type Language } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

export default async function NotFound() {
  const cookieStore = await cookies();
  const language = (cookieStore.get("language")?.value ??
    "English") as Language;

  return (
    <LanguageProvider initialLanguage={language}>
      <main className="not-found-page">
        <Navbar />
        <div className="not-found-body">
          <div className="not-found-content">
            <p className="not-found-code">{tr.notFound.code[language]}</p>
            <h1 className="not-found-heading">
              {tr.notFound.heading[language]}
            </h1>
            <p className="not-found-text">{tr.notFound.text[language]}</p>
            <Link href="/">
              <CascadeButton
                variant="gold"
                className="gold-button not-found-button"
              >
                {tr.notFound.button[language]}
              </CascadeButton>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    </LanguageProvider>
  );
}
