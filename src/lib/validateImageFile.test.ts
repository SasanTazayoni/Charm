import { describe, it, expect } from "vitest";
import { validateImageFile } from "./validateImageFile";

const makeFile = (type: string, size: number) => ({ type, size }) as File;

describe("validateImageFile", () => {
  it("returns null for a valid JPEG", () => {
    expect(validateImageFile(makeFile("image/jpeg", 100))).toBeNull();
  });

  it("returns null for a valid PNG", () => {
    expect(validateImageFile(makeFile("image/png", 100))).toBeNull();
  });

  it("returns null for a valid WebP", () => {
    expect(validateImageFile(makeFile("image/webp", 100))).toBeNull();
  });

  it("returns 400 for an invalid file type", async () => {
    const response = validateImageFile(makeFile("image/gif", 100));
    expect(response?.status).toBe(400);
    const body = await response?.json();
    expect(body.error).toMatch(/invalid file type/i);
  });

  it("returns 413 when the file exceeds 10MB", async () => {
    const response = validateImageFile(makeFile("image/jpeg", 11 * 1024 * 1024));
    expect(response?.status).toBe(413);
    const body = await response?.json();
    expect(body.error).toMatch(/file too large/i);
  });
});
