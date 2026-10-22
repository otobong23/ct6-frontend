"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell, LanguagePill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { PasswordField } from "@/components/PasswordField";
import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!email || !password) {
      setErrors({
        email: !email ? "Enter a valid email and password" : undefined,
        password: !password ? "Enter a valid email and password" : undefined,
      });
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      setSubmitting(false);
      router.replace("/home");
    } catch (error) {
      setSubmitting(false);
      setApiError(error instanceof Error ? error.message : "Unable to log in. Please try again.");
    }
  }

  return (
    <AuthShell
      topSlot={<LanguagePill />}
      title={t("Log in")}
      subtitle={t("Enter valid email and password")}
      footer={
        <span className="text-muted">
          {t("Don't have an account?")}{" "}
          <Link href="/register" className="link-accent" style={{ display: "inline" }}>
            {t("Sign up")}
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="stack">
        {apiError && <p role="alert" className="text-sm text-red-500">{apiError}</p>}
        <TextField
          type="email"
          placeholder={t("Email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          error={errors.email}
        />
        <PasswordField
          placeholder={t("Create Password")}
          value={password}
          onChange={setPassword}
          error={errors.password}
        />

        <Link href="/forgot-password" className="link-accent">
          {t("Forgot password")}
        </Link>

        <Button style={{ background: email && password ? "#68FF7F" : "#0AA521"}} type="submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
