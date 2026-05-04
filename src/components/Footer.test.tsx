import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { LanguageProvider } from "@/context/LanguageContext";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/modals/PrivacyModal", () => ({
  default: () => null,
}));

describe("Footer", () => {
  it("renders the privacy & cookie notice link", () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>,
    );
    expect(screen.getByText("Privacy & Cookie Notice")).toBeTruthy();
  });
});
