"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import { useModalState } from "@/hooks/useModalState";
import PrivacyModal from "@/components/modals/PrivacyModal";

export default function Footer() {
  const { language } = useLanguage();
  const { isOpen, isVisible, open, close } = useModalState();

  return (
    <>
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
        <button className="footer-privacy-link" onClick={open}>
          {tr.footer.privacyLink[language]}
        </button>
      </footer>

      <PrivacyModal isOpen={isOpen} isVisible={isVisible} onClose={close} />
    </>
  );
}
