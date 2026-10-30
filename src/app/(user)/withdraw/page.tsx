// Submit withdrawals through the authenticated orders API.

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BackPill } from "@/components/AuthShell";
import { PageHeader } from "@/components/PageHeader";
import { PasswordField } from "@/components/PasswordField";
import { StatusOverlay } from "@/components/StatusOverlay";
import { useAuth } from "@/context/AuthContext";
import { transactionApi } from "@/lib/endpoints";

const quickAmounts = ["50", "100", "200", "500", "1000"];

export default function WithdrawPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: profileLoading, refreshProfile } = useAuth();
  const [amount, setAmount] = useState("");
  const [walletPassword, setWalletPassword] = useState("");
  const [step, setStep] = useState<"form" | "result">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const enteredAmount = Number(amount);
  const withdrawalFee = Number.isFinite(enteredAmount) && enteredAmount > 0 ? enteredAmount * 0.1 : 0;

  useEffect(() => {
    if (profileLoading || !user) return;
    if (!user.walletPassword) {
      router.replace("/profile/security?returnTo=%2Fwithdraw");
    } else if (!user.walletAddress?.trim()) {
      router.replace("/profile/bind-wallet?returnTo=%2Fwithdraw");
    }
  }, [profileLoading, user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError(t("Enter a valid withdrawal amount"));
      return;
    }
    if (!walletPassword) {
      setError(t("Enter your wallet password"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await transactionApi.orders.withdraw({ amount: value, walletPassword });
      await refreshProfile().catch(() => {});
      setStep("result");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : t("Could not submit withdrawal");
      if (message.toLowerCase().includes("bind a wallet address")) {
        router.replace("/profile/bind-wallet?returnTo=%2Fwithdraw");
      } else if (message.toLowerCase().includes("create a wallet password")) {
        router.replace("/profile/security?returnTo=%2Fwithdraw");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("form");
    setAmount("");
    setWalletPassword("");
    setError("");
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/home" />} />
      {step === "form" && profileLoading ? <p className="text-muted" role="status">{t("Loading...")}</p> : step === "form" && <div className="panel-card">
        <h2 className="panel-title">{t("Withdraw")}</h2>
        <p className="panel-subtitle">{t("Enter exact Withdrawal amount below")}</p>
        {user && <p className="text-muted">{t("Available balance")}: {new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(user.balance)}</p>}
        <div className="my-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">{t("Withdrawal fees")}</p>
          <div className="mt-2 grid gap-2 text-sm">
            <p>{t("Minimum withdrawal amount")}: <strong>12 USDT</strong></p>
            <p>{t("Withdrawal fee rate")}: <strong>10%</strong></p>
            <p>{t("Withdrawal fee")}: <strong>{withdrawalFee.toFixed(2)} USDT</strong></p>
          </div>
          <p className="mt-3 text-sm text-muted">{t("Arrival Amount = Withdrawal Amount - Withdrawal Amount x Fee Rate - Gas Fee (1 USDT).")}</p>
        </div>
        <p className="mb-4 text-sm text-amber-300">{t("Please Make sure the Address You Enter Suppors BEP20 Transfers. Using Other Networks May Result in Failed Deposit or Withdrawal")}</p>
        <form onSubmit={handleSubmit} className="stack">
          <div className="field"><span className="field-prefix">{t("$")}</span><input className="field-input" type="number" min="12" step="0.01" placeholder={t("Enter Withdrawal amount")} value={amount} onChange={(event) => setAmount(event.target.value)} required /></div>
          {user?.walletAddress && <p className="panel-subtitle">{t("Withdrawal address")}: <span className="break-all">{user.walletAddress}</span></p>}
          <div>
            <p className="field-label">{t("Wallet password")}</p>
            <PasswordField placeholder={t("Wallet password")} value={walletPassword} onChange={setWalletPassword} />
          </div>
          <div className="quick-amount-row">
            {quickAmounts.map((quickAmount) => <button type="button" key={quickAmount} className="quick-amount" onClick={() => setAmount(quickAmount)}>{quickAmount}</button>)}
          </div>
          {error && <p className="field-error-text" role="alert">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? t("Loading...") : t("Continue")}</button>
        </form>
        <Remarks />
      </div>}
      {step === "result" && <StatusOverlay kind="success" title={t("Withdrawal submitted")} subtitle={t("Your withdrawal request is pending review.")} onContinue={reset} />}
    </div>
  );
}

function Remarks() {
  const { t } = useTranslation();
  return <div className="remark-list">
    <p className="remark-title">{t("Remark")}</p>
    <ol>
      <li>{t("Please do not add assets to accounts other than the official account, otherwise the assets will not be retrieved.")}</li>
      <li>{t("The Withdrawal amount must be exactly the same as the actual order amount.")}</li>
      <li>{t("withdrawalArrivalNote", { defaultValue: "The Withdrawal arrival time is based on the bank arrival time. It usually arrives within 5-10 minutes. If it does not arrive after more than 48 hours, please contact the manager for verification." })}</li>
    </ol>
  </div>;
}
