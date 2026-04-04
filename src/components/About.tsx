"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { GiFleurDeLys } from "react-icons/gi";

export default function About() {
  const [certificateOpen, setCertificateOpen] = useState(false);
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
    <section id="about" ref={sectionRef} className={`about-section ${visible ? "about-visible" : ""}`}>

      <div className="about-header">
        <h2 className="about-heading">About Me</h2>
        <div className="about-divider">
          <div className="about-divider-line" />
          <GiFleurDeLys size={20} className="about-divider-icon" />
          <div className="about-divider-line" />
        </div>
      </div>

      <div className="about-container">

        <div className="about-profile">
          <div className="about-image-wrapper">
            <Image
              src="/mirjana.jpg"
              alt="Mirjana Vuković Đorđić"
              fill
              className="about-image"
            />
          </div>
        </div>

        <div className="about-content">
          <p className="about-text">
            Hi, I am Mirjana — a nail artist based in Bijeljina, Bosnia &amp;
            Herzegovina. Nail art has always been a passion of mine, and I love
            using my creativity to bring each client's vision to life.
            With over four years of professional experience and a formally
            recognised qualification, I am committed to delivering the highest
            standard of work — as you can see in{" "}
            <button
              onClick={() => setCertificateOpen(true)}
              className="certificate-inline-link"
            >
              my certificate
            </button>
            .
          </p>
          <p className="about-text">
            When I am not at the nail table, I am a proud mum to two
            beautiful girls. Family is everything to me, and I love nothing
            more than being there for them and taking care of the people I
            hold dear. That same warmth and attention carries into everything
            I do — I treat every client's nails as if they were my own.
          </p>
          <p className="about-text">
            Whether you are after a clean, classic look or something bold
            and creative, every set of nails tells a story. I take the time
            to understand what each client wants and put my heart into making
            it happen — because you deserve to leave feeling your best.
          </p>
        </div>

      </div>

      {certificateOpen && createPortal(
        <div
          className="certificate-modal-backdrop"
          onClick={() => setCertificateOpen(false)}
        >
          <div
            className="certificate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="certificate-modal-close"
              onClick={() => setCertificateOpen(false)}
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/certificate.jpeg"
              alt="Professional Nail Technology Certificate"
              className="certificate-modal-image"
            />
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
