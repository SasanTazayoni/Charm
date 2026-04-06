import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ScrollToTop from "./ScrollToTop";

describe("ScrollToTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true, configurable: true });
    window.scrollTo = vi.fn();
  });

  it("renders a scroll to top button", () => {
    render(<ScrollToTop />);
    expect(screen.getByRole("button", { name: /scroll to top/i })).toBeTruthy();
  });

  it("button is not visible initially", () => {
    const { container } = render(<ScrollToTop />);
    const button = container.querySelector(".scroll-to-top");
    expect(button?.classList.contains("scroll-to-top-visible")).toBe(false);
  });

  it("button becomes visible when scrollY exceeds innerHeight", () => {
    const { container } = render(<ScrollToTop />);
    Object.defineProperty(window, "scrollY", { value: 900 });
    fireEvent.scroll(window);
    const button = container.querySelector(".scroll-to-top");
    expect(button?.classList.contains("scroll-to-top-visible")).toBe(true);
  });

  it("calls window.scrollTo when clicked", () => {
    render(<ScrollToTop />);
    fireEvent.click(screen.getByRole("button", { name: /scroll to top/i }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
