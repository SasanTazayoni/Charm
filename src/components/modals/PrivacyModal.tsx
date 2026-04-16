"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import CascadeButton from "@/components/CascadeButton";

type Props = {
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
};

export default function PrivacyModal({ isOpen, isVisible, onClose }: Props) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className={`privacy-modal-backdrop ${isVisible ? "privacy-modal-backdrop-visible" : ""}`}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="privacy-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="privacy-modal-heading" className="privacy-modal-heading">{tr.footer.privacyHeading[language]}</h2>
        {tr.footer.privacyBody[language].split("\n\n").map((para, i) => (
          <p key={i} className="privacy-modal-text">{para}</p>
        ))}
        <CascadeButton variant="pink-outline" className="pink-outline-button privacy-modal-close" onClick={onClose}>
          {tr.footer.privacyClose[language]}
        </CascadeButton>
      </div>
    </div>
  );
}
