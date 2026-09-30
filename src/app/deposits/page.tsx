"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { StatusOverlay } from "@/components/StatusOverlay";

const quickAmounts = ["50", "100", "200", "500", "1000"];

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [txid, setTxid] = useState("");
  const [step, setStep] = useState<"amount" | "confirm" | "result">("amount");
  const [result, setResult] = useState<"success" | "fail">("success");

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;
    setStep("confirm");
  }

  function handleSure() {
    setResult(txid.trim() ? "success" : "fail");
    setStep("result");
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/home" />} />

      {step === "amount" && (
        <div className="panel-card">
          <h2 className="panel-title">Deposit</h2>
          <p className="panel-subtitle">Enter exact deposit amount below</p>
          <form onSubmit={handleContinue} className="stack">
            <div className="field">
              <span className="field-prefix">$</span>
              <input
                className="field-input"
                placeholder="Enter deposit amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="numeric"
              />
            </div>
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

      {step === "confirm" && (
        <div className="panel-card">
          <h2 className="panel-title">Confirm transaction</h2>
          <div className="confirm-amount-box">
            <p className="confirm-amount-label">Amount to Deposit</p>
            <p className="confirm-amount-value">${Number(amount || 0).toLocaleString()}.00</p>
            <p className="confirm-amount-network">
              Network <span className="text-accent">USDT</span>
            </p>
          </div>
          <div className="qr-box">
            <div className="qr-placeholder" />
          </div>
          <p className="field-label" style={{ marginTop: 12 }}>
            Wallet Address
          </p>
          <p className="wallet-address-value">48394uB3uc483jjds884334</p>
          <div className="coin-network-row">
            <div>
              <span className="text-muted">Coin</span>
              <span>Tether</span>
            </div>
            <div>
              <span className="text-muted">Network</span>
              <span>USDT</span>
            </div>
          </div>
          <p className="field-label" style={{ marginTop: 12 }}>
            TXID
          </p>
          <div className="field">
            <input
              className="field-input"
              placeholder="Enter transaction ID"
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
            />
          </div>
          <button type="button" className="upload-box">
            <Icon icon="lucide:plus" width="18" />
          </button>
          <p className="upload-note">
            Please upload screenshot of the transfer (including amount, time, and address).
          </p>
          <button type="button" className="btn-primary" onClick={handleSure}>
            Sure
          </button>
        </div>
      )}

      {step === "result" && result === "success" && (
        <StatusOverlay kind="success" title="Upload Successful" onContinue={() => setStep("amount")} />
      )}
      {step === "result" && result === "fail" && (
        <StatusOverlay
          kind="fail"
          title="Deposit Unsuccessful"
          subtitle="Something went wrong try again"
          onContinue={() => setStep("amount")}
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
        <li>The Deposit amount must be exactly the same as the actual order amount.</li>
        <li>
          The Deposit arrival time is based on the bank arrival time. It usually arrives within
          5-10 minutes. If it does not arrive after more than 48 hours, please contact the manager
          for verification.
        </li>
      </ol>
    </div>
  );
}