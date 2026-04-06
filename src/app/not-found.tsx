import Link from "next/link";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CascadeButton from "@/components/CascadeButton";
import { LanguageProvider, type Language } from "@/context/LanguageContext";

export default async function NotFound() {
  const cookieStore = await cookies();
  const language = (cookieStore.get("language")?.value ?? "English") as Language;
  const isSerbian = language === "Serbian";

  return (
    <LanguageProvider initialLanguage={language}>
      <main style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "8rem", fontWeight: 300, color: "var(--brand-gold)", letterSpacing: "0.1em", lineHeight: 1, opacity: 0.6, margin: 0 }}>
              404
            </p>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 300, color: "var(--brand-pink)", letterSpacing: "0.05em", margin: 0 }}>
              {isSerbian ? "Stranica nije pronađena" : "Page Not Found"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", letterSpacing: "0.03em", margin: 0 }}>
              {isSerbian ? "Ova stranica ne postoji — ali lijepi nokti postoje." : "This page doesn't exist — but great nails do."}
            </p>
            <Link href="/">
              <CascadeButton variant="gold" className="gold-button" style={{ padding: "0.75rem 2rem" }}>
                {isSerbian ? "Nazad na početnu" : "Back to Home"}
              </CascadeButton>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    </LanguageProvider>
  );
}
