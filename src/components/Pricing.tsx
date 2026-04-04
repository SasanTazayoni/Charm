"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GiFleurDeLys } from "react-icons/gi";

export default function Pricing() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className={`pricing-section ${visible ? "pricing-visible" : ""}`}>

      <div className="pricing-header">
        <h2 className="pricing-heading">Pricing</h2>
        <div className="pricing-divider">
          <div className="pricing-divider-line" />
          <GiFleurDeLys size={20} className="pricing-divider-icon" />
          <div className="pricing-divider-line" />
        </div>
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
