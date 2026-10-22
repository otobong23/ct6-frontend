"use client";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";

const sections = [
  {
    title: "How it works",
    bodyKey: "guideStartBody",
    body: "Getting started is straightforward and transparent. Create an account, complete a quick verification, and gain access to your dashboard. From there, you can fund your wallet, choose an investment option, and monitor performance in real time. Your assets are managed through a secure, structured system designed to prioritize clarity, safety, and long-term value. Everything—from funding to returns—is visible, trackable, and built for ease.",
  },
  {
    title: "How to Deposit",
    bodyKey: "guideDepositBody",
    body: "Funding your account takes just a few steps: Log in to your dashboard, navigate to the deposit section, select your preferred payment method, enter the amount you wish to deposit, confirm the transaction. Once completed, your wallet balance updates automatically and is ready for use. All deposits are processed through secure channels to ensure protection of your funds.",
  },
  {
    title: "How to withdrawal",
    bodyKey: "guideWithdrawBody",
    body: "Withdrawing your funds is just as seamless: Head to the withdrawal section in your dashboard, enter the amount you wish to withdraw, select your payout destination. After confirmation your request is processed and sent within the stated timeline. You stay in control at all times, with clear status updates from request to completion.",
  },
];

export default function HowItWorksPage() {
  const { t } = useTranslation();
  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/profile" />} />
      <div className="info-list">
        {sections.map((s) => (
          <div className="info-card" key={s.title}>
            <h3 className="info-title">{t(s.title)}</h3>
            <p className="info-body">{t(s.bodyKey, { defaultValue: s.body })}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
