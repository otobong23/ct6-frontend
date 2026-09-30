import Link from "next/link";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/PageHeader";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { commissionTiers, referral } from "@/lib/team";

export default function TeamPage() {
  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />

      <div className="referral-hero">
        <div className="referral-coin">T</div>
        <div className="qr-placeholder qr-placeholder--sm" />
      </div>

      <p className="field-label">Referral code</p>
      <div className="referral-box">
        <span>{referral.code}</span>
        <button type="button" className="copy-btn" aria-label="Copy referral code">
          <Icon icon="lucide:copy" width="16" />
        </button>
      </div>

      <p className="field-label" style={{ marginTop: 14 }}>
        Referral Link
      </p>
      <div className="referral-box">
        <span className="referral-link-text">{referral.link}</span>
        <button type="button" className="copy-btn" aria-label="Copy referral link">
          <Icon icon="lucide:copy" width="16" />
        </button>
      </div>

      <p className="referral-note">
        Invite friends to make their first deposit and you will receive a three-level commission
        reward.
      </p>

      <div className="commission-tags">
        {commissionTiers.map((t) => (
          <span className="commission-tag" key={t.level}>
            LVL {t.level} Commission {t.pct}%
          </span>
        ))}
      </div>

      <Link href="/team/view" className="btn-primary btn-link" style={{ marginTop: 16 }}>
        View Team
      </Link>

      <p className="footer-copyright">2026, CT6 Copyright</p>

      <BottomNav />
    </div>
  );
}