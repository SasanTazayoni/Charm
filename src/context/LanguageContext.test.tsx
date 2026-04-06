import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import * as cookiesNext from "cookies-next";

describe("LanguageContext", () => {
  describe("useLanguage", () => {
    it("throws if used outside of LanguageProvider", () => {
      expect(() => renderHook(() => useLanguage())).toThrow(
        "useLanguage must be used within a LanguageProvider"
      );
    });

    it("returns the initial language as English by default", () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      expect(result.current.language).toBe("English");
    });
  });

  describe("setLanguage", () => {
    it("updates the language", async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      await act(async () => {
        result.current.setLanguage("Serbian");
      });

      expect(result.current.language).toBe("Serbian");
    });

    it("sets a cookie when language changes", async () => {
      const setCookieSpy = vi.spyOn(cookiesNext, "setCookie");

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      await act(async () => {
        result.current.setLanguage("Serbian");
      });

      expect(setCookieSpy).toHaveBeenCalledWith("language", "Serbian", {
        maxAge: 60 * 60 * 24 * 365,
      });
    });
  });
});
