// Show the signed-in user's active earners and the time left on each position.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import RadarChartWidget from "@/components/RadarChartWidget";
import { useAuth } from "@/context/AuthContext";
import { transactionApi } from "@/lib/endpoints";
import type { EarnerResponse } from "@/lib/types";

function remainingTime(expiresAt: string, now: number) {
  const seconds = Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m ${remainder}s`;
}

export default function AiTradePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [earners, setEarners] = useState<EarnerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const money = (amount: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);

  useEffect(() => {
    let cancelled = false;
    transactionApi.getActiveEarner()
      .then((response) => { if (!cancelled) setEarners(response.earners); })
      .catch((requestError) => { if (!cancelled) setError(requestError instanceof Error ? requestError.message : t("Could not load active trades")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [t]);

  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />
      <div className="assets-card mt-6! bg-transparent! bg-linear-to-b! from-[#0A0A1B]! to-[rgba(10,10,27,0)]! rounded-b-none! py-10!" style={{ marginTop: 16 }}>
        <span className="assets-pill">{t("Total Assets")}</span>
        <p className="assets-value">{money(user?.balance ?? 0)}</p>
        <p className="assets-meta">{t("Total Deposit:")} <span className="text-[#6FBAFC]">{money(user?.totalDeposit ?? 0)}</span> &ensp; {t("Total Withdrawal:")} <span className="text-[#188F0D]">{money(user?.totalWithdraw ?? 0)}</span></p>
        <div className="flex justify-center items-center flex-col mt-12">
          <RadarChartWidget />
          <p className="assets-pill mb-2.25 mt-12">{t("Trading")}</p>
        </div>
        {loading && <p className="text-muted text-center">{t("Loading...")}</p>}
        {error && <p className="field-error-text" role="alert">{error}</p>}
        {!loading && !error && earners.length === 0 && <p className="text-muted text-center">{t("No active trades")}</p>}
        {earners.map((earner) => (
          <div className="panel-card" key={earner._id} style={{ marginTop: 14 }}>
            <p className="panel-title">{t("Time Remaining:")} <span className="text-[#33A721]">{remainingTime(earner.expiresAt, now)}</span></p>
            <p className="panel-subtitle">{t("Amount invested")}: {money(earner.amountInvested)}</p>
            <p className="panel-subtitle">{t("Daily earnings")}: {money(earner.nextEarningAmount)} ({earner.dailyAveragePercentage}%)</p>
            <p className="panel-subtitle">{t("Next earning")}: {new Date(earner.nextEarningDate).toLocaleString()}</p>
          </div>
        ))}
        <div className="profile-actions-row">
          <Link href="/deposit" className="btn-primary btn-primary--half btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70% rounded-full!">{t("Deposit")}</Link>
          <Link href="/withdraw" className="btn-primary btn-primary--half btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70% rounded-full!">{t("Withdraw")}</Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
