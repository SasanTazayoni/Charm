"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="footer">
      <p className="footer-copyright">
        {language === "English" ? "© 2026 Charm. All rights reserved." : "© 2026 Charm. Sva prava zadržana."}
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
