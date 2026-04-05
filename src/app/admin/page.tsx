"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import CascadeButton from "@/components/CascadeButton";
import { getCookie } from "cookies-next";
import { fetchWithRetry } from "@/lib/fetchWithRetry";

type Photo = {
  url: string;
  pathname: string;
};

type StatusMessage = { text: string; type: "success" | "error" } | null;

export default function AdminPage() {
  const [serbian, setSerbian] = useState(false);

  useEffect(() => {
    setSerbian(getCookie("language") === "Serbian");
  }, []);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<StatusMessage>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [confirmUrl, setConfirmUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchPhotos = async () => {
    try {
      const res = await fetchWithRetry(() => axios.get<Photo[]>("/api/photos", { timeout: 8000 }));
      setPhotos(res.data);
    } catch {
      setStatus({ text: serbian ? "Greška pri učitavanju fotografija. Osvježite stranicu." : "Failed to load photos. Please refresh the page.", type: "error" });
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      await axios.post("/api/upload", formData);
      await fetchPhotos();
      setStatus({ text: serbian ? "Fotografija je uspješno dodana." : "Photo uploaded successfully.", type: "success" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const code = error.response?.status;
        setStatus({
          text: serbian
            ? code === 400 ? "Nevažeći tip fajla. Dozvoljeni su samo JPEG, PNG i WebP."
            : code === 413 ? "Fajl je preveć velik. Maksimalna veličina je 10MB."
            : "Došlo je do greške. Pokušajte ponovo."
            : error.response?.data?.error ?? "Upload failed. Please try again.",
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
      setStatus({ text: serbian ? "Fotografija je uspješno obrisana." : "Photo deleted successfully.", type: "success" });
    } catch {
      setStatus({ text: serbian ? "Nešto je pošlo po krivu. Pokušajte ponovo." : "Something went wrong. Please try again.", type: "error" });
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
        <h1 className="section-heading admin-heading">{serbian ? "Upravitelj galerijom" : "Gallery Manager"}</h1>
        {status && (
          <p className={status.type === "success" ? "admin-upload-success" : "admin-upload-error"}>
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
            <FiUpload size={16} />
            {uploading ? (serbian ? "Učitavanje..." : "Uploading...") : (serbian ? "Dodaj" : "Upload")}
          </CascadeButton>
          <CascadeButton variant="pink-outline" className="pink-outline-button admin-logout-button" onClick={handleLogout}>
            {serbian ? "Odjava" : "Log out"}
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
        <p className="admin-empty">{serbian ? "Još nema fotografija." : "No photos yet."}</p>
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
        <div className="admin-confirm-backdrop" onClick={() => setConfirmUrl(null)}>
          <div className="admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p className="admin-confirm-text">{serbian ? "Obrisati ovu fotografiju?" : "Delete this photo?"}</p>
            <div className="admin-confirm-actions">
              <CascadeButton variant="pink-outline" className="pink-outline-button admin-confirm-cancel" onClick={() => setConfirmUrl(null)}>
                {serbian ? "Odustani" : "Cancel"}
              </CascadeButton>
              <CascadeButton variant="gold" className="gold-button admin-confirm-delete" onClick={handleDelete}>
                {serbian ? "Obriši" : "Delete"}
              </CascadeButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
