"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell, BackPill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { authApi } from "@/lib/endpoints";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await authApi.verifyEmail({ email: email.trim(), code: code.trim() });
      setMessage("Email verified successfully. You can now log in.");
      window.setTimeout(() => router.replace("/login"), 1000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to verify your email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await authApi.resendVerificationCode({ email: email.trim() });
      setMessage(result.message || "A new verification code has been sent.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to resend the code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell topSlot={<BackPill />} title="Verify your email" subtitle="Enter the 6-digit code sent to your email address.">
      <form onSubmit={handleVerify} className="stack">
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        {message && <p role="status" className="text-sm text-green-500">{message}</p>}
        <TextField type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        <TextField placeholder="6-digit verification code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" required />
        <Button type="submit" disabled={busy || code.length !== 6}>{busy ? "Verifying..." : "Verify email"}</Button>
        <Button type="button" disabled={busy || !email.trim()} onClick={handleResend}>Resend code</Button>
        <p className="text-muted">Already verified? <Link href="/login" className="link-accent">Log in</Link></p>
      </form>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return <Suspense fallback={null}><VerifyEmailForm /></Suspense>;
}
