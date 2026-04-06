import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Navbar from "./Navbar";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

describe("Navbar", () => {
  let intersectionCallback: IntersectionObserverCallback | null = null;
  let mockObserver: { observe: ReturnType<typeof vi.fn> } | null = null;

  beforeEach(() => {
    intersectionCallback = null;
    mockObserver = null;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => cb(0));
    class MockIntersectionObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
        mockObserver = this as unknown as { observe: ReturnType<typeof vi.fn> };
      }
    }
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  it("renders all nav links", () => {
    render(<LanguageProvider><Navbar /></LanguageProvider>);
    expect(screen.getByText("About")).toBeTruthy();
    expect(screen.getByText("Pricing")).toBeTruthy();
    expect(screen.getByText("Gallery")).toBeTruthy();
    expect(screen.getByText("Contact")).toBeTruthy();
  });

  it("renders the hamburger menu button", () => {
    render(<LanguageProvider><Navbar /></LanguageProvider>);
    expect(screen.getByRole("button", { name: /toggle menu/i })).toBeTruthy();
  });

  it("opens mobile menu when hamburger is clicked", () => {
    const { container } = render(<LanguageProvider><Navbar /></LanguageProvider>);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(container.querySelector(".navbar-mobile-menu")).toBeTruthy();
  });

  it("clears active section when scrollY is below 100", () => {
    render(<LanguageProvider><Navbar /></LanguageProvider>);
    Object.defineProperty(window, "scrollY", { value: 50, writable: true, configurable: true });
    fireEvent.scroll(window);
    expect(document.querySelectorAll(".nav-link-active")).toHaveLength(0);
  });

  it("sets active section when a nav section intersects", async () => {
    const { container } = render(<LanguageProvider><Navbar /></LanguageProvider>);
    await waitFor(() => expect(intersectionCallback).not.toBeNull());
    act(() => {
      intersectionCallback?.([{ isIntersecting: true, target: { id: "about" } }] as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    });
    expect(container.querySelector(".nav-link-active")?.getAttribute("href")).toBe("#about");
  });

  it("clears active section when intersecting section leaves viewport", async () => {
    const { container } = render(<LanguageProvider><Navbar /></LanguageProvider>);
    await waitFor(() => expect(intersectionCallback).not.toBeNull());
    act(() => {
      intersectionCallback?.([{ isIntersecting: true, target: { id: "about" } }] as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    });
    act(() => {
      intersectionCallback?.([{ isIntersecting: false, target: { id: "about" } }] as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    });
    expect(container.querySelector(".nav-link-active")).toBeNull();
  });

  it("closes mobile menu on resize above 768px", () => {
    vi.useFakeTimers();
    const { container } = render(<LanguageProvider><Navbar /></LanguageProvider>);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(container.querySelector(".navbar-mobile-menu")).toBeTruthy();

    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true, configurable: true });
    fireEvent.resize(window);
    act(() => { vi.advanceTimersByTime(300); });
    expect(container.querySelector(".navbar-mobile-menu")).toBeNull();
    vi.useRealTimers();
  });

  it("does not close mobile menu when resized below 768px", () => {
    const { container } = render(<LanguageProvider><Navbar /></LanguageProvider>);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(container.querySelector(".navbar-mobile-menu")).toBeTruthy();

    Object.defineProperty(window, "innerWidth", { value: 600, writable: true, configurable: true });
    fireEvent.resize(window);
    expect(container.querySelector(".navbar-mobile-menu")).toBeTruthy();
  });

  it("does nothing when scrollY is above 100", () => {
    render(<LanguageProvider><Navbar /></LanguageProvider>);
    Object.defineProperty(window, "scrollY", { value: 200, writable: true, configurable: true });
    fireEvent.scroll(window);
    expect(document.querySelectorAll(".nav-link-active")).toHaveLength(0);
  });

  it("keeps active section when a different section leaves viewport", async () => {
    const { container } = render(<LanguageProvider><Navbar /></LanguageProvider>);
    await waitFor(() => expect(intersectionCallback).not.toBeNull());

    act(() => {
      intersectionCallback?.([{ isIntersecting: true, target: { id: "about" } }] as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    });
    expect(container.querySelector(".nav-link-active")?.getAttribute("href")).toBe("#about");

    act(() => {
      intersectionCallback?.([{ isIntersecting: false, target: { id: "pricing" } }] as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    });
    expect(container.querySelector(".nav-link-active")?.getAttribute("href")).toBe("#about");
  });

  it("observes sections that exist in the DOM", async () => {
    const sectionIds = ["about", "pricing", "gallery", "contact"];
    sectionIds.forEach((id) => {
      const el = document.createElement("section");
      el.id = id;
      document.body.appendChild(el);
    });

    render(<LanguageProvider><Navbar /></LanguageProvider>);
    await waitFor(() => expect(intersectionCallback).not.toBeNull());
    expect(mockObserver?.observe).toHaveBeenCalledTimes(4);

    sectionIds.forEach((id) => document.getElementById(id)?.remove());
  });

  it("closes mobile menu when hamburger is clicked while open", () => {
    vi.useFakeTimers();
    const { container } = render(<LanguageProvider><Navbar /></LanguageProvider>);

    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(container.querySelector(".navbar-mobile-menu")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    act(() => { vi.advanceTimersByTime(300); });
    expect(container.querySelector(".navbar-mobile-menu")).toBeNull();
    vi.useRealTimers();
  });

  it("applies active class to mobile menu link matching active section", async () => {
    const { container } = render(<LanguageProvider><Navbar /></LanguageProvider>);
    await waitFor(() => expect(intersectionCallback).not.toBeNull());

    act(() => {
      intersectionCallback?.([{ isIntersecting: true, target: { id: "about" } }] as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    });

    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));

    const mobileMenu = container.querySelector(".navbar-mobile-menu");
    expect(mobileMenu?.querySelector(".nav-link-active")?.getAttribute("href")).toBe("#about");
  });
});
