"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { BackPill } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/endpoints";

export default function ProfileSettingsPage() {
  const { t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setPhone(user?.phone ?? "");
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await userApi.profile.update({ firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() });
      await refreshProfile();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("Could not update profile"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/profile" />} />
      <h1 className="section-title" style={{ marginTop: 20 }}>{t("Profile settings")}</h1>
      <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
        <div>
          <p className="field-label">{t("First name")}</p>
          <TextField autoComplete="given-name" placeholder={t("First name")} value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
        </div>
        <div>
          <p className="field-label">{t("Last name")}</p>
          <TextField autoComplete="family-name" placeholder={t("Last name")} value={lastName} onChange={(event) => setLastName(event.target.value)} />
        </div>
        <div>
          <p className="field-label">{t("Phone number")}</p>
          <TextField autoComplete="tel" type="tel" placeholder={t("Phone number")} value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
        {error && <p className="field-error-text" role="alert">{error}</p>}
        {saved && <p role="status">{t("Profile updated successfully")}</p>}
        <Button type="submit" disabled={saving}>{saving ? t("Saving...") : t("Save")}</Button>
      </form>
    </div>
  );
}
