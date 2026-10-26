// Group the signed-in user's crew members by referral level.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { BackPill } from "@/components/AuthShell";
import { PageHeader } from "@/components/PageHeader";
import { userApi } from "@/lib/endpoints";
import type { AdminCrewMember, CrewResponse } from "@/lib/types";

const levels = [1, 2, 3] as const;

export default function TeamViewPage() {
  const { t } = useTranslation();
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [crew, setCrew] = useState<CrewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    userApi.crew.get()
      .then((response) => { if (!cancelled) setCrew(response); })
      .catch((requestError) => { if (!cancelled) setError(requestError instanceof Error ? requestError.message : t("Could not load your team")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t]);

  const members: AdminCrewMember[] = crew?.members?.[`level_${level}`] ?? crew?.[`level_${level}`] ?? [];
  const money = (amount: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/team" />} />
      <div className="panel-section">
        <div className="panel-card--center mb-10.75">
          <span className="assets-pill">{t("Team Deposit")}</span>
          <p className="assets-value">{money(crew?.totalCrewDeposits ?? 0)}</p>
          <p className="assets-meta">{t("Total Withdrawal:")} <span className="text-accent">{money(crew?.totalCrewWithdrawals ?? 0)}</span></p>
          <div className="level-tabs">
            {levels.map((currentLevel) => (
              <button key={currentLevel} type="button" className={`level-tab ${level === currentLevel ? "level-tab--active" : ""}`} onClick={() => setLevel(currentLevel)}>
                {t("Level")} {currentLevel} ({crew?.members?.[`level_${currentLevel}`]?.length ?? crew?.[`level_${currentLevel}`]?.length ?? 0})
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-muted text-center">{t("Loading...")}</p>}
        {error && <p className="field-error-text" role="alert">{error}</p>}
        {!loading && !error && members.length === 0 && <p className="text-muted text-center">{t("No members at this level")}</p>}
        {!loading && !error && members.length > 0 && <div className="member-list panel-card">
          {members.map((member) => (
            <div className="member-row" key={member.userID}>
              <span className="member-avatar"><Icon icon="lucide:user" width="18" /><span className="member-dot" /></span>
              <div className="min-w-0 flex-1">
                <p className="member-email">{member.email}</p>
                <p className="member-id">{t("ID:")}{member.userID}</p>
                <p className="text-muted text-xs">{t("Team Deposit")}: {money(member.totalDeposits)} · {t("Total Withdrawal:")} {money(member.totalWithdrawals)}</p>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
