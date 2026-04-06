"use client";

import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

export default function Contact() {
  const { language } = useLanguage();

  return (
    <section
      id="contact"
      className="contact-section"
    >
      <div className="contact-inner">
        <div className="section-header">
          <h2 className="section-heading">{tr.contact.heading[language]}</h2>
        </div>
        <div className="contact-card">
          <Link
            href="https://wa.me/38766955693"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <FaWhatsapp size={28} />
            <span>+387 66 955 693</span>
          </Link>
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
