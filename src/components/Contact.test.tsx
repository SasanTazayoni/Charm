import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "./Contact";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe("Contact", () => {
  it("renders the phone number", () => {
    render(<LanguageProvider><Contact /></LanguageProvider>);
    expect(screen.getByText("+387 66 955 693")).toBeTruthy();
  });

  it("renders a WhatsApp link", () => {
    render(<LanguageProvider><Contact /></LanguageProvider>);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toContain("wa.me");
  });
});
