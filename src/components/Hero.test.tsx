import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Hero from "./Hero";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("@/components/Divider", () => ({
  default: () => <div className="divider" />,
}));

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

  it("renders 3 video elements", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    expect(container.querySelectorAll("video")).toHaveLength(3);
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
    expect((videos[2] as HTMLElement).style.opacity).toBe("0");
  });

  it("renders social links", () => {
    const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
    const links = container.querySelectorAll("a");
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  describe("handleTimeUpdate", () => {
    it("does not fade if video duration is not finite", () => {
      const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
      const video = container.querySelectorAll("video")[0] as HTMLVideoElement;

      Object.defineProperty(video, "duration", { value: Infinity, configurable: true });
      Object.defineProperty(video, "currentTime", { value: 0, configurable: true });
      fireEvent.timeUpdate(video);

      expect((video as HTMLElement).style.opacity).toBe("1");
    });

    it("does not fade if video is not near the end", () => {
      const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
      const video = container.querySelectorAll("video")[0] as HTMLVideoElement;

      Object.defineProperty(video, "duration", { value: 20, configurable: true });
      Object.defineProperty(video, "currentTime", { value: 0, configurable: true });
      fireEvent.timeUpdate(video);

      expect((video as HTMLElement).style.opacity).toBe("1");
    });

    it("fades to next video when current video approaches end", () => {
      const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
      const videos = container.querySelectorAll("video");
      const video = videos[0] as HTMLVideoElement;

      Object.defineProperty(video, "duration", { value: 10, configurable: true });
      Object.defineProperty(video, "currentTime", { value: 8, configurable: true });
      fireEvent.timeUpdate(video);

      expect((video as HTMLElement).style.opacity).toBe("0");
      expect((videos[1] as HTMLElement).style.opacity).toBe("1");
    });

    it("does not trigger fade again while already fading", () => {
      const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
      const video = container.querySelectorAll("video")[0] as HTMLVideoElement;

      Object.defineProperty(video, "duration", { value: 10, configurable: true });
      Object.defineProperty(video, "currentTime", { value: 8, configurable: true });

      fireEvent.timeUpdate(video);
      fireEvent.timeUpdate(video);

      expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    });

    it("resets fading state after fade duration and allows next fade", () => {
      const { container } = render(<LanguageProvider><Hero /></LanguageProvider>);
      const videos = container.querySelectorAll("video");
      const video0 = videos[0] as HTMLVideoElement;
      const video1 = videos[1] as HTMLVideoElement;

      Object.defineProperty(video0, "duration", { value: 10, configurable: true });
      Object.defineProperty(video0, "currentTime", { value: 8, configurable: true });
      fireEvent.timeUpdate(video0);

      vi.advanceTimersByTime(2000);

      Object.defineProperty(video1, "duration", { value: 10, configurable: true });
      Object.defineProperty(video1, "currentTime", { value: 8, configurable: true });
      fireEvent.timeUpdate(video1);

      expect((video1 as HTMLElement).style.opacity).toBe("0");
      expect((videos[2] as HTMLElement).style.opacity).toBe("1");
    });
  });
});
