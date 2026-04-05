import { useCallback, useEffect, useRef, useState } from "react";

export function useModalState() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    timerRef.current = setTimeout(() => setIsOpen(false), 300);
  }, []);

  return { isOpen, isVisible, open, close };
}
