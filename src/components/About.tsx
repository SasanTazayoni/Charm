"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import useScrollVisible from "@/hooks/useScrollVisible";
import { useModalState } from "@/hooks/useModalState";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

export default function About() {
  const { language } = useLanguage();
  const { isOpen: certificateOpen, isVisible: certificateVisible, open: openCertificate, close: closeCertificate } = useModalState();
  const [sectionRef, visible] = useScrollVisible(0.15);

  return (
    <section id="about" ref={sectionRef} className={`about-section section-animate ${visible ? "section-visible" : ""}`}>

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
              sizes="(max-width: 768px) 100vw, 25vw"
              className="about-image"
            />
          </div>
        </div>

        <div className="about-content">
          <p className="about-text">
            {tr.about.para1Prefix[language]}
            <button onClick={openCertificate} className="certificate-inline-link">
              {tr.about.para1LinkText[language]}
            </button>
            .
          </p>
          <p className="about-text">{tr.about.para2[language]}</p>
          <p className="about-text">{tr.about.para3[language]}</p>
        </div>

      </div>

      {certificateOpen && createPortal(
        <div
          className={`certificate-modal-backdrop ${certificateVisible ? "certificate-modal-backdrop-visible" : ""}`}
          onClick={closeCertificate}
        >
          <div
            className="certificate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="certificate-modal-close"
              onClick={closeCertificate}
              aria-label={tr.about.closeLabel[language]}
            >
              <IoClose size={32} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/certificate.jpeg"
              alt={tr.about.certAlt[language]}
              className="certificate-modal-image"
            />
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
