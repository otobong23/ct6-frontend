"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell, BackPill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { PasswordField } from "@/components/PasswordField";
import { Button } from "@/components/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{7,15}$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = "Name cannot be empty";
    if (!EMAIL_RE.test(email)) next.email = "This email is not valid";
    if (!PHONE_RE.test(phone)) next.phone = "The phone number you entered is invalid";
    if (!PASSWORD_RE.test(password))
      next.password =
        "Password must be eight characters or above, must also contain upper case, lowercase and special characters";
    if (confirmPassword !== password || !confirmPassword)
      next.confirmPassword = "Password Dosen't match";
    if (!referral.trim()) next.referral = "Referal cannot be empty";
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      router.push("/verify-email");
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
        <TextField
          placeholder="095 5763 11"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          leftSlot={
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="field-select"
            >
              <option value="+1">{t("+1")}</option>
              <option value="+234">{t("+234")}</option>
              <option value="+44">{t("+44")}</option>
            </select>
          }
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
          error={errors.referral}
        />

        <Button type="submit">{t("Register")}</Button>
      </form>
    </AuthShell>
  );
}