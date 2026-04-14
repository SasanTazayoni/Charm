"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import { useModalState } from "@/hooks/useModalState";
import CertificateModal from "@/components/modals/CertificateModal";

export default function About() {
  const { language } = useLanguage();
  const { isOpen, isVisible, open, close } = useModalState();

  return (
    <section id="about" className="about-section">

      <div className="section-header">
        <h2 className="section-heading about-heading">{tr.about.heading[language]}</h2>
      </div>

      <div className="about-container">

        <div className="about-profile">
          <div className="about-image-wrapper">
            <Image
              src="/mirjana.jpg"
              alt="Mirjana Vuković Đorđić"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 380px"
              className="about-image"
            />
          </div>
        </div>

        <div className="about-content">
          <p className="about-text">
            {tr.about.para1Prefix[language]}
            <button onClick={open} className="certificate-inline-link">
              {tr.about.para1LinkText[language]}
            </button>
            .
          </p>
          <p className="about-text">{tr.about.para2[language]}</p>
          <p className="about-text">{tr.about.para3[language]}</p>
        </div>

      </div>

      <CertificateModal isOpen={isOpen} isVisible={isVisible} onClose={close} />

    </section>
  );
}
