import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import About from "./About";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

describe("About", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => cb(0));
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it("closes the certificate modal when the close button is clicked", () => {
    const { container } = render(<LanguageProvider><About /></LanguageProvider>);
    fireEvent.click(screen.getByText("my certificate"));
    fireEvent.click(screen.getByLabelText("Close"));
    act(() => { vi.advanceTimersByTime(300); });
    expect(container.querySelector(".certificate-modal-backdrop")).toBeNull();
  });

  it("closes the certificate modal when Escape is pressed", () => {
    const { container } = render(<LanguageProvider><About /></LanguageProvider>);
    fireEvent.click(screen.getByText("my certificate"));
    const backdrop = container.querySelector(".certificate-modal-backdrop")!;
    fireEvent.keyDown(backdrop, { key: "Escape" });
    act(() => { vi.advanceTimersByTime(300); });
    expect(container.querySelector(".certificate-modal-backdrop")).toBeNull();
  });
});
