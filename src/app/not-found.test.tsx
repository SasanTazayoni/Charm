import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => cb(0));

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  constructor() {}
}
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/components/CascadeButton", () => ({
  default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant: string }) => (
    <button {...props}>{children}</button>
  ),
}));

const mockGetCookie = vi.fn().mockReturnValue(undefined);
vi.mock("cookies-next", () => ({
  getCookie: () => mockGetCookie(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

beforeEach(() => {
  mockGetCookie.mockReturnValue(undefined);
});

function mockCookies(language?: string) {
  vi.mocked(cookies).mockResolvedValue({
    get: (key: string) => (key === "language" && language ? { value: language } : undefined),
  } as never);
}

describe("NotFound", () => {
  describe("English", () => {
    beforeEach(() => mockCookies());

    it("renders 404", async () => {
      render(await NotFound());
      expect(screen.getByText("404")).toBeTruthy();
    });

    it("renders English heading", async () => {
      render(await NotFound());
      expect(screen.getByText("Page Not Found")).toBeTruthy();
    });

    it("renders English subtext", async () => {
      render(await NotFound());
      expect(screen.getByText(/This page doesn't exist/)).toBeTruthy();
    });

    it("renders English button", async () => {
      render(await NotFound());
      expect(screen.getByText("Back to Home")).toBeTruthy();
    });
  });

  describe("Serbian", () => {
    beforeEach(() => mockCookies("Serbian"));

    it("renders Serbian heading", async () => {
      render(await NotFound());
      expect(screen.getByText("Stranica nije pronađena")).toBeTruthy();
    });

    it("renders Serbian subtext", async () => {
      render(await NotFound());
      expect(screen.getByText(/Ova stranica ne postoji/)).toBeTruthy();
    });

    it("renders Serbian button", async () => {
      render(await NotFound());
      expect(screen.getByText("Nazad na početnu")).toBeTruthy();
    });
  });
});
