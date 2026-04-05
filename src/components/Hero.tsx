"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import Divider from "@/components/Divider";

const VIDEOS = [
  "https://res.cloudinary.com/dfpneqsxy/video/upload/v1775236747/Charm/hero-video1_ufotyn.mp4",
  "https://res.cloudinary.com/dfpneqsxy/video/upload/v1775236738/Charm/hero-video2_xkcmhn.mp4",
  "https://res.cloudinary.com/dfpneqsxy/video/upload/v1775236741/Charm/hero-video3_bt3ffi.mp4",
];

const FADE_DURATION = 2000;
const FADE_OFFSET = 2.5;

export default function Hero() {
  const { language } = useLanguage();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(
    Array(VIDEOS.length).fill(null),
  );
  const [opacities, setOpacities] = useState<number[]>(
    VIDEOS.map((_, videoIndex) => (videoIndex === 0 ? 1 : 0)),
  );
  const activeIndexRef = useRef(0);
  const fadingRef = useRef(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    videoRefs.current[0]?.play().catch(() => {});

    return () => {
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

      <div className="hero-overlay absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6 text-brand-pink">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold tracking-[0.3em] uppercase mb-2">
            {language === "English"
              ? "Professional Nail Artist"
              : "Profesionalni umjetnik nokta"}
          </p>
          <h1 className="text-[48px] sm:text-[60px] md:text-7xl font-bold tracking-wide mb-2">
            Charm
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-light tracking-widest mb-8">
            Mirjana Vuković Đorđić
          </p>
          <div className="mb-5 md:mb-8">
            <Divider />
          </div>
          <div className="hero-social-icons flex items-center justify-center gap-6 md:gap-8">
            <a
              href="https://wa.me/38766955693"
              target="_blank"
              rel="noopener noreferrer"
              className="brand-link"
            >
              <FaWhatsapp size={40} />
            </a>
            <a
              href="https://www.instagram.com/charm_bymirjana"
              target="_blank"
              rel="noopener noreferrer"
              className="brand-link"
            >
              <FaInstagram size={40} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
