"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { PasswordField } from "@/components/PasswordField";
import { Button } from "@/components/Button";

export default function BankDetailsPage() {
  const { t } = useTranslation();
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/profile" />} />
      <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
        <TextField placeholder={t("Enter Bank name")} value={bankName} onChange={(e) => setBankName(e.target.value)} />
        <TextField
          placeholder={t("Enter account number")}
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <TextField
          placeholder={t("Enter account name")}
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
        <PasswordField placeholder={t("Create Password")} value={password} onChange={setPassword} />
        <Button type="submit">{t("Save")}</Button>
      </form>
    </div>
  );
}