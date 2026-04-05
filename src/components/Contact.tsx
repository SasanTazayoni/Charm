"use client";

import useScrollVisible from "@/hooks/useScrollVisible";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const [sectionRef, visible] = useScrollVisible(0.2);
  const { language } = useLanguage();

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`contact-section section-animate ${visible ? "section-visible" : ""}`}
    >
      <div className="contact-inner">
        <div className="section-header">
          <h2 className="section-heading">{language === "English" ? "Contact" : "Kontakt"}</h2>
        </div>
        <div className="contact-card">
<div className="contact-links">
            <Link
              href="https://wa.me/38766955693"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <FaWhatsapp size={28} />
              <span>+387 66 955 693</span>
            </Link>
          </div>
          <Image
            src="/logo.png"
            alt="Charm"
            width={160}
            height={160}
            className="contact-logo"
          />
        </div>
      </div>
    </section>
  );
}
