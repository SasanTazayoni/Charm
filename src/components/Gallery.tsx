"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FaInstagram } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import { fetchWithRetry } from "@/lib/fetchWithRetry";
import { useModalState } from "@/hooks/useModalState";
import { INSTAGRAM_URL } from "@/constants/contact";
import LightboxModal from "@/components/modals/LightboxModal";
import type { Photo } from "@/types/photo";

export default function Gallery() {
  const { language } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { isOpen: lightboxOpen, isVisible: lightboxVisible, open: openLightboxModal, close: closeLightbox } = useModalState();

  useEffect(() => {
    fetchWithRetry(() => axios.get<Photo[]>("/api/photos", { timeout: 8000 }))
      .then((photosResponse) => setPhotos(photosResponse.data))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const openLightbox = (photo: Photo) => {
    if (window.innerWidth <= 324) return;
    setSelectedPhoto(photo);
    openLightboxModal();
  };

  return (
    <section
      id="gallery"
      className="gallery-section"
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
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-instagram-link"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <span className="gallery-instagram-text">
              {tr.gallery.instagramText[language]}
            </span>
          </div>
        </>
      )}

      <LightboxModal isOpen={lightboxOpen} isVisible={lightboxVisible} onClose={closeLightbox} photo={selectedPhoto} />
    </section>
  );
}
