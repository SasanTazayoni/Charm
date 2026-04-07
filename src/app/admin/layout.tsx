import { cookies } from "next/headers";
import { LanguageProvider, type Language } from "@/context/LanguageContext";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const language = (cookieStore.get("language")?.value ?? "English") as Language;

  return <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>;
}
