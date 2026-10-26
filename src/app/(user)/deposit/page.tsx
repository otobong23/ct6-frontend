// Generate a deposit invoice for the automatic payment review service.

"use client";

import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { BackPill } from "@/components/AuthShell";
import { PageHeader } from "@/components/PageHeader";
import QR_codeGenerator from "@/components/QR_codeGenerator";
import { transactionApi } from "@/lib/endpoints";
import type { UserOrderResponse } from "@/lib/types";
import Link from "next/link";

const quickAmounts = ["50", "100", "200", "500", "1000"];

export default function DepositPage() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [order, setOrder] = useState<UserOrderResponse | null>(null);
  const [step, setStep] = useState<"amount" | "payment">("amount");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError(t("Enter a valid deposit amount"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await transactionApi.orders.generateDepositAddress({ amount: value });
      setOrder(response.order);
      setStep("payment");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("Could not create a deposit order"));
    } finally {
      setLoading(false);
    }
  }

  async function copyAddress() {
    if (!order?.address) return;
    try {
      await navigator.clipboard.writeText(order.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(t("Could not copy to clipboard"));
    }
  }

  function reset() {
    setStep("amount");
    setOrder(null);
    setAmount("");
    setError("");
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/home" />} />

      {step === "amount" && <div className="panel-card">
        <h2 className="panel-title">{t("Deposit")}</h2>
        <p className="panel-subtitle">{t("Enter exact deposit amount below")}</p>
        <form onSubmit={handleContinue} className="stack">
          <div className="field">
            <span className="field-prefix">{t("$")}</span>
            <input className="field-input" type="number" min="0.01" step="0.01" placeholder={t("Enter deposit amount")} value={amount} onChange={(event) => setAmount(event.target.value)} required />
          </div>
          <div className="quick-amount-row">
            {quickAmounts.map((quickAmount) => <button type="button" key={quickAmount} className="quick-amount" onClick={() => setAmount(quickAmount)}>{quickAmount}</button>)}
          </div>
          {error && <p className="field-error-text" role="alert">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? t("Loading...") : t("Continue")}</button>
        </form>
        <Remarks />
      </div>}

      {step === "payment" && order && <div className="panel-card">
        <h2 className="panel-title">{t("Deposit details")}</h2>
        <div className="confirm-amount-box">
          <p className="confirm-amount-label">{t("Amount to Deposit")}</p>
          <p className="confirm-amount-value">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(order.displayAmount)}</p>
          <p className="confirm-amount-network">{t("Network")} <span className="text-[#0AA521]">{order.network}</span></p>
        </div>
        {order.address && <div className="flex justify-center">
          <div className="p-5.5 bg-[#282C33]/80 rounded-[12px] shadow-(--pill-box-shadow)"><QR_codeGenerator value={order.address} size={207} /></div>
        </div>}
        <p className="field-label" style={{ marginTop: 12 }}>{t("Wallet Address")}</p>
        <div className="referral-box"><p className="wallet-address-value break-all">{order.address}</p><button type="button" className="copy-btn" onClick={copyAddress} aria-label={t("Copy wallet address")}>{t(copied ? "Copied" : "Copy")}</button></div>
        <div className="coin-network-row">
          <div><span className="text-muted">{t("Coin")}</span><span>{order.coin}</span></div>
          <div><span className="text-muted">{t("Network")}</span><span>{order.network}</span></div>
        </div>
        <p className="panel-subtitle">{t("Your deposit will be reviewed automatically after payment is received.")}</p>
        <Link href="/home" className="btn-primary btn-link">{t("Done")}</Link>
        <button type="button" className="btn-secondary" onClick={reset}>{t("Create another deposit")}</button>
        <Remarks />
      </div>}
    </div>
  );
}

function Remarks() {
  const { t } = useTranslation();
  return <div className="remark-list">
    <p className="remark-title">{t("Remark")}</p>
    <ol>
      <li>{t("Please do not add assets to accounts other than the official account, otherwise the assets will not be retrieved.")}</li>
      <li>{t("The Deposit amount must be exactly the same as the actual order amount.")}</li>
      <li>{t("depositArrivalNote", { defaultValue: "The Deposit arrival time is based on the bank arrival time. It usually arrives within 5-10 minutes. If it does not arrive after more than 48 hours, please contact the manager for verification." })}</li>
    </ol>
  </div>;
}
