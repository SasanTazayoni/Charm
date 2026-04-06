import { describe, it, expect, vi } from "vitest";
import { GET } from "./route";

vi.mock("@vercel/blob", () => ({
  list: vi.fn(),
}));

import { list } from "@vercel/blob";

describe("GET /api/photos", () => {
  describe("when gallery has photos and directories", () => {
    it("filters out directory entries and returns only photos", async () => {
      vi.mocked(list).mockResolvedValue({
        blobs: [
          { pathname: "gallery/photo1.jpg", url: "https://blob.vercel.com/gallery/photo1.jpg" },
          { pathname: "gallery/", url: "https://blob.vercel.com/gallery/" },
          { pathname: "gallery/photo2.png", url: "https://blob.vercel.com/gallery/photo2.png" },
        ],
        cursor: undefined,
        hasMore: false,
      } as never);

      const response = await GET();
      const data = await response.json();

      expect(data).toHaveLength(2);
      expect(data[0].pathname).toBe("gallery/photo1.jpg");
      expect(data[1].pathname).toBe("gallery/photo2.png");
    });
  });

  describe("when gallery is empty", () => {
    it("returns an empty array", async () => {
      vi.mocked(list).mockResolvedValue({
        blobs: [],
        cursor: undefined,
        hasMore: false,
      } as never);

      const response = await GET();
      const data = await response.json();

      expect(data).toHaveLength(0);
    });
  });
});
