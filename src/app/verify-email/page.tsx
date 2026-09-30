"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, BackPill } from "@/components/AuthShell";
import { OtpInput } from "@/components/0tpInput";
import { Button } from "@/components/Button";
import { useCountdown } from "@/components/useCountdown";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [values, setValues] = useState<string[]>(Array(6).fill(""));
  const { seconds, reset } = useCountdown(59);
  const code = values.join("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length === 6) {
      router.push("/login");
    }
  }

  return (
    <AuthShell
      topSlot={<BackPill />}
      title="Email Verification"
      subtitle="Now enter six digit code sent to your email"
    >
      <form onSubmit={handleSubmit} className="stack-lg">
        <OtpInput values={values} onChange={setValues} />

        <p className="otp-note">
          Send again in{" "}
          {seconds > 0 ? (
            <span className="text-accent">{seconds}s</span>
          ) : (
            <button type="button" onClick={reset} className="link-accent" style={{ display: "inline" }}>
              Resend
            </button>
          )}
        </p>

        <Button type="submit" disabled={code.length !== 6}>
          Register
        </Button>
      </form>
    </AuthShell>
  );
}