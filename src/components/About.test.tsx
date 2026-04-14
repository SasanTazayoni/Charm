import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import About from "./About";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("@/components/modals/CertificateModal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div className="certificate-modal-backdrop" /> : null,
}));

describe("About", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => cb(0));
  });

  it("renders the about section", () => {
    const { container } = render(<LanguageProvider><About /></LanguageProvider>);
    expect(container.querySelector("#about")).toBeTruthy();
  });

  it("certificate modal is not visible initially", () => {
    const { container } = render(<LanguageProvider><About /></LanguageProvider>);
    expect(container.querySelector(".certificate-modal-backdrop")).toBeNull();
  });

  it("opens the certificate modal when the certificate link is clicked", () => {
    const { container } = render(<LanguageProvider><About /></LanguageProvider>);
    fireEvent.click(screen.getByText("my certificate"));
    expect(container.querySelector(".certificate-modal-backdrop")).toBeTruthy();
  });
});
