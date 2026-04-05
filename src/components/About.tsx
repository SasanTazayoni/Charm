"use client";

import { useState } from "react";
import useScrollVisible from "@/hooks/useScrollVisible";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

export default function About() {
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
        <h2 className="section-heading about-heading">About</h2>
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
            Hi, I am Mirjana — a nail artist based in Bijeljina, Bosnia &amp;
            Herzegovina. Nail art has always been a passion of mine, and I love
            using my creativity to bring each client's vision to life.
            With over four years of professional experience and a formally
            recognised qualification, I am committed to delivering the highest
            standard of work — as you can see in{" "}
            <button
              onClick={openCertificate}
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
