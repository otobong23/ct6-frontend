"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, BackPill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { authApi } from "@/lib/endpoints";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!EMAIL_RE.test(email)) {
      setError("This email is not valid");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      sessionStorage.setItem("passwordResetEmail", email.trim());
      sessionStorage.removeItem("passwordResetCode");
      router.push("/forgot-password/verify");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not start password reset. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        <Button type="submit" disabled={submitting}>{submitting ? "Sending…" : t("Send code")}</Button>
      </form>
    </AuthShell>
  );
}
