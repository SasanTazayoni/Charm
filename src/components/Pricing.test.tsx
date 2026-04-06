import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import Pricing from "./Pricing";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

describe("Pricing", () => {
  let mediaQueryHandler: ((e: { matches: boolean }) => void) | null = null;

  beforeEach(() => {
    mediaQueryHandler = null;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((_event: string, cb: (e: { matches: boolean }) => void) => {
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
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { container } = render(<LanguageProvider><Pricing /></LanguageProvider>);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/pricing-small.png");
  });

  it("switches to small image when media query changes to narrow", () => {
    const { container } = render(<LanguageProvider><Pricing /></LanguageProvider>);
    act(() => { mediaQueryHandler?.({ matches: true }); });
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/pricing-small.png");
  });
});
