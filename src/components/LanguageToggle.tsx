"use client";

import { RefreshCw } from "lucide-react";
import CascadeButton from "./CascadeButton";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

const OTHER: Record<Language, Language> = {
  English: "Serbian",
  Serbian: "English",
};

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-toggle">
      <p className="language-toggle-text">
        {tr.languageToggle.currentlyIn[language]}{" "}
        <span className="language-toggle-current">
          {tr.languageToggle.currentLanguage[language]}
        </span>
      </p>
      <CascadeButton
        variant="gold"
        className="gold-button language-toggle-button"
        onClick={() => setLanguage(OTHER[language])}
      >
        <RefreshCw size={13} />
        {tr.languageToggle.button[language]}
      </CascadeButton>
    </div>
  );
}
