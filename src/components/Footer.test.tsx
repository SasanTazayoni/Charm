import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Footer", () => {
  it("renders a GitHub link", () => {
    render(<LanguageProvider><Footer /></LanguageProvider>);
    const link = screen.getByRole("link");
    expect(link).toBeTruthy();
  });
});
