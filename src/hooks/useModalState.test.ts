import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useModalState } from "./useModalState";

describe("useModalState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => cb(0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("when open is called", () => {
    it("sets isOpen and isVisible to true", async () => {
      const { result } = renderHook(() => useModalState());

      await act(async () => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.isVisible).toBe(true);
    });
  });

  describe("when close is called", () => {
    it("sets isVisible to false immediately", async () => {
      const { result } = renderHook(() => useModalState());

      await act(async () => {
        result.current.open();
      });

      await act(async () => {
        result.current.close();
      });

      expect(result.current.isVisible).toBe(false);
      expect(result.current.isOpen).toBe(true);
    });

    it("sets isOpen to false after 300ms", async () => {
      const { result } = renderHook(() => useModalState());

      await act(async () => {
        result.current.open();
      });

      await act(async () => {
        result.current.close();
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("when the component unmounts", () => {
    it("clears the timer on unmount", async () => {
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
      const { result, unmount } = renderHook(() => useModalState());

      await act(async () => {
        result.current.open();
        result.current.close();
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
