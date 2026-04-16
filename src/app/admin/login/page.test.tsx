import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLogin from "./page";
import { LanguageProvider } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import axios from "axios";

const mockPush = vi.fn();

vi.mock("axios");
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
vi.mock("@/components/CascadeButton", () => ({
  default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant: string }) => (
    <button {...props}>{children}</button>
  ),
}));

describe("AdminLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the password input", () => {
    render(<LanguageProvider><AdminLogin /></LanguageProvider>);
    expect(screen.getByPlaceholderText(tr.adminLogin.passwordPlaceholder.English)).toBeTruthy();
  });

  it("redirects to /admin on successful login", async () => {
    vi.mocked(axios.post).mockResolvedValue({});

    render(<LanguageProvider><AdminLogin /></LanguageProvider>);
    fireEvent.change(screen.getByPlaceholderText(tr.adminLogin.passwordPlaceholder.English), { target: { value: "correct" } });
    fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.English }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
  });

  it("disables the submit button while loading", async () => {
    vi.mocked(axios.post).mockReturnValue(new Promise(() => {}));

    render(<LanguageProvider><AdminLogin /></LanguageProvider>);
    fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.English }));

    await waitFor(() => {
      const button = screen.getByRole("button", { name: tr.adminLogin.submit.English }) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });

  it("shows incorrect password error on 401", async () => {
    vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 401 } });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    render(<LanguageProvider><AdminLogin /></LanguageProvider>);
    fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.English }));

    await waitFor(() => {
      expect(screen.getByText(tr.adminLogin.errorWrongPassword.English)).toBeTruthy();
    });
  });

  it("shows server error on 500", async () => {
    vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 500 } });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    render(<LanguageProvider><AdminLogin /></LanguageProvider>);
    fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.English }));

    await waitFor(() => {
      expect(screen.getByText(tr.adminLogin.errorServer.English)).toBeTruthy();
    });
  });

  it("shows no connection error when there is no response", async () => {
    vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: undefined });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    render(<LanguageProvider><AdminLogin /></LanguageProvider>);
    fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.English }));

    await waitFor(() => {
      expect(screen.getByText(tr.adminLogin.errorNoConnection.English)).toBeTruthy();
    });
  });

  it("shows generic error for unexpected axios error", async () => {
    vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 418 } });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    render(<LanguageProvider><AdminLogin /></LanguageProvider>);
    fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.English }));

    await waitFor(() => {
      expect(screen.getByText(tr.adminLogin.errorGeneric.English)).toBeTruthy();
    });
  });

  it("shows generic error for non-axios errors", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("unexpected"));
    vi.spyOn(axios, "isAxiosError").mockReturnValue(false);

    render(<LanguageProvider><AdminLogin /></LanguageProvider>);
    fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.English }));

    await waitFor(() => {
      expect(screen.getByText(tr.adminLogin.errorGeneric.English)).toBeTruthy();
    });
  });

  describe("when language is Serbian", () => {
    it("shows Serbian incorrect password error on 401", async () => {
      vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 401 } });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      render(<LanguageProvider initialLanguage="Serbian"><AdminLogin /></LanguageProvider>);
      fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.Serbian }));

      await waitFor(() => {
        expect(screen.getByText(tr.adminLogin.errorWrongPassword.Serbian)).toBeTruthy();
      });
    });

    it("shows Serbian server error on 500", async () => {
      vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 500 } });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      render(<LanguageProvider initialLanguage="Serbian"><AdminLogin /></LanguageProvider>);
      fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.Serbian }));

      await waitFor(() => {
        expect(screen.getByText(tr.adminLogin.errorServer.Serbian)).toBeTruthy();
      });
    });

    it("shows Serbian no connection error", async () => {
      vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: undefined });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      render(<LanguageProvider initialLanguage="Serbian"><AdminLogin /></LanguageProvider>);
      fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.Serbian }));

      await waitFor(() => {
        expect(screen.getByText(tr.adminLogin.errorNoConnection.Serbian)).toBeTruthy();
      });
    });

    it("shows Serbian generic error for unexpected axios error", async () => {
      vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 418 } });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      render(<LanguageProvider initialLanguage="Serbian"><AdminLogin /></LanguageProvider>);
      fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.Serbian }));

      await waitFor(() => {
        expect(screen.getByText(tr.adminLogin.errorGeneric.Serbian)).toBeTruthy();
      });
    });

    it("shows Serbian generic error for non-axios errors", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("unexpected"));
      vi.spyOn(axios, "isAxiosError").mockReturnValue(false);

      render(<LanguageProvider initialLanguage="Serbian"><AdminLogin /></LanguageProvider>);
      fireEvent.submit(screen.getByRole("button", { name: tr.adminLogin.submit.Serbian }));

      await waitFor(() => {
        expect(screen.getByText(tr.adminLogin.errorGeneric.Serbian)).toBeTruthy();
      });
    });
  });
});
