"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setVisible(true);
      } else {
        setPulsing(false);
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(false)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const btn = buttonRef.current!;
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "opacity" && visible) setPulsing(true);
    };
    btn.addEventListener("transitionend", onTransitionEnd);
    return () => btn.removeEventListener("transitionend", onTransitionEnd);
  }, [visible]);

  return (
    <button
      ref={buttonRef}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
          "scroll-to-top",
          visible && "scroll-to-top-visible",
          pulsing && "scroll-to-top-pulsing",
        ]
          .filter(Boolean)
          .join(" ")}
      aria-label="Scroll to top"
      aria-hidden={!visible}
    >
      <FaArrowUp size={20} />
    </button>
  );
}
