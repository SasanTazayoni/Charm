import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ScrollToTop from "./ScrollToTop";

describe("ScrollToTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true, configurable: true });
    window.scrollTo = vi.fn();
  });

  it("renders a scroll to top button", () => {
    const { container } = render(<ScrollToTop />);
    expect(container.querySelector("button[aria-label='Scroll to top']")).toBeTruthy();
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
    Object.defineProperty(window, "scrollY", { value: 900 });
    fireEvent.scroll(window);
    fireEvent.click(screen.getByRole("button", { name: /scroll to top/i }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("starts pulsing when opacity transition ends while visible", async () => {
    const spy = vi.spyOn(EventTarget.prototype, "addEventListener");

    try {
      const { container } = render(<ScrollToTop />);
      Object.defineProperty(window, "scrollY", { value: 900 });
      fireEvent.scroll(window);

      const calls = spy.mock.calls.filter(([type]) => type === "transitionend");
      const handler = calls.at(-1)?.[1] as EventListener;
      const fakeEvent = Object.assign(new Event("transitionend"), { propertyName: "opacity" });
      await act(async () => { handler(fakeEvent); });

      const button = container.querySelector(".scroll-to-top")!;
      expect(button.classList.contains("scroll-to-top-pulsing")).toBe(true);
    } finally {
      spy.mockRestore();
    }
  });

  it("resets pulsing when scrolled back above innerHeight", () => {
    const { container } = render(<ScrollToTop />);
    Object.defineProperty(window, "scrollY", { value: 900 });
    fireEvent.scroll(window);
    Object.defineProperty(window, "scrollY", { value: 0 });
    fireEvent.scroll(window);
    const button = container.querySelector(".scroll-to-top");
    expect(button?.classList.contains("scroll-to-top-pulsing")).toBe(false);
  });
});
