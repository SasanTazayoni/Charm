import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Gallery from "./Gallery";
import { LanguageProvider } from "@/context/LanguageContext";
import axios from "axios";

vi.mock("axios");
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});
vi.mock("@/lib/fetchWithRetry", () => ({
  fetchWithRetry: vi.fn((operation: () => Promise<unknown>) => operation()),
}));

const mockPhotos = [
  { url: "https://blob.vercel.com/gallery/photo1.jpg", pathname: "gallery/photo1.jpg" },
  { url: "https://blob.vercel.com/gallery/photo2.jpg", pathname: "gallery/photo2.jpg" },
];

describe("Gallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => cb(0));
  });

  it("shows a loading spinner initially", () => {
    vi.mocked(axios.get).mockReturnValue(new Promise(() => {}));
    const { container } = render(<LanguageProvider><Gallery /></LanguageProvider>);
    expect(container.querySelector(".gallery-spinner")).toBeTruthy();
  });

  it("shows photos after successful fetch", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<LanguageProvider><Gallery /></LanguageProvider>);
    await waitFor(() => {
      expect(container.querySelectorAll(".gallery-item")).toHaveLength(2);
    });
  });

  it("shows error message when fetch fails", async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));
    render(<LanguageProvider><Gallery /></LanguageProvider>);
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeTruthy();
    });
  });

  it("shows empty state when gallery has no photos", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [] });
    render(<LanguageProvider><Gallery /></LanguageProvider>);
    await waitFor(() => {
      expect(screen.getByText(/no photos/i)).toBeTruthy();
    });
  });

  it("opens lightbox when a photo is clicked", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<LanguageProvider><Gallery /></LanguageProvider>);
    await waitFor(() => expect(container.querySelector(".gallery-item")).toBeTruthy());
    fireEvent.click(container.querySelector(".gallery-item")!);
    expect(container.querySelector(".lightbox-backdrop")).toBeTruthy();
  });

  it("opens lightbox when Space is pressed on a photo", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<LanguageProvider><Gallery /></LanguageProvider>);
    await waitFor(() => expect(container.querySelector(".gallery-item")).toBeTruthy());
    fireEvent.keyDown(container.querySelector(".gallery-item")!, { key: " " });
    expect(container.querySelector(".lightbox-backdrop")).toBeTruthy();
  });

  it("opens lightbox when Enter is pressed on a photo", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<LanguageProvider><Gallery /></LanguageProvider>);
    await waitFor(() => expect(container.querySelector(".gallery-item")).toBeTruthy());
    fireEvent.keyDown(container.querySelector(".gallery-item")!, { key: "Enter" });
    expect(container.querySelector(".lightbox-backdrop")).toBeTruthy();
  });

  it("closes lightbox when close button is clicked", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<LanguageProvider><Gallery /></LanguageProvider>);
    await waitFor(() => expect(container.querySelector(".gallery-item")).toBeTruthy());
    fireEvent.click(container.querySelector(".gallery-item")!);
    fireEvent.click(container.querySelector(".lightbox-close")!);
    await waitFor(() => {
      expect(container.querySelector(".lightbox-backdrop")).toBeNull();
    });
  });

  it("closes lightbox when Escape is pressed", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<LanguageProvider><Gallery /></LanguageProvider>);
    await waitFor(() => expect(container.querySelector(".gallery-item")).toBeTruthy());
    fireEvent.click(container.querySelector(".gallery-item")!);
    fireEvent.keyDown(container.querySelector(".lightbox-backdrop")!, { key: "Escape" });
    await waitFor(() => {
      expect(container.querySelector(".lightbox-backdrop")).toBeNull();
    });
  });
});
