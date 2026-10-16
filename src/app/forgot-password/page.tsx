"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, BackPill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("This email is not valid");
      return;
    }
    router.push("/forgot-password/verify");
  }

  return (
    <AuthShell
      topSlot={<BackPill />}
      title={t("Reset password")}
      subtitle={t("Enter the email linked to your account")}
    >
      <form onSubmit={handleSubmit} className="stack">
        <TextField
          type="email"
          placeholder={t("Email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <Button type="submit">{t("Send code")}</Button>
      </form>
    </AuthShell>
  );
}