"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/constants/contact";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import Divider from "@/components/Divider";

const VIDEOS = [
  "https://res.cloudinary.com/dfpneqsxy/video/upload/v1775236738/Charm/hero-video2_xkcmhn.mp4",
  "https://res.cloudinary.com/dfpneqsxy/video/upload/v1775236741/Charm/hero-video3_bt3ffi.mp4",
];

const FADE_DURATION = 2000;
const DISPLAY_DURATION = 10000;

export default function Hero() {
  const { language } = useLanguage();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(
    Array(VIDEOS.length).fill(null),
  );
  const [opacities, setOpacities] = useState<number[]>(
    VIDEOS.map((_, i) => (i === 0 ? 1 : 0)),
  );
  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startDisplayTimer = useCallback((index: number) => {
    if (displayTimerRef.current) clearTimeout(displayTimerRef.current);

    displayTimerRef.current = setTimeout(() => {
      const nextIndex = (index + 1) % VIDEOS.length;

      const nextVideo = videoRefs.current[nextIndex]!;
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});

      setOpacities((prev) => {
        const updated = [...prev];
        updated[index] = 0;
        updated[nextIndex] = 1;
        return updated;
      });

      fadeTimerRef.current = setTimeout(() => {
        videoRefs.current[index]?.pause();
        startDisplayTimer(nextIndex);
      }, FADE_DURATION);
    }, DISPLAY_DURATION - FADE_DURATION);
  }, []);

  useEffect(() => {
    videoRefs.current[0]?.play().catch(() => {});
    startDisplayTimer(0);

    return () => {
      clearTimeout(displayTimerRef.current!);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      videoRefs.current.forEach((v) => v?.pause());
    };
  }, [startDisplayTimer]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {VIDEOS.map((videoSrc, videoIndex) => (
        <video
          key={videoSrc}
          ref={(el) => {
            videoRefs.current[videoIndex] = el;
          }}
          src={videoSrc}
          muted
          playsInline
          loop
          preload={videoIndex === 0 ? "auto" : "none"}
          style={{
            opacity: opacities[videoIndex],
            transition: `opacity ${FADE_DURATION}ms ease-in-out`,
          }}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}

      <div className="hero-overlay absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6 text-brand-pink">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold tracking-[0.3em] uppercase mb-2">
            {tr.hero.subtitle[language]}
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
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-link"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={40} />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-link"
              aria-label="Instagram"
            >
              <FaInstagram size={40} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
