import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchWithRetry } from "./fetchWithRetry";

describe("fetchWithRetry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("when the operation succeeds", () => {
    it("returns the result on the first attempt", async () => {
      const operation = vi.fn().mockResolvedValue("success");
      const result = await fetchWithRetry(operation);
      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe("when the operation fails then succeeds", () => {
    it("retries and returns the result on a later attempt", async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValue("success");

      const promise = fetchWithRetry(operation);
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });

  describe("when the operation always fails", () => {
    it("throws the last error after all retries are exhausted", async () => {
      const operation = vi.fn().mockRejectedValue(new Error("always fails"));

      const promise = fetchWithRetry(operation);
      promise.catch(() => {});
      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow("always fails");
      expect(operation).toHaveBeenCalledTimes(3);
    });
  });

  describe("when calculating retry delays", () => {
    it("waits the correct exponential backoff time between retries", async () => {
      const operation = vi.fn().mockRejectedValue(new Error("fail"));
      const setTimeoutSpy = vi.spyOn(global, "setTimeout");

      const promise = fetchWithRetry(operation, 3, 1000).catch(() => {});
      await vi.runAllTimersAsync();
      await promise;

      expect(setTimeoutSpy).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        1000,
      );
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(
        2,
        expect.any(Function),
        2000,
      );
    });
  });
});
