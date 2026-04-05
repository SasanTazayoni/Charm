"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

const NAV_LINKS = ["About", "Pricing", "Gallery", "Contact"] as const;

const NAV_LABELS = {
  About:   tr.navbar.about,
  Pricing: tr.navbar.pricing,
  Gallery: tr.navbar.gallery,
  Contact: tr.navbar.contact,
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openMenu = () => {
    setMenuOpen(true);
    requestAnimationFrame(() => setMenuVisible(true));
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setMenuOpen(false), 300);
  };
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) closeMenu();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      { threshold: 0, rootMargin: "-30% 0px -30% 0px" }
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
    <>
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

        <button
          className="navbar-hamburger"
          onClick={() => menuOpen ? closeMenu() : openMenu()}
          aria-label="Toggle menu"
        >
          {menuOpen ? <IoClose size={28} /> : <RxHamburgerMenu size={28} />}
        </button>

        {menuOpen && (
          <ul className={`navbar-mobile-menu ${menuVisible ? "navbar-mobile-menu-open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <Link
                  href={`#${link.toLowerCase()}`}
                  className={`nav-link ${activeSection === link.toLowerCase() ? "nav-link-active" : ""}`}
                  onClick={closeMenu}
                >
                  {NAV_LABELS[link][language]}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {mounted && createPortal(
        <div
          className={`navbar-mobile-backdrop ${menuVisible ? "navbar-mobile-backdrop-visible" : ""}`}
          onClick={closeMenu}
        />,
        document.body
      )}
    </>
  );
}
