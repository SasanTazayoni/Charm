"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

const SMALL_BREAKPOINT = "(max-width: 428px)";

export default function Pricing() {
  const { language } = useLanguage();
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(SMALL_BREAKPOINT);
    setIsSmall(mq.matches);
    const handler = () => setIsSmall(window.matchMedia(SMALL_BREAKPOINT).matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const pricingImageSrc = isSmall
    ? tr.pricing.imageSrcSmall[language]
    : tr.pricing.imageSrcLarge[language];

  return (
    <section id="pricing" className="pricing-section">

      <div className="section-header">
        <h2 className="section-heading pricing-heading">{tr.pricing.heading[language]}</h2>
      </div>

      <div className={`pricing-card ${isSmall ? "pricing-card-small" : ""}`}>
        <Image
          src={pricingImageSrc}
          alt={tr.pricing.imageAlt[language]}
          width={480}
          height={600}
          className="pricing-image"
        />
      </div>

    </section>
  );
}
