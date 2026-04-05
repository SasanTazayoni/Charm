"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";

type Photo = {
  url: string;
  pathname: string;
};

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchPhotos = async () => {
    const res = await axios.get<Photo[]>("/api/photos");
    setPhotos(res.data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      await axios.post("/api/upload", formData);
      await fetchPhotos();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (url: string) => {
    setDeletingUrl(url);
    try {
      await axios.delete("/api/delete", { data: { url } });
      await fetchPhotos();
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
        <h1 className="section-heading admin-heading">Gallery Manager</h1>
        <div className="admin-actions">
          <button
            className="gold-button admin-upload-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <FiUpload size={16} />
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
          <button className="admin-logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="admin-file-input"
          onChange={handleUpload}
        />
      </div>

      {photos.length === 0 ? (
        <p className="admin-empty">No photos yet.</p>
      ) : (
        <div className="admin-grid">
          {photos.map((photo) => (
            <div key={photo.url} className="admin-photo-item">
              <Image
                src={photo.url}
                alt={photo.pathname}
                fill
                className="admin-photo-image"
              />
              <button
                className="admin-delete-button"
                onClick={() => handleDelete(photo.url)}
                disabled={deletingUrl === photo.url}
              >
                <IoClose size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
