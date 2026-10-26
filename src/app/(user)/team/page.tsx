// Display the signed-in user's referral details and crew totals.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import QR_codeGenerator from "@/components/QR_codeGenerator";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/endpoints";
import type { CrewResponse } from "@/lib/types";
import profileImage from "@/assets/images/profile.svg";

export default function TeamPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [crew, setCrew] = useState<CrewResponse | null>(null);
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const money = (amount: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);
  const referralCode = crew?.ownerReferralCode || user?.userID || "";

  useEffect(() => {
    let cancelled = false;
    userApi.crew.get()
      .then((response) => { if (!cancelled) setCrew(response); })
      .catch((requestError) => { if (!cancelled) setError(requestError instanceof Error ? requestError.message : t("Could not load your team")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t]);

  useEffect(() => {
    if (!referralCode) return;
    setReferralLink(`${window.location.origin}/register?referral_code=${encodeURIComponent(referralCode)}`);
  }, [referralCode]);

  async function copy(value: string, label: string) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setError(t("Could not copy to clipboard"));
    }
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />
      <div className="referral-hero">
        <div className="referral-profile"><Image src={profileImage} alt={t("Profile")} loading="eager" className="object-cover w-full" /></div>
        <div className="qr-placeholder">{referralLink && <QR_codeGenerator value={referralLink} />}</div>
      </div>

      <div className="field-box">
        <div className="px-4.25">
          <p className="field-label">{t("Referral code")}</p>
          <div className="referral-box">
            <span className="font-semibold text-base">{loading ? t("Loading...") : referralCode || t("No referral code available")}</span>
            <button type="button" className="copy-btn" aria-label={t("Copy referral code")} onClick={() => copy(referralCode, "code")} disabled={!referralCode}><Icon icon="fa7-solid:copy" width="24" /></button>
          </div>
          <p className="field-label" style={{ marginTop: 14 }}>{t("Referral Link")}</p>
          <div className="referral-box">
            <span className="referral-link-text">{referralLink || t("Loading...")}</span>
            <button type="button" className="copy-btn" aria-label={t("Copy referral link")} onClick={() => copy(referralLink, "link")} disabled={!referralLink}><Icon icon="fa7-solid:copy" width="24" /></button>
          </div>
          {copied && <p className="text-muted" role="status">{copied === "code" ? t("Referral code copied") : t("Referral link copied")}</p>}
          {error && <p className="field-error-text" role="alert">{error}</p>}
        </div>

        <div className="field-box-mini">
          <p className="referral-note">{t("referralDescription", { defaultValue: "Invite friends to make their first deposit and you will receive a three-level commission reward." })}</p>
          <div className="commission-tags">
            {[{ level: 1, pct: 5 }, { level: 2, pct: 2 }, { level: 3, pct: 1 }].map((tier, index) => (
              <span className={`commission-tag ${index === 1 ? "self-center" : index === 2 ? "self-end" : ""}`} key={tier.level}>
                {t("LVL")} {tier.level} {t("Commission")} <span className="p-2 bg-white/10 rounded-full">{tier.pct}%</span>
              </span>
            ))}
          </div>
          {crew && <div className="mt-4 grid grid-cols-2 gap-3">
            <div><p className="field-label">{t("Team members")}</p><p className="font-semibold">{crew.totalMembers}</p></div>
            <div><p className="field-label">{t("Team Deposit")}</p><p className="font-semibold">{money(crew.totalCrewDeposits)}</p></div>
            <div><p className="field-label">{t("Total Withdrawal:")}</p><p className="font-semibold">{money(crew.totalCrewWithdrawals)}</p></div>
            <div><p className="field-label">{t("Team transactions")}</p><p className="font-semibold">{crew.totalCrewTransactions}</p></div>
          </div>}
        </div>
      </div>

      <Link href="/team/view" className="btn-primary btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70%" style={{ marginTop: 16 }}>{t("View Team")}</Link>
      <p className="footer-copyright">{t("2026, CT6 Copyright")}</p>
      <BottomNav />
    </div>
  );
}
