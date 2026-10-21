"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, BackPill } from "@/components/AuthShell";
import { OtpInput } from "@/components/0tpInput";
import { Button } from "@/components/Button";
import { useCountdown } from "@/components/useCountdown";

export default function ResetPasswordVerifyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [values, setValues] = useState<string[]>(Array(6).fill(""));
  const { seconds, reset } = useCountdown(59);
  const code = values.join("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length === 6) {
      sessionStorage.setItem("passwordResetCode", code);
      router.push("/forgot-password/new-password");
    }
  }

  return (
    <AuthShell
      topSlot={<BackPill />}
      title={t("Reset password")}
      subtitle={t("Now enter six digit code sent to your email")}
    >
      <form onSubmit={handleSubmit} className="stack-lg">
        <OtpInput values={values} onChange={setValues} />

        <p className="otp-note">
          {t("Send again in")}{" "}
          {seconds > 0 ? (
            <span className="text-accent">{seconds}{t("s")}</span>
          ) : (
            <button type="button" onClick={reset} className="link-accent" style={{ display: "inline" }}>
              {t("Resend")}
            </button>
          )}
        </p>

        <Button type="submit" disabled={code.length !== 6}>
          {t("Verify")}
        </Button>
      </form>
    </AuthShell>
  );
}
