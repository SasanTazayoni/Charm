"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import useScrollVisible from "@/hooks/useScrollVisible";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

export default function Pricing() {
  const [sectionRef, visible] = useScrollVisible(0.15);
  const { language } = useLanguage();
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 428px)");
    setIsSmall(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const src = isSmall
    ? tr.pricing.imageSrcSmall[language]
    : tr.pricing.imageSrcLarge[language];

  return (
    <section id="pricing" ref={sectionRef} className={`pricing-section section-animate ${visible ? "section-visible" : ""}`}>

      <div className="section-header">
        <h2 className="section-heading pricing-heading">{tr.pricing.heading[language]}</h2>
      </div>

      <div className={`pricing-card ${isSmall ? "pricing-card-small" : ""}`}>
        <Image
          src={src}
          alt={tr.pricing.imageAlt[language]}
          width={480}
          height={600}
          className="pricing-image"
        />
      </div>

    </section>
  );
}
