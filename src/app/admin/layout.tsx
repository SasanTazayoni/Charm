import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LanguageProvider, type Language } from "@/context/LanguageContext";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const language = (cookieStore.get("language")?.value ?? "English") as Language;

  return <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>;
}
