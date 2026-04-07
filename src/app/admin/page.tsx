"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import CascadeButton from "@/components/CascadeButton";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";
import { GALLERY_PREFIX } from "@/constants/blob";
import { fetchWithRetry } from "@/lib/fetchWithRetry";
import type { Photo } from "@/types/photo";

type StatusMessage = { text: string; type: "success" | "error" } | null;

export default function AdminPage() {
  const { language } = useLanguage();
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
      setStatus({ text: tr.admin.loadError[language], type: "error" });
    } finally {
      setLoadingPhotos(false);
    }
  }, [language]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    const fileAlreadyExists = photos.some((photo) => photo.pathname === `${GALLERY_PREFIX}${selectedFile.name}`);
    if (fileAlreadyExists) {
      setStatus({ text: tr.admin.uploadErrorDuplicate[language], type: "error" });
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
      setStatus({ text: tr.admin.uploadSuccess[language], type: "success" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const code = error.response?.status;
        setStatus({
          text: code === 400
              ? tr.admin.uploadErrorInvalidFile[language]
              : code === 413
                ? tr.admin.uploadErrorFileTooLarge[language]
                : tr.admin.uploadError[language],
          type: "error",
        });
      }
    } finally {
      setUploading(false);
      fileInputRef.current!.value = "";
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
      setStatus({ text: tr.admin.deleteSuccess[language], type: "success" });
    } catch {
      setStatus({ text: tr.admin.deleteError[language], type: "error" });
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
          {tr.admin.heading[language]}
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
            {tr.admin.upload[language]}
          </CascadeButton>
          <CascadeButton
            variant="pink-outline"
            className="pink-outline-button admin-logout-button"
            onClick={handleLogout}
          >
            {tr.admin.logout[language]}
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
          {tr.admin.empty[language]}
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
                aria-label={tr.admin.deletePhotoLabel[language]}
              >
                <IoClose size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {confirmUrl && createPortal(
        <div
          className="admin-confirm-backdrop"
          onClick={() => setConfirmUrl(null)}
        >
          <div
            className="admin-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="admin-confirm-text">
              {tr.admin.confirmDelete[language]}
            </p>
            <div className="admin-confirm-actions">
              <CascadeButton
                variant="pink-outline"
                className="pink-outline-button admin-confirm-cancel"
                onClick={() => setConfirmUrl(null)}
              >
                {tr.admin.cancel[language]}
              </CascadeButton>
              <CascadeButton
                variant="gold"
                className="gold-button admin-confirm-delete"
                onClick={handleDelete}
              >
                {tr.admin.delete[language]}
              </CascadeButton>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
