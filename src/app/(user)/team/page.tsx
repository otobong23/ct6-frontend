"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/PageHeader";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { commissionTiers, referral } from "@/lib/team";
import profileImage from "@/assets/images/profile.svg";
import Image from "next/image";
import QR_codeGenerator from "@/components/QR_codeGenerator";
import { useState } from "react";

export default function TeamPage() {
  const { t } = useTranslation();
  const [QR_codeValue, setQR_codeValue] = useState("https://dasad.io/#/register?invite_code=737777")
  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />

      <div className="referral-hero">
        <div className="referral-profile">
          <Image src={profileImage} alt={t("Profile")} loading="eager" className="object-cover w-full" />
        </div>
        <div className="qr-placeholder">
          <QR_codeGenerator value={QR_codeValue} />
        </div>
      </div>

      <div className="field-box">
        <div className="px-4.25">
          <p className="field-label">{t("Referral code")}</p>
          <div className="referral-box">
            <span className="font-semibold text-base">{referral.code}</span>
            <button type="button" className="copy-btn" aria-label={t("Copy referral code")}>
                <Icon icon="fa7-solid:copy" width="24" />
            </button>
          </div>

          <p className="field-label" style={{ marginTop: 14 }}>
            {t("Referral Link")}
          </p>
          <div className="referral-box">
            <span className="referral-link-text">{referral.link}</span>
            <button type="button" className="copy-btn" aria-label={t("Copy referral link")}>
                <Icon icon="fa7-solid:copy" width="24" />
            </button>
          </div>
        </div>

        <div className="field-box-mini">
          <p className="referral-note">
            {t("referralDescription", { defaultValue: "Invite friends to make their first deposit and you will receive a three-level commission reward." })}
          </p>

          <div className="commission-tags">
            {commissionTiers.map((tier, i) => (
              <span className={`commission-tag ${i === 1 ? 'self-center' : i === 2 ? 'self-end' : ''}`} key={tier.level}>
                {t("LVL")} {tier.level} {t("Commission")} <span className="p-2 bg-white/10 rounded-full">{tier.pct}%</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <Link href="/team/view" className="btn-primary btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70%" style={{ marginTop: 16 }}>
        {t("View Team")}
      </Link>

      <p className="footer-copyright">{t("2026, CT6 Copyright")}</p>

      <BottomNav />
    </div>
  );
}
