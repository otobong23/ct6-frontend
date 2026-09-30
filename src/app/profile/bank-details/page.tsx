"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { PasswordField } from "@/components/PasswordField";
import { Button } from "@/components/Button";

export default function BankDetailsPage() {
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
        <TextField placeholder="Enter Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
        <TextField
          placeholder="Enter account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <TextField
          placeholder="Enter account name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
        <PasswordField placeholder="Create Password" value={password} onChange={setPassword} />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}