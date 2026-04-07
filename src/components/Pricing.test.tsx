import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import Pricing from "./Pricing";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

describe("Pricing", () => {
  let mediaQueryHandler: (() => void) | null = null;
  let currentMatches = false;

  beforeEach(() => {
    mediaQueryHandler = null;
    currentMatches = false;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      get matches() { return currentMatches; },
      media: query,
      addEventListener: vi.fn((_event: string, cb: () => void) => {
        mediaQueryHandler = cb;
      }),
      removeEventListener: vi.fn(),
    }));
  });

  it("renders the large image by default", () => {
    const { container } = render(<LanguageProvider><Pricing /></LanguageProvider>);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/pricing.jpg");
  });

  it("renders the small image when screen is narrow", () => {
    currentMatches = true;
    const { container } = render(<LanguageProvider><Pricing /></LanguageProvider>);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/pricing-small.png");
  });

  it("switches to small image when media query changes to narrow", () => {
    const { container } = render(<LanguageProvider><Pricing /></LanguageProvider>);
    act(() => { currentMatches = true; mediaQueryHandler?.(); });
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/pricing-small.png");
  });
});
