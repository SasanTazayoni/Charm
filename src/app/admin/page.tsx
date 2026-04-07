"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import CascadeButton from "@/components/CascadeButton";
import { getCookie } from "cookies-next";
import { fetchWithRetry } from "@/lib/fetchWithRetry";
import type { Photo } from "@/types/photo";

type StatusMessage = { text: string; type: "success" | "error" } | null;

export default function AdminPage() {
  const [isSerbian, setIsSerbian] = useState(false);

  useEffect(() => {
    setIsSerbian(getCookie("language") === "Serbian");
  }, []);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<StatusMessage>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [confirmUrl, setConfirmUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchPhotos = useCallback(async () => {
    try {
      const photosResponse = await fetchWithRetry(() =>
        axios.get<Photo[]>("/api/photos", { timeout: 8000 }),
      );
      setPhotos(photosResponse.data);
    } catch {
      setStatus({
        text: isSerbian
          ? "Greška pri učitavanju fotografija. Osvježite stranicu."
          : "Failed to load photos. Please refresh the page.",
        type: "error",
      });
    } finally {
      setLoadingPhotos(false);
    }
  }, [isSerbian]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    const fileAlreadyExists = photos.some((photo) => photo.pathname === `gallery/${selectedFile.name}`);
    if (fileAlreadyExists) {
      setStatus({
        text: isSerbian
          ? "Fotografija s tim imenom već postoji. Preimenujte fajl i pokušajte ponovo."
          : "A photo with that name already exists. Rename the file and try again.",
        type: "error",
      });
      fileInputRef.current!.value = "";
      return;
    }

    setUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("/api/upload", formData);
      await fetchPhotos();
      setStatus({
        text: isSerbian
          ? "Fotografija je uspješno dodana."
          : "Photo uploaded successfully.",
        type: "success",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const code = error.response?.status;
        setStatus({
          text: isSerbian
            ? code === 400
              ? "Nevažeći tip fajla. Dozvoljeni su samo JPEG, PNG i WebP."
              : code === 413
                ? "Fajl je preveć velik. Maksimalna veličina je 10MB."
                : "Došlo je do greške. Pokušajte ponovo."
            : (error.response?.data?.error ??
              "Upload failed. Please try again."),
          type: "error",
        });
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!confirmUrl) return;
    setDeletingUrl(confirmUrl);
    setConfirmUrl(null);
    setStatus(null);
    try {
      await axios.delete("/api/delete", { data: { url: confirmUrl } });
      await fetchPhotos();
      setStatus({
        text: isSerbian
          ? "Fotografija je uspješno obrisana."
          : "Photo deleted successfully.",
        type: "success",
      });
    } catch {
      setStatus({
        text: isSerbian
          ? "Nešto je pošlo po krivu. Pokušajte ponovo."
          : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setDeletingUrl(null);
    }
  };

  const handleLogout = async () => {
    await axios.post("/api/admin/logout");
    router.push("/admin/login");
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="section-heading admin-heading">
          {isSerbian ? "Upravitelj galerijom" : "Gallery Manager"}
        </h1>
        {status && (
          <p
            className={
              status.type === "success"
                ? "admin-upload-success"
                : "admin-upload-error"
            }
          >
            {status.text}
          </p>
        )}
        <div className="admin-actions">
          <CascadeButton
            variant="gold"
            className="gold-button admin-upload-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {isSerbian ? "Dodaj" : "Upload"}
          </CascadeButton>
          <CascadeButton
            variant="pink-outline"
            className="pink-outline-button admin-logout-button"
            onClick={handleLogout}
          >
            {isSerbian ? "Odjava" : "Log out"}
          </CascadeButton>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="admin-file-input"
          onChange={handleUpload}
        />
      </div>

      {loadingPhotos ? (
        <div className="gallery-loading">
          <Loader2 size={60} className="gallery-spinner" />
        </div>
      ) : photos.length === 0 ? (
        <p className="admin-empty">
          {isSerbian ? "Još nema fotografija." : "No photos yet."}
        </p>
      ) : (
        <div className="admin-grid">
          {photos.map((photo) => (
            <div key={photo.url} className="admin-photo-item">
              <Image
                src={photo.url}
                alt="Charm nail art"
                fill
                sizes="25vw"
                className="admin-photo-image"
              />
              <button
                className="admin-delete-button"
                onClick={() => setConfirmUrl(photo.url)}
                disabled={deletingUrl === photo.url}
              >
                <IoClose size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {confirmUrl && (
        <div
          className="admin-confirm-backdrop"
          onClick={() => setConfirmUrl(null)}
        >
          <div
            className="admin-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="admin-confirm-text">
              {isSerbian ? "Obrisati ovu fotografiju?" : "Delete this photo?"}
            </p>
            <div className="admin-confirm-actions">
              <CascadeButton
                variant="pink-outline"
                className="pink-outline-button admin-confirm-cancel"
                onClick={() => setConfirmUrl(null)}
              >
                {isSerbian ? "Odustani" : "Cancel"}
              </CascadeButton>
              <CascadeButton
                variant="gold"
                className="gold-button admin-confirm-delete"
                onClick={handleDelete}
              >
                {isSerbian ? "Obriši" : "Delete"}
              </CascadeButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
