"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import { useModalState } from "@/hooks/useModalState";
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
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const { isOpen: isMenuOpen, isVisible: isMenuVisible, open: openMenu, close: closeMenu } = useModalState();
  const { language } = useLanguage();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) closeMenu();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeMenu]);

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
          <Image src="/logo.png" alt="Charm" width={60} height={60} priority />
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
          onClick={() => isMenuOpen ? closeMenu() : openMenu()}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <IoClose size={28} /> : <RxHamburgerMenu size={28} />}
        </button>

        {isMenuOpen && (
          <ul className={`navbar-mobile-menu ${isMenuVisible ? "navbar-mobile-menu-open" : ""}`}>
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
          className={`navbar-mobile-backdrop ${isMenuVisible ? "navbar-mobile-backdrop-visible" : ""}`}
          onClick={closeMenu}
        />,
        document.body
      )}
    </>
  );
}
