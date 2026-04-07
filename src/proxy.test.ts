import { describe, it, expect } from "vitest";
import { proxy } from "./proxy";
import { NextRequest } from "next/server";

describe("proxy", () => {
  beforeEach(() => {
    process.env.ADMIN_SECRET = "correct-secret";
  });

  const makeRequest = (pathname: string, token?: string) => {
    const url = `http://localhost${pathname}`;
    const req = new NextRequest(url);
    if (token) req.cookies.set("admin_auth", token);
    return req;
  };

  describe("when accessing a protected admin route", () => {
    it("redirects to /admin/login if no token is present", () => {
      const response = proxy(makeRequest("/admin"));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/admin/login");
    });

    it("redirects to /admin/login if token is incorrect", () => {
      const response = proxy(makeRequest("/admin", "wrong-token"));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/admin/login");
    });

    it("allows access if token matches ADMIN_SECRET", () => {
      process.env.ADMIN_SECRET = "correct-secret";
      const response = proxy(makeRequest("/admin", "correct-secret"));
      expect(response.status).toBe(200);
    });
  });

  describe("when accessing /admin/login", () => {
    it("always allows access regardless of token", () => {
      const response = proxy(makeRequest("/admin/login"));
      expect(response.status).toBe(200);
    });
  });

  describe("when accessing a nested admin route", () => {
    it("redirects if accessing /admin/dashboard without a token", () => {
      const response = proxy(makeRequest("/admin/dashboard"));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/admin/login");
    });
  });
});
