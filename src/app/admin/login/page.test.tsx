import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLogin from "./page";
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
const mockGetCookie = vi.fn().mockReturnValue(undefined);
vi.mock("cookies-next", () => ({
  getCookie: () => mockGetCookie(),
}));

describe("AdminLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the password input", () => {
    render(<AdminLogin />);
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
  });

  it("redirects to /admin on successful login", async () => {
    vi.mocked(axios.post).mockResolvedValue({});

    render(<AdminLogin />);
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "correct" } });
    fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
  });

  it("shows incorrect password error on 401", async () => {
    vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 401 } });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    render(<AdminLogin />);
    fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText("Incorrect password.")).toBeTruthy();
    });
  });

  it("shows server error on 500", async () => {
    vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 500 } });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    render(<AdminLogin />);
    fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeTruthy();
    });
  });

  it("shows no connection error when there is no response", async () => {
    vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: undefined });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    render(<AdminLogin />);
    fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/no connection/i)).toBeTruthy();
    });
  });

  it("shows generic error for unexpected axios error", async () => {
    vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 418 } });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    render(<AdminLogin />);
    fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeTruthy();
    });
  });

  it("shows generic error for non-axios errors", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("unexpected"));
    vi.spyOn(axios, "isAxiosError").mockReturnValue(false);

    render(<AdminLogin />);
    fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeTruthy();
    });
  });

  describe("when language is Serbian", () => {
    beforeEach(() => {
      mockGetCookie.mockReturnValue("Serbian");
    });

    it("shows Serbian incorrect password error on 401", async () => {
      vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 401 } });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      render(<AdminLogin />);
      fireEvent.submit(screen.getByRole("button", { name: /prijava/i }));

      await waitFor(() => {
        expect(screen.getByText("Netačna lozinka.")).toBeTruthy();
      });
    });

    it("shows Serbian server error on 500", async () => {
      vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 500 } });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      render(<AdminLogin />);
      fireEvent.submit(screen.getByRole("button", { name: /prijava/i }));

      await waitFor(() => {
        expect(screen.getByText("Greška na serveru. Kontaktirajte administratora.")).toBeTruthy();
      });
    });

    it("shows Serbian no connection error", async () => {
      vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: undefined });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      render(<AdminLogin />);
      fireEvent.submit(screen.getByRole("button", { name: /prijava/i }));

      await waitFor(() => {
        expect(screen.getByText("Nema veze. Provjerite internet i pokušajte ponovo.")).toBeTruthy();
      });
    });

    it("shows Serbian generic error for unexpected axios error", async () => {
      vi.mocked(axios.post).mockRejectedValue({ isAxiosError: true, response: { status: 418 } });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      render(<AdminLogin />);
      fireEvent.submit(screen.getByRole("button", { name: /prijava/i }));

      await waitFor(() => {
        expect(screen.getByText("Nešto je pošlo po krivu. Pokušajte ponovo.")).toBeTruthy();
      });
    });

    it("shows Serbian generic error for non-axios errors", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("unexpected"));
      vi.spyOn(axios, "isAxiosError").mockReturnValue(false);

      render(<AdminLogin />);
      fireEvent.submit(screen.getByRole("button", { name: /prijava/i }));

      await waitFor(() => {
        expect(screen.getByText("Nešto je pošlo po krivu. Pokušajte ponovo.")).toBeTruthy();
      });
    });
  });
});
