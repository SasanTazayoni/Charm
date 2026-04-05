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
import { fetchWithRetry } from "@/lib/fetchWithRetry";

type Photo = {
  url: string;
  pathname: string;
};

export default function Gallery() {
  const { language } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [sectionRef, visible] = useScrollVisible(0.1);

  useEffect(() => {
    fetchWithRetry(() => axios.get<Photo[]>("/api/photos", { timeout: 8000 }))
      .then((res) => setPhotos(res.data))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    requestAnimationFrame(() => setLightboxVisible(true));
  };

  const closeLightbox = () => {
    setLightboxVisible(false);
    setTimeout(() => setSelectedPhoto(null), 300);
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={`gallery-section section-animate ${visible ? "section-visible" : ""}`}
    >
      <div className="section-header">
        <h2 className="section-heading">{language === "English" ? "Gallery" : "Galerija"}</h2>
      </div>

      {loading ? (
        <div className="gallery-loading">
          <Loader2 size={60} className="gallery-spinner" />
        </div>
      ) : fetchError ? (
        <p className="gallery-empty">{language === "English" ? "Failed to load photos. Please refresh the page." : "Greška pri učitavanju fotografija. Osvježite stranicu."}</p>
      ) : photos.length === 0 ? (
        <p className="gallery-empty">{language === "English" ? "No photos yet." : "Još nema fotografija."}</p>
      ) : (
        <>
          <div className="gallery-grid">
            {photos.map((photo) => (
              <div
                key={photo.url}
                className="gallery-item"
                onClick={() => openLightbox(photo)}
              >
                <div className="gallery-item-inner">
                  <Image
                    src={photo.url}
                    alt={language === "English" ? "Charm nail art" : "Charm umjetnost nokta"}
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
            >
              <FaInstagram size={20} />
            </a>
            <span className="gallery-instagram-text">
              {language === "English" ? "Check out my Instagram to see more" : "Pogledajte moj Instagram za više"}
            </span>
          </div>
        </>
      )}

      {selectedPhoto &&
        createPortal(
          <div
            className={`lightbox-backdrop ${lightboxVisible ? "lightbox-backdrop-visible" : ""}`}
            onClick={closeLightbox}
          >
            <div
              className="lightbox-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={closeLightbox}>
                <IoClose size={32} color="var(--brand-gold)" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.url}
                alt="Charm nail art"
                className="lightbox-image"
              />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
