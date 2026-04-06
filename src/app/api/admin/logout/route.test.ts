import { describe, it, expect } from "vitest";
import { POST } from "./route";

describe("POST /api/admin/logout", () => {
  it("returns 200", async () => {
    const response = await POST();
    expect(response.status).toBe(200);
  });

  it("deletes the admin_auth cookie", async () => {
    const response = await POST();
    const cookie = response.cookies.get("admin_auth");
    expect(cookie?.value).toBe("");
  });
});
