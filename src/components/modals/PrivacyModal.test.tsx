import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PrivacyModal from "./PrivacyModal";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("@/components/CascadeButton", () => ({
  default: ({ children, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant: string }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("PrivacyModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <LanguageProvider>
        <PrivacyModal isOpen={false} isVisible={false} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".privacy-modal-backdrop")).toBeNull();
  });

  it("renders the backdrop when open", () => {
    const { container } = render(
      <LanguageProvider>
        <PrivacyModal isOpen={true} isVisible={true} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".privacy-modal-backdrop")).toBeTruthy();
  });

  it("renders the heading when open", () => {
    render(
      <LanguageProvider>
        <PrivacyModal isOpen={true} isVisible={true} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(screen.getByText("Privacy & Cookie Notice")).toBeTruthy();
  });

  it("renders the body paragraphs when open", () => {
    const { container } = render(
      <LanguageProvider>
        <PrivacyModal isOpen={true} isVisible={true} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelectorAll(".privacy-modal-text").length).toBeGreaterThan(0);
  });

  it("applies visible class when isVisible is true", () => {
    const { container } = render(
      <LanguageProvider>
        <PrivacyModal isOpen={true} isVisible={true} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".privacy-modal-backdrop-visible")).toBeTruthy();
  });

  it("does not apply visible class when isVisible is false", () => {
    const { container } = render(
      <LanguageProvider>
        <PrivacyModal isOpen={true} isVisible={false} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".privacy-modal-backdrop-visible")).toBeNull();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <LanguageProvider>
        <PrivacyModal isOpen={true} isVisible={true} onClose={onClose} />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <PrivacyModal isOpen={true} isVisible={true} onClose={onClose} />
      </LanguageProvider>
    );
    fireEvent.click(container.querySelector(".privacy-modal-backdrop")!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when the modal content is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <PrivacyModal isOpen={true} isVisible={true} onClose={onClose} />
      </LanguageProvider>
    );
    fireEvent.click(container.querySelector(".privacy-modal")!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders Serbian heading when language is Serbian", () => {
    render(
      <LanguageProvider initialLanguage="Serbian">
        <PrivacyModal isOpen={true} isVisible={true} onClose={vi.fn()} />
      </LanguageProvider>
    );
    expect(screen.getByText("Obavještenje o privatnosti i kolačićima")).toBeTruthy();
  });
});
