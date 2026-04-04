"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";

type Photo = {
  url: string;
  pathname: string;
};

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    axios.get<Photo[]>("/api/photos").then((res) => setPhotos(res.data));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
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
    <section id="gallery" ref={sectionRef} className={`gallery-section ${visible ? "gallery-visible" : ""}`}>

      <div className="gallery-header">
        <h2 className="gallery-heading">Gallery</h2>
      </div>

      {photos.length === 0 ? (
        <p className="gallery-empty">No photos yet.</p>
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
                    alt={photo.pathname}
                    fill
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
            <span className="gallery-instagram-text">Check out my Instagram to see more</span>
          </div>
        </>
      )}

      {selectedPhoto && createPortal(
        <div
          className={`lightbox-backdrop ${lightboxVisible ? "lightbox-backdrop-visible" : ""}`}
          onClick={closeLightbox}
        >
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <IoClose size={32} color="var(--brand-gold)" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.pathname}
              className="lightbox-image"
            />
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
