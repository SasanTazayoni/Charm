import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import Hero from "./Hero";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("@/components/Divider", () => ({
  default: () => <div className="divider" />,
}));

const DISPLAY_DURATION = 10000;
const FADE_DURATION = 2000;

describe("Hero", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders without crashing", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders 2 video elements", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    expect(container.querySelectorAll("video")).toHaveLength(2);
  });

  it("first video has opacity 1 initially", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    const videos = container.querySelectorAll("video");
    expect((videos[0] as HTMLElement).style.opacity).toBe("1");
  });

  it("other videos have opacity 0 initially", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    const videos = container.querySelectorAll("video");
    expect((videos[1] as HTMLElement).style.opacity).toBe("0");
  });

  it("renders social links", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    const links = container.querySelectorAll("a");
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it("videos have loop attribute", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    const videos = container.querySelectorAll("video");
    videos.forEach((v) => expect((v as HTMLVideoElement).loop).toBe(true));
  });

  it("plays first video on mount", () => {
    render(<LanguageProvider><Hero /></LanguageProvider>);
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
  });

  it("fades to next video after display duration", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    const videos = container.querySelectorAll("video");

    act(() => { vi.advanceTimersByTime(DISPLAY_DURATION - FADE_DURATION); });

    expect((videos[0] as HTMLElement).style.opacity).toBe("0");
    expect((videos[1] as HTMLElement).style.opacity).toBe("1");
  });

  it("pauses previous video after fade completes", () => {
    render(<LanguageProvider><Hero /></LanguageProvider>);

    act(() => { vi.advanceTimersByTime(DISPLAY_DURATION); });

    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
  });

  it("loops back to first video after second video display duration", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    const videos = container.querySelectorAll("video");

    act(() => { vi.advanceTimersByTime(DISPLAY_DURATION); });
    act(() => { vi.advanceTimersByTime(DISPLAY_DURATION - FADE_DURATION); });

    expect((videos[1] as HTMLElement).style.opacity).toBe("0");
    expect((videos[0] as HTMLElement).style.opacity).toBe("1");
  });

  it("unmounts without errors and clears display timer", () => {
    const { unmount } = render(<LanguageProvider><Hero /></LanguageProvider>);
    expect(() => unmount()).not.toThrow();
  });

  it("unmounts without errors mid-fade and clears fade timer", () => {
    const { unmount } = render(<LanguageProvider><Hero /></LanguageProvider>);
    act(() => { vi.advanceTimersByTime(DISPLAY_DURATION - FADE_DURATION); });
    expect(() => unmount()).not.toThrow();
  });

  it("handles play rejection without crashing", async () => {
    window.HTMLMediaElement.prototype.play = vi.fn().mockRejectedValue(new Error("NotAllowedError"));
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    await Promise.resolve();
    act(() => { vi.advanceTimersByTime(DISPLAY_DURATION - FADE_DURATION); });
    await Promise.resolve();
    expect(container.firstChild).toBeTruthy();
  });
});
