import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CertificateModal from "./CertificateModal";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

describe("CertificateModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <LanguageProvider>
        <CertificateModal isOpen={false} isVisible={false} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".certificate-modal-backdrop")).toBeNull();
  });

  it("renders the backdrop when open", () => {
    const { container } = render(
      <LanguageProvider>
        <CertificateModal isOpen={true} isVisible={true} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".certificate-modal-backdrop")).toBeTruthy();
  });

  it("renders the certificate image when open", () => {
    render(
      <LanguageProvider>
        <CertificateModal isOpen={true} isVisible={true} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(screen.getByAltText("Professional Nail Technology Certificate")).toBeTruthy();
  });

  it("applies visible class when isVisible is true", () => {
    const { container } = render(
      <LanguageProvider>
        <CertificateModal isOpen={true} isVisible={true} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".certificate-modal-backdrop-visible")).toBeTruthy();
  });

  it("does not apply visible class when isVisible is false", () => {
    const { container } = render(
      <LanguageProvider>
        <CertificateModal isOpen={true} isVisible={false} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".certificate-modal-backdrop-visible")).toBeNull();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <LanguageProvider>
        <CertificateModal isOpen={true} isVisible={true} onClose={onClose} />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <CertificateModal isOpen={true} isVisible={true} onClose={onClose} />
      </LanguageProvider>
    );
    fireEvent.click(container.querySelector(".certificate-modal-backdrop")!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <CertificateModal isOpen={true} isVisible={true} onClose={onClose} />
      </LanguageProvider>
    );
    fireEvent.keyDown(container.querySelector(".certificate-modal-backdrop")!, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when a non-Escape key is pressed", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <CertificateModal isOpen={true} isVisible={true} onClose={onClose} />
      </LanguageProvider>
    );
    fireEvent.keyDown(container.querySelector(".certificate-modal-backdrop")!, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not call onClose when the modal content is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <CertificateModal isOpen={true} isVisible={true} onClose={onClose} />
      </LanguageProvider>
    );
    fireEvent.click(container.querySelector(".certificate-modal")!);
    expect(onClose).not.toHaveBeenCalled();
  });
});
