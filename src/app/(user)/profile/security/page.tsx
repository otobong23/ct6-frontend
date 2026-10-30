"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BackPill } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { PasswordField } from "@/components/PasswordField";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/endpoints";

export default function SecurityPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: profileLoading, refreshProfile } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAction, setSavedAction] = useState<"create" | "change" | null>(null);
  const [returnTo, setReturnTo] = useState("");
  const hasWalletPassword = Boolean(user?.walletPassword);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("returnTo") || "";
    setReturnTo(requested.startsWith("/") && !requested.startsWith("//") ? requested : "");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSavedAction(null);
    if (newPassword.length < 8) {
      setError(t("Wallet password must be at least 8 characters"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("Passwords do not match"));
      return;
    }
    if (hasWalletPassword && !currentPassword) {
      setError(t("Enter your current wallet password"));
      return;
    }

    setSaving(true);
    try {
      const action = hasWalletPassword ? "change" : "create";
      if (action === "change") {
        await userApi.walletPassword.change({ currentPassword, newPassword });
      } else {
        await userApi.walletPassword.create({ newPassword });
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSavedAction(action);
      await refreshProfile().catch(() => {});
      if (action === "create" && returnTo) router.replace(returnTo);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("Could not update wallet password"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/profile" />} />
      <h1 className="section-title" style={{ marginTop: 20 }}>{t("Wallet password")}</h1>
      {profileLoading ? <p className="text-muted" role="status">{t("Loading...")}</p> : <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
        <p className="panel-subtitle">{t(hasWalletPassword ? "Change your wallet password" : "Create a wallet password for withdrawals")}</p>
        {hasWalletPassword && <div>
          <p className="field-label">{t("Current wallet password")}</p>
          <PasswordField placeholder={t("Current wallet password")} value={currentPassword} onChange={setCurrentPassword} />
        </div>}
        <div>
          <p className="field-label">{t("New wallet password")}</p>
          <PasswordField placeholder={t("New wallet password")} value={newPassword} onChange={setNewPassword} />
        </div>
        <div>
          <p className="field-label">{t("Confirm wallet password")}</p>
          <PasswordField placeholder={t("Confirm wallet password")} value={confirmPassword} onChange={setConfirmPassword} />
        </div>
        {error && <p className="field-error-text" role="alert">{error}</p>}
        {savedAction && <p role="status">{t(savedAction === "create" ? "Wallet password created successfully" : "Wallet password updated successfully")}</p>}
        <Button type="submit" disabled={saving}>{saving ? t("Saving...") : t(hasWalletPassword ? "Change password" : "Create password")}</Button>
      </form>}
    </div>
  );
}
