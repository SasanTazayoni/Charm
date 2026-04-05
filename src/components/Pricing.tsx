"use client";

import Image from "next/image";
import useScrollVisible from "@/hooks/useScrollVisible";
import { useLanguage } from "@/context/LanguageContext";

export default function Pricing() {
  const [sectionRef, visible] = useScrollVisible(0.15);
  const { language } = useLanguage();

  return (
    <section id="pricing" ref={sectionRef} className={`pricing-section section-animate ${visible ? "section-visible" : ""}`}>

      <div className="pricing-header section-header">
        <h2 className="section-heading pricing-heading">{language === "English" ? "Pricing" : "Cjenovnik"}</h2>
      </div>

      <div className="pricing-card">
        <Image
          src={language === "English" ? "/pricing.jpg" : "/pricing-serbian.jpg"}
          alt="Charm Price List"
          width={480}
          height={600}
          className="pricing-image"
        />
      </div>

    </section>
  );
}
