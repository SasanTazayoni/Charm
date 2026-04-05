"use client";

import { RefreshCw } from "lucide-react";
import CascadeButton from "./CascadeButton";
import { useLanguage, type Language } from "@/context/LanguageContext";

const OTHER: Record<Language, Language> = {
  English: "Serbian",
  Serbian: "English",
};

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-toggle">
      <p className="language-toggle-text">
        {language === "English" ? "Currently in" : "Trenutno na"}{" "}
        <span className="language-toggle-current">
          {language === "English" ? "English" : "Srpskom"}
        </span>
      </p>
      <CascadeButton
        variant="gold"
        className="gold-button language-toggle-button"
        onClick={() => setLanguage(OTHER[language])}
      >
        <RefreshCw size={13} />
        {language === "English" ? "Language" : "Jezik"}
      </CascadeButton>
    </div>
  );
}
