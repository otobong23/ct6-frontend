"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell, LanguagePill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { PasswordField } from "@/components/PasswordField";
import { Button } from "@/components/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setErrors({
        email: !email ? "Enter a valid email and password" : undefined,
        password: !password ? "Enter a valid email and password" : undefined,
      });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setErrors({
        email: "Incorrect email and password combination",
        password: "Incorrect email and password combination",
      });
    }, 600);
  }

  return (
    <AuthShell
      topSlot={<LanguagePill />}
      title="Log in"
      subtitle="Enter valid email and password"
      footer={
        <span className="text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="link-accent" style={{ display: "inline" }}>
            Sign up
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="stack">
        <TextField className="stack-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordField
          placeholder="Create Password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />

        <Link href="/forgot-password" className="link-accent">
          Forgot password
        </Link>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Register"}
        </Button>
      </form>
    </AuthShell>
  );
}