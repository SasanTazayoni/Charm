"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import CascadeButton from "@/components/CascadeButton";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLogin() {
  const { language } = useLanguage();
  const isSerbian = language === "Serbian";
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
          setError(isSerbian ? "Netačna lozinka." : "Incorrect password.");
        } else if (status === 500) {
          setError(isSerbian ? "Greška na serveru. Kontaktirajte administratora." : "Server error. Please contact the administrator.");
        } else if (!err.response) {
          setError(isSerbian ? "Nema veze. Provjerite internet i pokušajte ponovo." : "No connection. Check your internet and try again.");
        } else {
          setError(isSerbian ? "Nešto je pošlo po krivu. Pokušajte ponovo." : "Something went wrong. Please try again.");
        }
      } else {
        setError(isSerbian ? "Nešto je pošlo po krivu. Pokušajte ponovo." : "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <Image src="/logo.png" alt="Charm" width={160} height={160} priority />
        <h1 className="section-heading admin-login-heading">{isSerbian ? "Administrator" : "Admin"}</h1>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="password"
            placeholder={isSerbian ? "Lozinka" : "Password"}
            aria-label={isSerbian ? "Lozinka" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login-input"
            autoFocus
          />
          {error && <p className="admin-login-error">{error}</p>}
          <CascadeButton type="submit" variant="gold" className="gold-button admin-login-button" disabled={loading}>
            {isSerbian ? "Prijava" : "Log in"}
          </CascadeButton>
        </form>
      </div>
    </div>
  );
}
