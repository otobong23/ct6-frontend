"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { PasswordField } from "@/components/PasswordField";
import { StatusOverlay } from "@/components/StatusOverlay";

const quickAmounts = ["50", "100", "200", "500", "1000"];

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"form" | "result">("form");
  const [result, setResult] = useState<"success" | "fail">("success");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !password) return;
    setResult(Number(amount) <= 5000 ? "success" : "fail");
    setStep("result");
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/home" />} />

      {step === "form" && (
        <div className="panel-card">
          <h2 className="panel-title">Withdraw</h2>
          <p className="panel-subtitle">Enter exact Withdrawal amount below</p>
          <form onSubmit={handleSubmit} className="stack">
            <div className="field">
              <span className="field-prefix">$</span>
              <input
                className="field-input"
                placeholder="Enter Withdrawal amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <PasswordField placeholder="Create Password" value={password} onChange={setPassword} />
            <div className="quick-amount-row">
              {quickAmounts.map((a) => (
                <button
                  type="button"
                  key={a}
                  className="quick-amount"
                  onClick={() => setAmount(a)}
                >
                  {a}
                </button>
              ))}
            </div>
            <button type="submit" className="btn-primary">
              Continue
            </button>
          </form>
          <Remarks />
        </div>
      )}

      {step === "result" && result === "success" && (
        <StatusOverlay
          kind="success"
          title="Withdrawal Successful"
          subtitle="Your wallet will be credited within 72 hours"
          onContinue={() => setStep("form")}
        />
      )}
      {step === "result" && result === "fail" && (
        <StatusOverlay
          kind="fail"
          title="Failed"
          subtitle="Something went wrong try again"
          onContinue={() => setStep("form")}
        />
      )}
    </div>
  );
}

function Remarks() {
  return (
    <div className="remark-list">
      <p className="remark-title">Remark</p>
      <ol>
        <li>Please do not add assets to accounts other than the official account, otherwise the assets will not be retrieved.</li>
        <li>The Withdrawal amount must be exactly the same as the actual order amount.</li>
        <li>
          The Withdrawal arrival time is based on the bank arrival time. It usually arrives
          within 5-10 minutes. If it does not arrive after more than 48 hours, please contact the
          manager for verification.
        </li>
      </ol>
    </div>
  );
}