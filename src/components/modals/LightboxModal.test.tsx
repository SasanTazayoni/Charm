import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LightboxModal from "./LightboxModal";
import { LanguageProvider } from "@/context/LanguageContext";
import type { Photo } from "@/types/photo";

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

const mockPhoto: Photo = {
  url: "https://blob.vercel.com/gallery/photo1.jpg",
  pathname: "gallery/photo1.jpg",
};

describe("LightboxModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={false} isVisible={false} onClose={vi.fn()} photo={mockPhoto} />
      </LanguageProvider>
    );
    expect(container.querySelector(".lightbox-backdrop")).toBeNull();
  });

  it("renders nothing when photo is null", () => {
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={true} onClose={vi.fn()} photo={null} />
      </LanguageProvider>
    );
    expect(container.querySelector(".lightbox-backdrop")).toBeNull();
  });

  it("renders the backdrop when open", () => {
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={true} onClose={vi.fn()} photo={mockPhoto} />
      </LanguageProvider>
    );
    expect(container.querySelector(".lightbox-backdrop")).toBeTruthy();
  });

  it("renders the photo when open", () => {
    render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={true} onClose={vi.fn()} photo={mockPhoto} />
      </LanguageProvider>
    );
    expect(screen.getByAltText("Charm nail art")).toBeTruthy();
  });

  it("applies visible class when isVisible is true", () => {
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={true} onClose={vi.fn()} photo={mockPhoto} />
      </LanguageProvider>
    );
    expect(container.querySelector(".lightbox-backdrop-visible")).toBeTruthy();
  });

  it("does not apply visible class when isVisible is false", () => {
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={false} onClose={vi.fn()} photo={mockPhoto} />
      </LanguageProvider>
    );
    expect(container.querySelector(".lightbox-backdrop-visible")).toBeNull();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={true} onClose={onClose} photo={mockPhoto} />
      </LanguageProvider>
    );
    fireEvent.click(container.querySelector(".lightbox-close")!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={true} onClose={onClose} photo={mockPhoto} />
      </LanguageProvider>
    );
    fireEvent.click(container.querySelector(".lightbox-backdrop")!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={true} onClose={onClose} photo={mockPhoto} />
      </LanguageProvider>
    );
    fireEvent.keyDown(container.querySelector(".lightbox-backdrop")!, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when a non-Escape key is pressed", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={true} onClose={onClose} photo={mockPhoto} />
      </LanguageProvider>
    );
    fireEvent.keyDown(container.querySelector(".lightbox-backdrop")!, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not call onClose when the modal content is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <LightboxModal isOpen={true} isVisible={true} onClose={onClose} photo={mockPhoto} />
      </LanguageProvider>
    );
    fireEvent.click(container.querySelector(".lightbox-modal")!);
    expect(onClose).not.toHaveBeenCalled();
  });
});
