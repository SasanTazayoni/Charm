import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import * as validationModule from "@/lib/validateImageFile";
import * as cache from "next/cache";

vi.mock("@/lib/validateImageFile", () => ({
  validateImageFile: vi.fn().mockReturnValue(null),
}));

vi.mock("@vercel/blob", () => ({
  put: vi.fn().mockResolvedValue({ url: "https://blob.vercel.com/gallery/test.jpg" }),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

describe("POST /api/upload", () => {
  const makeRequest = (file?: { name: string; type: string; size: number }, token?: string) => {
    const req = new NextRequest("http://localhost/api/upload", { method: "POST" });
    vi.spyOn(req, "formData").mockResolvedValue({
      get: (key: string) => key === "file" ? file ?? null : null,
    } as unknown as FormData);
    if (token) req.cookies.set("admin_auth", token);
    return req;
  };

  beforeEach(() => {
    process.env.ADMIN_SECRET = "correct-secret";
  });

  describe("when the request is unauthorized", () => {
    it("returns 401 if no token is present", async () => {
      const response = await POST(makeRequest());
      expect(response.status).toBe(401);
    });

    it("returns 401 if token is incorrect", async () => {
      const response = await POST(makeRequest({ name: "test.jpg", type: "image/jpeg", size: 100 }, "wrong-token"));
      expect(response.status).toBe(401);
    });
  });

  describe("when no file is provided", () => {
    it("returns 400", async () => {
      const response = await POST(makeRequest(undefined, "correct-secret"));
      expect(response.status).toBe(400);
    });
  });

  describe("when the file fails validation", () => {
    it("returns the validation error response", async () => {
      vi.spyOn(validationModule, "validateImageFile").mockReturnValueOnce(
        NextResponse.json({ error: "Invalid file type. Only JPEG, PNG and WebP are allowed." }, { status: 400 }),
      );
      const response = await POST(makeRequest({ name: "test.gif", type: "image/gif", size: 100 }, "correct-secret"));
      expect(response.status).toBe(400);
    });
  });

  describe("when the file is valid", () => {
    it("returns 200 for a JPEG and busts the photo cache", async () => {
      const response = await POST(makeRequest({ name: "test.jpg", type: "image/jpeg", size: 100 }, "correct-secret"));
      expect(response.status).toBe(200);
      expect(cache.revalidateTag).toHaveBeenCalledWith("photos", {});
    });

    it("returns 200 for a PNG", async () => {
      const response = await POST(makeRequest({ name: "test.png", type: "image/png", size: 100 }, "correct-secret"));
      expect(response.status).toBe(200);
    });

    it("returns 200 for a WebP", async () => {
      const response = await POST(makeRequest({ name: "test.webp", type: "image/webp", size: 100 }, "correct-secret"));
      expect(response.status).toBe(200);
    });
  });
});
