"use client";

import { useEffect, useState } from "react";
import useScrollVisible from "@/hooks/useScrollVisible";
import { createPortal } from "react-dom";
import Image from "next/image";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import { fetchWithRetry } from "@/lib/fetchWithRetry";
import { useModalState } from "@/hooks/useModalState";
import type { Photo } from "@/types/photo";

export default function Gallery() {
  const { language } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { isOpen: lightboxOpen, isVisible: lightboxVisible, open: openLightboxAnim, close: closeLightbox } = useModalState();
  const [sectionRef, visible] = useScrollVisible(0.1);

  useEffect(() => {
    fetchWithRetry(() => axios.get<Photo[]>("/api/photos", { timeout: 8000 }))
      .then((res) => setPhotos(res.data))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    openLightboxAnim();
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={`gallery-section section-animate ${visible ? "section-visible" : ""}`}
    >
      <div className="section-header">
        <h2 className="section-heading">{tr.gallery.heading[language]}</h2>
      </div>

      {loading ? (
        <div className="gallery-loading">
          <Loader2 size={60} className="gallery-spinner" />
        </div>
      ) : fetchError ? (
        <p className="gallery-empty">{tr.gallery.loadError[language]}</p>
      ) : photos.length === 0 ? (
        <p className="gallery-empty">{tr.gallery.empty[language]}</p>
      ) : (
        <>
          <div className="gallery-grid">
            {photos.map((photo) => (
              <div
                key={photo.url}
                className="gallery-item"
                onClick={() => openLightbox(photo)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(photo)}
                role="button"
                tabIndex={0}
                aria-label={tr.gallery.openPhotoLabel[language]}
              >
                <div className="gallery-item-inner">
                  <Image
                    src={photo.url}
                    alt={tr.gallery.photoAlt[language]}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="gallery-image"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="gallery-instagram">
            <a
              href="https://www.instagram.com/charm_bymirjana"
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-instagram-link"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <span className="gallery-instagram-text">
              {tr.gallery.instagramText[language]}
            </span>
          </div>
        </>
      )}

      {lightboxOpen &&
        createPortal(
          <div
            className={`lightbox-backdrop ${lightboxVisible ? "lightbox-backdrop-visible" : ""}`}
            onClick={closeLightbox}
            onKeyDown={(e) => e.key === "Escape" && closeLightbox()}
            role="presentation"
            tabIndex={-1}
          >
            <div
              className="lightbox-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={closeLightbox} aria-label={tr.gallery.closeLabel[language]}>
                <IoClose size={32} className="text-brand-gold" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto!.url}
                alt={tr.gallery.photoAlt[language]}
                className="lightbox-image"
              />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
