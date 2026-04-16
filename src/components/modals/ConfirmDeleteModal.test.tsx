import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

vi.mock("@/components/CascadeButton", () => ({
  default: ({ children, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant: string }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("ConfirmDeleteModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={false} isVisible={false} onConfirm={vi.fn()} onCancel={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".admin-confirm-backdrop")).toBeNull();
  });

  it("renders the modal when open", () => {
    const { container } = render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={true} isVisible={true} onConfirm={vi.fn()} onCancel={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".admin-confirm-modal")).toBeTruthy();
  });

  it("applies visible class when isVisible is true", () => {
    const { container } = render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={true} isVisible={true} onConfirm={vi.fn()} onCancel={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".admin-confirm-backdrop-visible")).toBeTruthy();
  });

  it("does not apply visible class when isVisible is false", () => {
    const { container } = render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={true} isVisible={false} onConfirm={vi.fn()} onCancel={vi.fn()} />
      </LanguageProvider>
    );
    expect(container.querySelector(".admin-confirm-backdrop-visible")).toBeNull();
  });

  it("renders the confirmation text when open", () => {
    render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={true} isVisible={true} onConfirm={vi.fn()} onCancel={vi.fn()} />
      </LanguageProvider>
    );
    expect(screen.getByText("Delete this photo?")).toBeTruthy();
  });

  it("calls onConfirm when the delete button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={true} isVisible={true} onConfirm={onConfirm} onCancel={vi.fn()} />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onCancel when the cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={true} isVisible={true} onConfirm={vi.fn()} onCancel={onCancel} />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onCancel when the backdrop is clicked", () => {
    const onCancel = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={true} isVisible={true} onConfirm={vi.fn()} onCancel={onCancel} />
      </LanguageProvider>
    );
    fireEvent.click(container.querySelector(".admin-confirm-backdrop")!);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("does not call onCancel when the modal content is clicked", () => {
    const onCancel = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={true} isVisible={true} onConfirm={vi.fn()} onCancel={onCancel} />
      </LanguageProvider>
    );
    fireEvent.click(container.querySelector(".admin-confirm-modal")!);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel when Escape is pressed on the backdrop", () => {
    const onCancel = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <ConfirmDeleteModal isOpen={true} isVisible={true} onConfirm={vi.fn()} onCancel={onCancel} />
      </LanguageProvider>
    );
    fireEvent.keyDown(container.querySelector(".admin-confirm-backdrop")!, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("renders Serbian text when language is Serbian", () => {
    render(
      <LanguageProvider initialLanguage="Serbian">
        <ConfirmDeleteModal isOpen={true} isVisible={true} onConfirm={vi.fn()} onCancel={vi.fn()} />
      </LanguageProvider>
    );
    expect(screen.getByText("Obrisati ovu fotografiju?")).toBeTruthy();
    expect(screen.getByText("Odustani")).toBeTruthy();
    expect(screen.getByText("Obriši")).toBeTruthy();
  });
});
