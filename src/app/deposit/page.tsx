"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { StatusOverlay } from "@/components/StatusOverlay";
import QR_codeGenerator from "@/components/QR_codeGenerator";

const quickAmounts = ["50", "100", "200", "500", "1000"];

export default function DepositPage() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [txid, setTxid] = useState("");
  const [step, setStep] = useState<"amount" | "confirm" | "result">("amount");
  const [result, setResult] = useState<"success" | "fail">("success");

  const [QrcodeValue, setQrcodeValue] = useState('48394u83uc483jjds884334')

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
          <h2 className="panel-title">{t("Deposit")}</h2>
          <p className="panel-subtitle">{t("Enter exact deposit amount below")}</p>
          <form onSubmit={handleContinue} className="stack">
            <div className="field">
              <span className="field-prefix">{t("$")}</span>
              <input
                className="field-input"
                placeholder={t("Enter deposit amount")}
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
              {t("Continue")}
            </button>
          </form>
          <Remarks />
        </div>
      )}

      {step === "confirm" && (
        <div className="panel-card">
          <h2 className="panel-title">{t("Confirm transaction")}</h2>
          <div className="confirm-amount-box">
            <p className="confirm-amount-label">{t("Amount to Deposit")}</p>
            <p className="confirm-amount-value">{t("$")}{Number(amount || 0).toLocaleString()}{t(".00")}</p>
            <p className="confirm-amount-network">
              {t("Network")} <span className="text-[#0AA521]">{t("USDT")}</span>
            </p>
          </div>
          <div className="qr-box">
            <div className="qr-placeholder" />
          </div>
          <div className="flex justify-center">
            <div className="p-5.5 bg-[#282C33]/80 rounded-[12px] shadow-(--pill-box-shadow)">
              <QR_codeGenerator value="QrcodeValue" size={207} />
            </div>
          </div>
          <p className="field-label" style={{ marginTop: 12 }}>
            {t("Wallet Address")}
          </p>
          <p className="wallet-address-value">{t("48394uB3uc483jjds884334")}</p>
          <div className="coin-network-row">
            <div>
              <span className="text-muted">{t("Coin")}</span>
              <span>{t("Tether")}</span>
            </div>
            <div>
              <span className="text-muted">{t("Network")}</span>
              <span>{t("USDT")}</span>
            </div>
          </div>
          <p className="field-label" style={{ marginTop: 12 }}>
            {t("TXID")}
          </p>
          <div className="field">
            <input
              className="field-input"
              placeholder={t("Enter transaction ID")}
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
            />
          </div>
          <button type="button" className="upload-box">
            <Icon icon="lucide:plus" width="18" />
          </button>
          <p className="upload-note">
            {t("Please upload screenshot of the transfer (including amount, time, and address).")}
          </p>
          <button type="button" className="btn-primary" onClick={handleSure}>
            {t("Sure")}
          </button>
        </div>
      )}

      {step === "result" && result === "success" && (
        <StatusOverlay kind="success" title={t("Upload Successful")} onContinue={() => setStep("amount")} />
      )}
      {step === "result" && result === "fail" && (
        <StatusOverlay
          kind="fail"
          title={t("Deposit Unsuccessful")}
          subtitle={t("Something went wrong try again")}
          onContinue={() => setStep("amount")}
        />
      )}
    </div>
  );
}

function Remarks() {
  const { t } = useTranslation();
  return (
    <div className="remark-list">
      <p className="remark-title">{t("Remark")}</p>
      <ol>
        <li>{t("Please do not add assets to accounts other than the official account, otherwise the assets will not be retrieved.")}</li>
        <li>{t("The Deposit amount must be exactly the same as the actual order amount.")}</li>
        <li>
          {t("depositArrivalNote", { defaultValue: "The Deposit arrival time is based on the bank arrival time. It usually arrives within 5-10 minutes. If it does not arrive after more than 48 hours, please contact the manager for verification." })}
        </li>
      </ol>
    </div>
  );
}
