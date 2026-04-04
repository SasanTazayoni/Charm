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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
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
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
