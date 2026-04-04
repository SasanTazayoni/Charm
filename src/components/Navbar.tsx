"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = ["About", "Pricing", "Gallery", "Contact"];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll);

    const observers: IntersectionObserver[] = [];

    NAV_LINKS.forEach((link) => {
      const section = document.getElementById(link.toLowerCase());
      if (!section) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(link.toLowerCase());
          } else {
            setActiveSection((current) =>
              current === link.toLowerCase() ? "" : current
            );
          }
        },
        { threshold: 0.4 }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Image src="/logo.png" alt="Charm" width={60} height={60} />
        <span className="navbar-brand">Charm</span>
      </div>
      <ul className="navbar-links">
        {NAV_LINKS.map((link) => (
          <li key={link}>
            <Link
              href={`#${link.toLowerCase()}`}
              className={`nav-link ${activeSection === link.toLowerCase() ? "nav-link-active" : ""}`}
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
