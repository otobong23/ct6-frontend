"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell, BackPill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { PhoneInput } from "@/components/PhoneInput";
import { PasswordField } from "@/components/PasswordField";
import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{7,15}$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

type Errors = Partial<{
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referral: string;
}>;

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const referralCode = new URLSearchParams(window.location.search).get("referral_code");
    if (referralCode) setReferral(referralCode);
  }, []);

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = "Name cannot be empty";
    if (!EMAIL_RE.test(email)) next.email = "This email is not valid";
    if (!PHONE_RE.test(phone.replace(/[\s()-]/g, ""))) next.phone = "The phone number you entered is invalid";
    if (!PASSWORD_RE.test(password))
      next.password =
        "Password must be six characters or above, must also contain upper case, lowercase and special characters";
    if (confirmPassword !== password || !confirmPassword)
      next.confirmPassword = "Password Dosen't match";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setApiError("");
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      try {
        const [firstName, ...lastNameParts] = name.trim().split(/\s+/);
        await register({
          email: email.trim(),
          password,
          firstName,
          ...(lastNameParts.length > 0 && { lastName: lastNameParts.join(" ") }),
          phone: phone.replace(/[\s()-]/g, ""),
          referral_code: referral.trim(),
        });
        router.replace(`/verify-email?email=${encodeURIComponent(email.trim())}`);
      } catch (error) {
        setApiError(error instanceof Error ? error.message : "Unable to create your account. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  }

  return (
    <AuthShell
      topSlot={<BackPill />}
      title={t("Register")}
      subtitle={t("Create an account to continue!")}
      footer={
        <span className="text-muted">
          {t("Already have an account?")}{" "}
          <Link href="/login" className="link-accent" style={{ display: "inline" }}>
            {t("Login")}
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="stack">
        {apiError && <p role="alert" className="text-sm text-red-500">{apiError}</p>}
        <TextField
          placeholder={t("Duke Margret")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <TextField
          type="email"
          placeholder={t("Email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PhoneInput
          placeholder="Phone number"
          value={phone}
          onChange={setPhone}
          error={errors.phone}
        />
        <PasswordField
          placeholder={t("Create Password")}
          value={password}
          onChange={setPassword}
          error={errors.password}
        />
        <PasswordField
          placeholder={t("Confirm Password")}
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
        />
        <TextField
          placeholder={t("Referal Code")}
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
          // error={errors.referral}
        />

        <Button type="submit" disabled={submitting}>{submitting ? "Creating account…" : t("Register")}</Button>
      </form>
    </AuthShell>
  );
}
