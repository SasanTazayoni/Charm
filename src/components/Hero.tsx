"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { GiFleurDeLys } from "react-icons/gi";

const VIDEOS = [
  "https://res.cloudinary.com/dfpneqsxy/video/upload/v1775236747/Charm/hero-video1_ufotyn.mp4",
  "https://res.cloudinary.com/dfpneqsxy/video/upload/v1775236738/Charm/hero-video2_xkcmhn.mp4",
  "https://res.cloudinary.com/dfpneqsxy/video/upload/v1775236741/Charm/hero-video3_bt3ffi.mp4",
];

const FADE_DURATION = 2000;
const FADE_OFFSET = 2.5;
const OVERLAY_DELAY = 5000;

export default function Hero() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(
    Array(VIDEOS.length).fill(null),
  );
  const [opacities, setOpacities] = useState<number[]>(
    VIDEOS.map((_, videoIndex) => (videoIndex === 0 ? 1 : 0)),
  );
  const [overlayVisible, setOverlayVisible] = useState(false);
  const activeIndexRef = useRef(0);
  const fadingRef = useRef(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    videoRefs.current[0]?.play().catch(() => {});
    const overlayTimer = setTimeout(
      () => setOverlayVisible(true),
      OVERLAY_DELAY,
    );

    return () => {
      clearTimeout(overlayTimer);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      videoRefs.current[0]?.pause();
    };
  }, []);

  const handleTimeUpdate = useCallback((index: number) => {
    if (index !== activeIndexRef.current || fadingRef.current) return;
    const video = videoRefs.current[index];
    if (!video || !isFinite(video.duration)) return;
    if (video.duration - video.currentTime > FADE_OFFSET) return;

    fadingRef.current = true;
    const nextIndex = (index + 1) % VIDEOS.length;

    const nextVideo = videoRefs.current[nextIndex];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }

    setOpacities((currentOpacities) => {
      const updatedOpacities = [...currentOpacities];
      updatedOpacities[index] = 0;
      updatedOpacities[nextIndex] = 1;
      return updatedOpacities;
    });

    fadeTimeoutRef.current = setTimeout(() => {
      activeIndexRef.current = nextIndex;
      fadingRef.current = false;
    }, FADE_DURATION);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {VIDEOS.map((videoSrc, videoIndex) => (
        <video
          key={videoSrc}
          ref={(videoElement) => {
            videoRefs.current[videoIndex] = videoElement;
          }}
          src={videoSrc}
          muted
          playsInline
          preload={videoIndex === 0 ? "auto" : "none"}
          onTimeUpdate={() => handleTimeUpdate(videoIndex)}
          style={{
            opacity: opacities[videoIndex],
            transition: `opacity ${FADE_DURATION}ms ease-in-out`,
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}

      <div
        style={{ opacity: overlayVisible ? 1 : 0 }}
        className="hero-overlay absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center px-6 text-brand-pink">
          <p className="text-2xl font-semibold tracking-[0.3em] uppercase mb-2">
            Professional Nail Artist
          </p>
          <h1 className="text-7xl font-bold tracking-wide mb-2">Charm</h1>
          <p className="text-3xl font-light tracking-widest mb-8">
            Mirjana Vuković Đorđić
          </p>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-20 h-px bg-brand-pink" />
            <GiFleurDeLys size={24} className="text-brand-pink" />
            <div className="w-20 h-px bg-brand-pink" />
          </div>
          <div className="flex items-center justify-center gap-8">
            <a
              href="https://wa.me/38766955693"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <FaWhatsapp size={40} />
            </a>
            <a
              href="https://www.instagram.com/charm_bymirjana"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <FaInstagram size={40} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
