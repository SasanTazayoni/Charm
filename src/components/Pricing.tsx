"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

const SMALL_BREAKPOINT = "(max-width: 428px)";

export default function Pricing() {
  const { language } = useLanguage();
  const isSmall = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(SMALL_BREAKPOINT);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(SMALL_BREAKPOINT).matches,
    () => false,
  );

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
