import { describe, it, expect, beforeEach, vi } from "vitest";
import { PUT } from "./route";
import { NextRequest } from "next/server";

vi.mock("@vercel/blob", () => ({
  put: vi.fn().mockResolvedValue({ url: "https://blob.vercel.com/gallery/new.jpg" }),
  del: vi.fn().mockResolvedValue(undefined),
}));

describe("PUT /api/replace", () => {
  const makeRequest = (
    file?: { name: string; type: string; size: number },
    url?: string,
    token?: string,
  ) => {
    const req = new NextRequest("http://localhost/api/replace", { method: "PUT" });
    vi.spyOn(req, "formData").mockResolvedValue({
      get: (key: string) => {
        if (key === "file") return file ?? null;
        if (key === "url") return url ?? null;
        return null;
      },
    } as unknown as FormData);
    if (token) req.cookies.set("admin_auth", token);
    return req;
  };

  beforeEach(() => {
    process.env.ADMIN_SECRET = "correct-secret";
  });

  describe("when the request is unauthorized", () => {
    it("returns 401 if no token is present", async () => {
      const response = await PUT(makeRequest());
      expect(response.status).toBe(401);
    });

    it("returns 401 if token is incorrect", async () => {
      const response = await PUT(makeRequest({ name: "new.jpg", type: "image/jpeg", size: 100 }, "https://blob.vercel.com/gallery/old.jpg", "wrong-token"));
      expect(response.status).toBe(401);
    });
  });

  describe("when fields are missing", () => {
    it("returns 400 if no file is provided", async () => {
      const response = await PUT(makeRequest(undefined, "https://blob.vercel.com/gallery/old.jpg", "correct-secret"));
      expect(response.status).toBe(400);
    });

    it("returns 400 if no url is provided", async () => {
      const response = await PUT(makeRequest({ name: "new.jpg", type: "image/jpeg", size: 100 }, undefined, "correct-secret"));
      expect(response.status).toBe(400);
    });

    it("returns 400 if neither file nor url is provided", async () => {
      const response = await PUT(makeRequest(undefined, undefined, "correct-secret"));
      expect(response.status).toBe(400);
    });
  });

  describe("when the file type is invalid", () => {
    it("returns 400 for a GIF", async () => {
      const response = await PUT(makeRequest({ name: "test.gif", type: "image/gif", size: 100 }, "https://blob.vercel.com/gallery/old.jpg", "correct-secret"));
      expect(response.status).toBe(400);
    });
  });

  describe("when the file is too large", () => {
    it("returns 413", async () => {
      const response = await PUT(makeRequest({ name: "large.jpg", type: "image/jpeg", size: 11 * 1024 * 1024 }, "https://blob.vercel.com/gallery/old.jpg", "correct-secret"));
      expect(response.status).toBe(413);
    });
  });

  describe("when the request is valid", () => {
    it("returns 200 for a JPEG", async () => {
      const response = await PUT(makeRequest({ name: "new.jpg", type: "image/jpeg", size: 100 }, "https://blob.vercel.com/gallery/old.jpg", "correct-secret"));
      expect(response.status).toBe(200);
    });

    it("returns 200 for a PNG", async () => {
      const response = await PUT(makeRequest({ name: "new.png", type: "image/png", size: 100 }, "https://blob.vercel.com/gallery/old.jpg", "correct-secret"));
      expect(response.status).toBe(200);
    });

    it("returns 200 for a WebP", async () => {
      const response = await PUT(makeRequest({ name: "new.webp", type: "image/webp", size: 100 }, "https://blob.vercel.com/gallery/old.jpg", "correct-secret"));
      expect(response.status).toBe(200);
    });
  });
});
