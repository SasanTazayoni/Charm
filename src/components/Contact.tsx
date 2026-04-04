"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`contact-section ${visible ? "contact-visible" : ""}`}
    >
      <div className="contact-card">
        <h2 className="contact-heading">Get in Touch</h2>
        <p className="contact-subtext">Book an appointment or send a message</p>

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
    </section>
  );
}
