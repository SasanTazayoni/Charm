"use client";

import { useEffect, useRef, type ButtonHTMLAttributes } from "react";

type Variant = "gold" | "pink-outline";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: Variant;
};

const SQUARE_SIZE = 5;

const SQUARE_COLORS: Record<Variant, string> = {
  gold: "var(--brand-gold-dark)",
  "pink-outline": "rgba(242, 120, 161, 0.25)",
};

export default function CascadeButton({ children, className = "", variant, ...props }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const squareColor = SQUARE_COLORS[variant];
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;
    const cols = Math.ceil(buttonWidth / SQUARE_SIZE);
    const rows = Math.ceil(buttonHeight / SQUARE_SIZE);
    const total = rows * cols;

    if (total === 0) return;

    const revealed = new Uint8Array(total);
    const squares: HTMLDivElement[] = [];
    let isHovering = false;
    let frontier: number[] = [];
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const squaresContainer = document.createElement("div");
    squaresContainer.className = "squares-container";
    button.appendChild(squaresContainer);

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const square = document.createElement("div");
        square.className = "cascade-square";
        square.style.left = `${j * SQUARE_SIZE}px`;
        square.style.top = `${i * SQUARE_SIZE}px`;
        square.style.backgroundColor = squareColor;
        fragment.appendChild(square);
        squares.push(square);
      }
    }
    squaresContainer.appendChild(fragment);

    function getCursorCell(e: MouseEvent): [number, number] {
      const rect = button.getBoundingClientRect();
      const col = Math.max(0, Math.min(cols - 1, Math.floor((e.clientX - rect.left) / SQUARE_SIZE)));
      const row = Math.max(0, Math.min(rows - 1, Math.floor((e.clientY - rect.top) / SQUARE_SIZE)));
      return [row, col];
    }

    function startWave(row: number, col: number): void {
      const idx = row * cols + col;
      if (revealed[idx]) return;
      revealed[idx] = 1;
      squares[idx].style.opacity = "0";
      frontier.push(idx);
      if (!intervalId) intervalId = setInterval(processWave, 20);
    }

    function processWave(): void {
      if (frontier.length === 0) {
        clearInterval(intervalId!);
        intervalId = null;
        return;
      }
      const nextFrontier: number[] = [];
      for (const idx of frontier) {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const neighbors: [number, number][] = [
          [row - 1, col], [row + 1, col],
          [row, col - 1], [row, col + 1],
        ];
        for (const [nr, nc] of neighbors) {
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const nIdx = nr * cols + nc;
            if (!revealed[nIdx]) {
              revealed[nIdx] = 1;
              squares[nIdx].style.opacity = "0";
              nextFrontier.push(nIdx);
            }
          }
        }
      }
      frontier = nextFrontier;
    }

    function handleMouseEnter(e: Event): void {
      if (button.disabled) return;
      isHovering = true;
      const [row, col] = getCursorCell(e as MouseEvent);
      startWave(row, col);
    }

    function handleMouseMove(e: Event): void {
      if (!isHovering || button.disabled) return;
      const [row, col] = getCursorCell(e as MouseEvent);
      startWave(row, col);
    }

    function handleMouseLeave(): void {
      isHovering = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      frontier = [];
      for (let i = 0; i < total; i++) {
        if (revealed[i]) {
          squares[i].style.opacity = "1";
          revealed[i] = 0;
        }
      }
    }

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
      squaresContainer.remove();
    };
  }, [variant]);

  return (
    <button ref={buttonRef} className={`cascade-button ${className}`} {...props}>
      <span className="cascade-button-content">{children}</span>
    </button>
  );
}
