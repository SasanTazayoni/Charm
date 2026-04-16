import { describe, it, expect, beforeEach, vi } from "vitest";
import { DELETE } from "./route";
import { NextRequest } from "next/server";
import * as blob from "@vercel/blob";

vi.mock("@vercel/blob", () => ({
  del: vi.fn().mockResolvedValue(undefined),
}));

describe("DELETE /api/delete", () => {
  const makeRequest = (body: Record<string, unknown>, token?: string) => {
    const req = new NextRequest("http://localhost/api/delete", {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (token) req.cookies.set("admin_auth", token);
    return req;
  };

  beforeEach(() => {
    process.env.ADMIN_SECRET = "correct-secret";
  });

  describe("when the request is unauthorized", () => {
    it("returns 401 if no token is present", async () => {
      const response = await DELETE(makeRequest({ url: "https://blob.vercel.com/gallery/test.jpg" }));
      expect(response.status).toBe(401);
    });

    it("returns 401 if token is incorrect", async () => {
      const response = await DELETE(makeRequest({ url: "https://blob.vercel.com/gallery/test.jpg" }, "wrong-token"));
      expect(response.status).toBe(401);
    });
  });

  describe("when the request body is malformed", () => {
    it("returns 400 for invalid JSON", async () => {
      const req = new NextRequest("http://localhost/api/delete", {
        method: "DELETE",
        body: "not-json",
        headers: { "Content-Type": "application/json" },
      });
      req.cookies.set("admin_auth", "correct-secret");
      const response = await DELETE(req);
      expect(response.status).toBe(400);
    });
  });

  describe("when no URL is provided", () => {
    it("returns 400", async () => {
      const response = await DELETE(makeRequest({}, "correct-secret"));
      expect(response.status).toBe(400);
    });
  });

  describe("when the request is valid", () => {
    it("returns 200", async () => {
      const response = await DELETE(makeRequest({ url: "https://blob.vercel.com/gallery/test.jpg" }, "correct-secret"));
      expect(response.status).toBe(200);
    });
  });

  describe("when the blob operation fails", () => {
    it("returns 500 if del throws", async () => {
      vi.spyOn(blob, "del").mockRejectedValueOnce(new Error("Blob error"));
      const response = await DELETE(makeRequest({ url: "https://blob.vercel.com/gallery/test.jpg" }, "correct-secret"));
      expect(response.status).toBe(500);
    });
  });
});
