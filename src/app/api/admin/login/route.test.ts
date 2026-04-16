import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

describe("POST /api/admin/login", () => {
  const makeRequest = (body: Record<string, unknown>) =>
    new NextRequest("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "correct-password";
    process.env.ADMIN_SECRET = "correct-secret";
  });

  describe("when the request body is malformed", () => {
    it("returns 400 for invalid JSON", async () => {
      const req = new NextRequest("http://localhost/api/admin/login", {
        method: "POST",
        body: "not-json",
        headers: { "Content-Type": "application/json" },
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  describe("when env vars are missing", () => {
    it("returns 500 if ADMIN_PASSWORD is not set", async () => {
      delete process.env.ADMIN_PASSWORD;
      const response = await POST(makeRequest({ password: "anything" }));
      expect(response.status).toBe(500);
    });

    it("returns 500 if ADMIN_SECRET is not set", async () => {
      delete process.env.ADMIN_SECRET;
      const response = await POST(makeRequest({ password: "anything" }));
      expect(response.status).toBe(500);
    });
  });

  describe("when the password is incorrect", () => {
    it("returns 401 for a wrong password", async () => {
      const response = await POST(makeRequest({ password: "wrong-password" }));
      expect(response.status).toBe(401);
    });

    it("returns 401 for a wrong password of the same length", async () => {
      const response = await POST(makeRequest({ password: "xxxxxxxxxxxxxxxx" }));
      expect(response.status).toBe(401);
    });

    it("returns 401 when password is not a string", async () => {
      const response = await POST(makeRequest({ password: 12345 }));
      expect(response.status).toBe(401);
    });
  });

  describe("when the password is correct", () => {
    it("returns 200", async () => {
      const response = await POST(makeRequest({ password: "correct-password" }));
      expect(response.status).toBe(200);
    });

    it("sets the admin_auth cookie with correct flags", async () => {
      const response = await POST(makeRequest({ password: "correct-password" }));
      const cookie = response.cookies.get("admin_auth");

      expect(cookie?.value).toBe("correct-secret");
      expect(cookie?.httpOnly).toBe(true);
      expect(cookie?.sameSite).toBe("strict");
      expect(cookie?.maxAge).toBe(60 * 60 * 24 * 7);
    });
  });
});
