"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useScrollVisible from "@/hooks/useScrollVisible";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

export default function About() {
  const { language } = useLanguage();
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [certificateVisible, setCertificateVisible] = useState(false);

  const openCertificate = () => {
    setCertificateOpen(true);
    requestAnimationFrame(() => setCertificateVisible(true));
  };

  const closeCertificate = () => {
    setCertificateVisible(false);
    setTimeout(() => setCertificateOpen(false), 300);
  };
  const [sectionRef, visible] = useScrollVisible(0.15);

  return (
    <section id="about" ref={sectionRef} className={`about-section section-animate ${visible ? "section-visible" : ""}`}>

      <div className="about-header section-header">
        <h2 className="section-heading about-heading">{language === "English" ? "About" : "O nama"}</h2>
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
            {language === "English" ? (
              <>
                Hi, I am Mirjana — a nail artist based in Bijeljina, Bosnia &amp;
                Herzegovina. Nail art has always been a passion of mine, and I love
                using my creativity to bring each client's vision to life.
                With over four years of professional experience and a formally
                recognised qualification, I am committed to delivering the highest
                standard of work — as you can see in{" "}
                <button onClick={openCertificate} className="certificate-inline-link">
                  my certificate
                </button>
                .
              </>
            ) : (
              <>
                Zdravo, ja sam Mirjana — umjetnica nokta iz Bijeljine, Bosna i
                Hercegovina. Uljepšavanje nokta oduvijek je bila moja strast, i
                volim koristiti svoju kreativnost kako bih oživjela viziju svakog
                klijenta. Sa više od četiri godine profesionalnog iskustva i
                formalno priznatom kvalifikacijom, posvećena sam pružanju
                najvišeg standarda rada — kao što možete vidjeti u{" "}
                <button onClick={openCertificate} className="certificate-inline-link">
                  mom sertifikatu
                </button>
                .
              </>
            )}
          </p>
          <p className="about-text">
            {language === "English" ? (
              <>
                When I am not at the nail table, I am a proud mum to two
                beautiful girls. Family is everything to me, and I love nothing
                more than being there for them and taking care of the people I
                hold dear. That same warmth and attention carries into everything
                I do — I treat every client's nails as if they were my own.
              </>
            ) : (
              <>
                Kada nisam za stolom za nokte, ponosna sam mama dviju
                prelijepih djevojčica. Porodica mi je sve, i ništa me ne
                usrećuje više nego biti tu za njih i brinuti se o ljudima koji
                su mi dragi. Ta ista toplina i pažnja prenose se na sve što
                radim — prema noktima svakog klijenta odnosim se kao prema
                svojim vlastitim.
              </>
            )}
          </p>
          <p className="about-text">
            {language === "English" ? (
              <>
                Whether you are after a clean, classic look or something bold
                and creative, every set of nails tells a story. I take the time
                to understand what each client wants and put my heart into making
                it happen — because you deserve to leave feeling your best.
              </>
            ) : (
              <>
                Bilo da želite čist, klasičan izgled ili nešto smjelo i
                kreativno, svaki set nokta priča svoju priču. Uzimam si
                vremena da razumijem šta svaki klijent želi i ulažem srce u
                to da se to i ostvari — jer zaslužujete otići osjećajući se
                najbolje.
              </>
            )}
          </p>
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
            >
              <IoClose size={32} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/certificate.jpeg"
              alt={language === "English" ? "Professional Nail Technology Certificate" : "Sertifikat profesionalne tehnologije nokta"}
              className="certificate-modal-image"
            />
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
