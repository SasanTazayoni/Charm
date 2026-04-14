"use client";

import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

type Props = {
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
};

export default function CertificateModal({ isOpen, isVisible, onClose }: Props) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`certificate-modal-backdrop ${isVisible ? "certificate-modal-backdrop-visible" : ""}`}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      tabIndex={-1}
    >
      <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="certificate-modal-close"
          onClick={onClose}
          aria-label={tr.about.closeLabel[language]}
        >
          <IoClose size={32} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/certificate.jpeg"
          alt={tr.about.certAlt[language]}
          className="certificate-modal-image"
        />
      </div>
    </div>,
    document.body,
  );
}
