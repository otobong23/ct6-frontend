"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BackPill } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { PasswordField } from "@/components/PasswordField";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/endpoints";

export default function BindWalletPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: profileLoading, refreshProfile } = useAuth();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPassword, setWalletPassword] = useState("");
  const [returnTo, setReturnTo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("returnTo") || "";
    setReturnTo(requested.startsWith("/") && !requested.startsWith("//") ? requested : "");
  }, []);

  useEffect(() => {
    if (profileLoading || !user) return;
    if (!user.walletPassword) {
      const target = `/profile/bind-wallet${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
      router.replace(`/profile/security?returnTo=${encodeURIComponent(target)}`);
      return;
    }
    setWalletAddress(user.walletAddress ?? "");
  }, [profileLoading, user, router, returnTo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!walletAddress.trim() || !walletPassword) {
      setError(t("Enter your wallet address and wallet password"));
      return;
    }
    setSaving(true); setError(""); setSaved(false);
    try {
      await userApi.profile.bindWalletAddress({ walletAddress: walletAddress.trim(), walletPassword });
      await refreshProfile();
      setWalletPassword(""); setSaved(true);
      if (returnTo) router.replace(returnTo);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : t("Could not update wallet address");
      if (message.toLowerCase().includes("create a wallet password")) {
        const target = `/profile/bind-wallet${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
        router.replace(`/profile/security?returnTo=${encodeURIComponent(target)}`);
      } else {
        setError(message);
      }
    } finally { setSaving(false); }
  }

  const needsPasswordSetup = !profileLoading && Boolean(user) && !user?.walletPassword;
  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/profile" />} />
      <h1 className="section-title" style={{ marginTop: 20 }}>{t("Bind wallet address")}</h1>
      {profileLoading || needsPasswordSetup ? <p className="text-muted" role="status">{t("Loading...")}</p> : <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
        <p className="panel-subtitle">{t("Your wallet password is required to update your withdrawal address.")}</p>
        <div>
          <p className="field-label">{t("Withdrawal wallet address")}</p>
          <TextField autoComplete="off" placeholder={t("Enter wallet address")} value={walletAddress} onChange={(event) => setWalletAddress(event.target.value)} required />
        </div>
        <div>
          <p className="field-label">{t("Wallet password")}</p>
          <PasswordField placeholder={t("Wallet password")} value={walletPassword} onChange={setWalletPassword} />
        </div>
        {error && <p className="field-error-text" role="alert">{error}</p>}
        {saved && <p role="status">{t("Wallet address updated successfully")}</p>}
        <Button type="submit" disabled={saving}>{saving ? t("Saving...") : t("Save wallet address")}</Button>
      </form>}
    </div>
  );
}
