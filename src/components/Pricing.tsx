"use client";

import Image from "next/image";
import useScrollVisible from "@/hooks/useScrollVisible";

export default function Pricing() {
  const [sectionRef, visible] = useScrollVisible(0.15);

  return (
    <section id="pricing" ref={sectionRef} className={`pricing-section section-animate ${visible ? "section-visible" : ""}`}>

      <div className="pricing-header section-header">
        <h2 className="section-heading pricing-heading">Pricing</h2>
      </div>

      <div className="pricing-card">
        <Image
          src="/pricing.jpg"
          alt="Charm Price List"
          width={480}
          height={600}
          className="pricing-image"
        />
      </div>

    </section>
  );
}
