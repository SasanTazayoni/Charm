"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import CascadeButton from "@/components/CascadeButton";
import { useLanguage } from "@/context/LanguageContext";
import { translations as tr } from "@/constants/translations";

export default function AdminLogin() {
  const { language } = useLanguage();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/admin/login", { password });
      router.push("/admin");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          setError(tr.adminLogin.errorWrongPassword[language]);
        } else if (status === 500) {
          setError(tr.adminLogin.errorServer[language]);
        } else if (!err.response) {
          setError(tr.adminLogin.errorNoConnection[language]);
        } else {
          setError(tr.adminLogin.errorGeneric[language]);
        }
      } else {
        setError(tr.adminLogin.errorGeneric[language]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <Image src="/logo.png" alt="Charm" width={160} height={160} priority />
        <h1 className="section-heading admin-login-heading">{tr.adminLogin.heading[language]}</h1>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="password"
            placeholder={tr.adminLogin.passwordPlaceholder[language]}
            aria-label={tr.adminLogin.passwordPlaceholder[language]}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login-input"
            autoFocus
          />
          {error && <p className="admin-login-error">{error}</p>}
          <CascadeButton type="submit" variant="gold" className="gold-button admin-login-button" disabled={loading}>
            {tr.adminLogin.submit[language]}
          </CascadeButton>
        </form>
      </div>
    </div>
  );
}
