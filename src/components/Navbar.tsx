"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const NAV_LINKS = ["About", "Pricing", "Gallery", "Contact"];

const NAV_LABELS: Record<string, { English: string; Serbian: string }> = {
  About:   { English: "About",   Serbian: "O nama"     },
  Pricing: { English: "Pricing", Serbian: "Cjenovnik"  },
  Gallery: { English: "Gallery", Serbian: "Galerija"   },
  Contact: { English: "Contact", Serbian: "Kontakt"    },
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("");
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          } else {
            setActiveSection((current) =>
              current === entry.target.id ? "" : current
            );
          }
        });
      },
      { threshold: 0.2 }
    );

    NAV_LINKS.forEach((link) => {
      const section = document.getElementById(link.toLowerCase());
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav className="navbar bg-brand-green/40 backdrop-blur-sm">
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
              {NAV_LABELS[link][language]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
