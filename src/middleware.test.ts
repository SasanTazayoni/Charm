import { describe, it, expect } from "vitest";
import { middleware } from "./middleware";
import { NextRequest } from "next/server";

describe("middleware", () => {
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
      const response = middleware(makeRequest("/admin"));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/admin/login");
    });

    it("redirects to /admin/login if token is incorrect", () => {
      const response = middleware(makeRequest("/admin", "wrong-token"));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/admin/login");
    });

    it("allows access if token matches ADMIN_SECRET", () => {
      process.env.ADMIN_SECRET = "correct-secret";
      const response = middleware(makeRequest("/admin", "correct-secret"));
      expect(response.status).toBe(200);
    });
  });

  describe("when accessing /admin/login", () => {
    it("always allows access regardless of token", () => {
      const response = middleware(makeRequest("/admin/login"));
      expect(response.status).toBe(200);
    });
  });

  describe("when accessing a nested admin route", () => {
    it("redirects if accessing /admin/dashboard without a token", () => {
      const response = middleware(makeRequest("/admin/dashboard"));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/admin/login");
    });
  });
});
