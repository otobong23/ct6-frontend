"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";

export default function HelpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/profile" />} />
      <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
        <TextField placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea
          className="textarea-field"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}