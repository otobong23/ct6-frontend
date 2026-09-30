"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, BackPill } from "@/components/AuthShell";
import { PasswordField } from "@/components/PasswordField";
import { Button } from "@/components/Button";

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!PASSWORD_RE.test(password))
      next.password =
        "Password must be eight characters or above, must also contain upper case, lowercase and special characters";
    if (confirmPassword !== password || !confirmPassword)
      next.confirmPassword = "Password Dosen't match";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      router.push("/login");
    }
  }

  return (
    <AuthShell
      topSlot={<BackPill />}
      title="Reset password"
      subtitle="Now set new security key"
    >
      <form onSubmit={handleSubmit} className="stack">
        <div>
          <p className="field-label">Set new password</p>
          <PasswordField
            placeholder="Confirm Password"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />
        </div>
        <div>
          <p className="field-label">Confirm password</p>
          <PasswordField
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
          />
        </div>

        <Button type="submit">Save</Button>
      </form>
    </AuthShell>
  );
}