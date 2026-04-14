"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import type { Photo } from "@/types/photo";

type Props = {
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
  photo: Photo | null;
};

export default function LightboxModal({ isOpen, isVisible, onClose, photo }: Props) {
  const { language } = useLanguage();
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) backdropRef.current?.focus();
  }, [isOpen]);

  if (!isOpen || !photo) return null;

  return createPortal(
    <div
      ref={backdropRef}
      className={`lightbox-backdrop ${isVisible ? "lightbox-backdrop-visible" : ""}`}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      tabIndex={-1}
    >
      <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label={tr.gallery.closeLabel[language]}>
          <IoClose size={32} className="text-brand-gold" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={tr.gallery.photoAlt[language]}
          className="lightbox-image"
        />
      </div>
    </div>,
    document.body,
  );
}
