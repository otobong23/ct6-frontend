"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { members } from "@/lib/team";

const levels = [1, 2, 3] as const;

export default function TeamViewPage() {
  const { t } = useTranslation();
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/team" />} />

      <div className="panel-section">
        <div className="panel-card--center mb-10.75">
          <span className="assets-pill">{t("Team Deposit")}</span>
          <p className="assets-value">{t("$134,876,890")}</p>
          <p className="assets-meta">
            {t("Total Withdrawal:")} <span className="text-accent">{t("$97,094,000")}</span>
          </p>
          <div className="level-tabs">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                className={`level-tab ${level === l ? "level-tab--active" : ""}`}
                onClick={() => setLevel(l)}
              >
                {t("Level")} {l}
              </button>
            ))}
          </div>
        </div>

        <div className="member-list panel-card">
          {level === 1 && members.map((m, i) => (
            <div className="member-row" key={i}>
              <span className="member-avatar">
                <Icon icon="lucide:user" width="18" />
                <span className="member-dot" />
              </span>
              <div>
                <p className="member-email">{m.email}</p>
                <p className="member-id">{t("ID:")}{m.id}</p>
              </div>
            </div>
          ))}
          {level === 2 && members.map((m, i) => (
            <div className="member-row" key={i}>
              <span className="member-avatar">
                <Icon icon="lucide:user" width="18" />
                <span className="member-dot" />
              </span>
              <div>
                <p className="member-email">{m.email}</p>
                <p className="member-id">{t("ID:")}{m.id}</p>
              </div>
            </div>
          ))}
          {level === 3 && members.map((m, i) => (
            <div className="member-row" key={i}>
              <span className="member-avatar">
                <Icon icon="lucide:user" width="18" />
                <span className="member-dot" />
              </span>
              <div>
                <p className="member-email">{m.email}</p>
                <p className="member-id">{t("ID:")}{m.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
