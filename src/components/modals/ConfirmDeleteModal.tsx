"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import CascadeButton from "@/components/CascadeButton";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

type Props = {
  isOpen: boolean;
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteModal({ isOpen, isVisible, onConfirm, onCancel }: Props) {
  const { language } = useLanguage();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`admin-confirm-backdrop ${isVisible ? "admin-confirm-backdrop-visible" : ""}`}
      onClick={onCancel}
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
    >
      <div className="admin-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-heading" onClick={(e) => e.stopPropagation()}>
        <p id="confirm-delete-heading" className="admin-confirm-text">{tr.admin.confirmDelete[language]}</p>
        <div className="admin-confirm-actions">
          <CascadeButton
            ref={cancelRef}
            variant="pink-outline"
            className="pink-outline-button admin-confirm-cancel"
            onClick={onCancel}
          >
            {tr.admin.cancel[language]}
          </CascadeButton>
          <CascadeButton
            variant="gold"
            className="gold-button admin-confirm-delete"
            onClick={onConfirm}
          >
            {tr.admin.delete[language]}
          </CascadeButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}
