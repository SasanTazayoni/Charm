"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

export default function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="footer">
      <p className="footer-copyright">
        {tr.footer.copyright[language]}
        <Link
          href="https://github.com/SasanTazayoni/Charm"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github"
        >
          <FaGithub size={18} />
        </Link>
      </p>
    </footer>
  );
}
