import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageToggle from "./LanguageToggle";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

vi.mock("@/components/CascadeButton", () => ({
  default: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

function LanguageDisplay() {
  const { language } = useLanguage();
  return <span data-testid="language">{language}</span>;
}

describe("LanguageToggle", () => {
  it("toggles from English to Serbian on click", () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <LanguageDisplay />
      </LanguageProvider>
    );

    expect(screen.getByTestId("language").textContent).toBe("English");
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("language").textContent).toBe("Serbian");
  });

  it("toggles back to English from Serbian", () => {
    render(
      <LanguageProvider initialLanguage="Serbian">
        <LanguageToggle />
        <LanguageDisplay />
      </LanguageProvider>
    );

    expect(screen.getByTestId("language").textContent).toBe("Serbian");
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("language").textContent).toBe("English");
  });
});
