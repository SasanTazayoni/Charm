import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminPage from "./page";
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
  default: ({ children, onClick, disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant: string }) => (
    <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
  ),
}));
const mockGetCookie = vi.fn().mockReturnValue(undefined);
vi.mock("cookies-next", () => ({
  getCookie: () => mockGetCookie(),
}));
vi.mock("@/lib/fetchWithRetry", () => ({
  fetchWithRetry: vi.fn((operation: () => Promise<unknown>) => operation()),
}));

const mockPhotos = [
  { url: "https://blob.vercel.com/gallery/photo1.jpg", pathname: "gallery/photo1.jpg" },
  { url: "https://blob.vercel.com/gallery/photo2.jpg", pathname: "gallery/photo2.jpg" },
];

describe("AdminPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading spinner initially", () => {
    vi.mocked(axios.get).mockReturnValue(new Promise(() => {}));
    const { container } = render(<AdminPage />);
    expect(container.querySelector(".gallery-spinner")).toBeTruthy();
  });

  it("shows photos after successful fetch", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<AdminPage />);
    await waitFor(() => {
      expect(container.querySelectorAll(".admin-photo-item")).toHaveLength(2);
    });
  });

  it("shows error message when fetch fails", async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));
    render(<AdminPage />);
    await waitFor(() => {
      expect(screen.getByText(/failed to load photos/i)).toBeTruthy();
    });
  });

  it("shows empty state when no photos", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [] });
    render(<AdminPage />);
    await waitFor(() => {
      expect(screen.getByText("No photos yet.")).toBeTruthy();
    });
  });

  it("shows success message after upload", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    vi.mocked(axios.post).mockResolvedValue({});

    const { container } = render(<AdminPage />);
    await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());

    const input = container.querySelector("input[type='file']")!;
    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Photo uploaded successfully.")).toBeTruthy();
    });
  });

  it("does nothing when file input fires with no files", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<AdminPage />);
    await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());

    const input = container.querySelector("input[type='file']")!;
    fireEvent.change(input, { target: { files: [] } });
    expect(screen.queryByText(/uploaded/i)).toBeNull();
  });

  it("shows no error message when upload throws non-axios error", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    vi.mocked(axios.post).mockRejectedValue(new Error("unexpected"));
    vi.spyOn(axios, "isAxiosError").mockReturnValue(false);

    const { container } = render(<AdminPage />);
    await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());

    const input = container.querySelector("input[type='file']")!;
    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());
    expect(container.querySelector(".admin-upload-error")).toBeNull();
  });

  it("shows fallback upload error when response has no error message", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    vi.mocked(axios.post).mockRejectedValue({
      isAxiosError: true,
      response: { status: 400, data: {} },
    });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const { container } = render(<AdminPage />);
    await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());

    const input = container.querySelector("input[type='file']")!;
    const file = new File(["content"], "test.gif", { type: "image/gif" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Upload failed. Please try again.")).toBeTruthy();
    });
  });

  it("shows error message when upload fails", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    vi.mocked(axios.post).mockRejectedValue({
      isAxiosError: true,
      response: { status: 400, data: { error: "Invalid file type." } },
    });
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const { container } = render(<AdminPage />);
    await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());

    const input = container.querySelector("input[type='file']")!;
    const file = new File(["content"], "test.gif", { type: "image/gif" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Invalid file type.")).toBeTruthy();
    });
  });

  it("does nothing when delete is confirmed with no confirmUrl set", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<AdminPage />);
    await waitFor(() => expect(container.querySelector(".admin-delete-button")).toBeTruthy());

    fireEvent.click(container.querySelector(".admin-delete-button")!);
    fireEvent.click(container.querySelector(".admin-confirm-backdrop")!);
    expect(vi.mocked(axios.delete)).not.toHaveBeenCalled();
  });

  it("shows confirm modal when delete button is clicked", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<AdminPage />);
    await waitFor(() => expect(container.querySelector(".admin-delete-button")).toBeTruthy());

    fireEvent.click(container.querySelector(".admin-delete-button")!);
    expect(container.querySelector(".admin-confirm-modal")).toBeTruthy();
  });

  it("hides confirm modal when cancel is clicked", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<AdminPage />);
    await waitFor(() => fireEvent.click(container.querySelector(".admin-delete-button")!));

    fireEvent.click(screen.getByText("Cancel"));
    expect(container.querySelector(".admin-confirm-modal")).toBeNull();
  });

  it("shows success message after delete", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    vi.mocked(axios.delete).mockResolvedValue({});

    const { container } = render(<AdminPage />);
    await waitFor(() => fireEvent.click(container.querySelector(".admin-delete-button")!));
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(screen.getByText("Photo deleted successfully.")).toBeTruthy();
    });
  });

  it("shows error message when delete fails", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    vi.mocked(axios.delete).mockRejectedValue(new Error("Network error"));

    const { container } = render(<AdminPage />);
    await waitFor(() => fireEvent.click(container.querySelector(".admin-delete-button")!));
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeTruthy();
    });
  });

  it("clicking the upload button triggers the file input", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [] });
    const { container } = render(<AdminPage />);
    await waitFor(() => expect(screen.getByText("No photos yet.")).toBeTruthy());

    const fileInput = container.querySelector("input[type='file']") as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");
    fireEvent.click(screen.getByText("Upload"));
    expect(clickSpy).toHaveBeenCalled();
  });

  it("clicking the confirm backdrop dismisses the modal", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
    const { container } = render(<AdminPage />);
    await waitFor(() => fireEvent.click(container.querySelector(".admin-delete-button")!));

    fireEvent.click(container.querySelector(".admin-confirm-backdrop")!);
    expect(container.querySelector(".admin-confirm-modal")).toBeNull();
  });

  it("redirects to login on logout", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [] });
    vi.mocked(axios.post).mockResolvedValue({});

    render(<AdminPage />);
    await waitFor(() => expect(screen.getByText("No photos yet.")).toBeTruthy());

    fireEvent.click(screen.getByText("Log out"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/login");
    });
  });

  describe("when language is Serbian", () => {
    beforeEach(() => {
      mockGetCookie.mockReturnValue("Serbian");
    });

    it("shows Serbian error message when fetch fails", async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));
      render(<AdminPage />);
      await waitFor(() => {
        expect(screen.getByText("Greška pri učitavanju fotografija. Osvježite stranicu.")).toBeTruthy();
      });
    });

    it("shows Serbian empty state when no photos", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: [] });
      render(<AdminPage />);
      await waitFor(() => {
        expect(screen.getByText("Još nema fotografija.")).toBeTruthy();
      });
    });

    it("shows Serbian success message after upload", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
      vi.mocked(axios.post).mockResolvedValue({});

      const { container } = render(<AdminPage />);
      await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());

      const input = container.querySelector("input[type='file']")!;
      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("Fotografija je uspješno dodana.")).toBeTruthy();
      });
    });

    it("shows Serbian error message when upload fails with 400", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
      vi.mocked(axios.post).mockRejectedValue({
        isAxiosError: true,
        response: { status: 400, data: {} },
      });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const { container } = render(<AdminPage />);
      await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());

      const input = container.querySelector("input[type='file']")!;
      const file = new File(["content"], "test.gif", { type: "image/gif" });
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("Nevažeći tip fajla. Dozvoljeni su samo JPEG, PNG i WebP.")).toBeTruthy();
      });
    });

    it("shows Serbian generic upload error for unexpected status", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
      vi.mocked(axios.post).mockRejectedValue({
        isAxiosError: true,
        response: { status: 500, data: {} },
      });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const { container } = render(<AdminPage />);
      await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());

      const input = container.querySelector("input[type='file']")!;
      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("Došlo je do greške. Pokušajte ponovo.")).toBeTruthy();
      });
    });

    it("shows Serbian error message when upload fails with 413", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
      vi.mocked(axios.post).mockRejectedValue({
        isAxiosError: true,
        response: { status: 413, data: {} },
      });
      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const { container } = render(<AdminPage />);
      await waitFor(() => expect(container.querySelector(".admin-photo-item")).toBeTruthy());

      const input = container.querySelector("input[type='file']")!;
      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("Fajl je preveć velik. Maksimalna veličina je 10MB.")).toBeTruthy();
      });
    });

    it("shows Serbian success message after delete", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
      vi.mocked(axios.delete).mockResolvedValue({});

      const { container } = render(<AdminPage />);
      await waitFor(() => fireEvent.click(container.querySelector(".admin-delete-button")!));
      fireEvent.click(screen.getByText("Obriši"));

      await waitFor(() => {
        expect(screen.getByText("Fotografija je uspješno obrisana.")).toBeTruthy();
      });
    });

    it("shows Serbian error message when delete fails", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPhotos });
      vi.mocked(axios.delete).mockRejectedValue(new Error("Network error"));

      const { container } = render(<AdminPage />);
      await waitFor(() => fireEvent.click(container.querySelector(".admin-delete-button")!));
      fireEvent.click(screen.getByText("Obriši"));

      await waitFor(() => {
        expect(screen.getByText("Nešto je pošlo po krivu. Pokušajte ponovo.")).toBeTruthy();
      });
    });
  });
});
