"use client";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { PasswordField } from "@/components/PasswordField";
import { userApi } from "@/lib/endpoints";

export default function SecurityPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"create" | "change">("create");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    if (newPassword.length < 8) {
      setError(t("Wallet password must be at least 8 characters"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("Passwords do not match"));
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        await userApi.walletPassword.create({ newPassword });
      } else {
        if (!currentPassword) {
          setError(t("Enter your current wallet password"));
          setSaving(false);
          return;
        }
        await userApi.walletPassword.change({ currentPassword, newPassword });
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
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
      <div className="profile-actions-row" style={{ marginTop: 20 }}>
        <button type="button" className={mode === "create" ? "btn-primary btn-primary--half" : "btn-secondary btn-primary--half"} onClick={() => { setMode("create"); setError(""); setSaved(false); }}>{t("Create password")}</button>
        <button type="button" className={mode === "change" ? "btn-primary btn-primary--half" : "btn-secondary btn-primary--half"} onClick={() => { setMode("change"); setError(""); setSaved(false); }}>{t("Change password")}</button>
      </div>
      <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
        {mode === "change" && <div>
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
        {saved && <p role="status">{t("Wallet password saved successfully")}</p>}
        <Button type="submit" disabled={saving}>{saving ? t("Saving...") : t("Save")}</Button>
      </form>
    </div>
  );
}
