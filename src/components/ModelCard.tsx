"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import type { Model } from "@/lib/models";
import { useTranslation } from "react-i18next";

export function ModelCard({
  model,
  userCrewMembers = 0,
  onActivate,
  activateHref,
}: {
  model: Model;
  userCrewMembers?: number;
  onActivate?: (m: Model) => void;
  activateHref?: string;
}) {
  const { t } = useTranslation();
  const locked = userCrewMembers < model.requiredCrewMembers;
  return (
    <div className="model-card">
      <div className="model-card-top">
        <span className="model-name">{t(model.name)}</span>
        <span className="model-badge">
          <Icon icon="codicon:verified-filled" width="20" />
        </span>
      </div>
      <p className="model-percent">{model.percent}</p>
      <div className="model-tags">
        <span className="model-tag">{t("Daily earnings")}</span>
        <span className="model-tag">{t(model.days)}</span>
      </div>
      <div className="model-range">
        <div className="model-range-item">
          <p className="model-range-label">{t("Min")} <br />{t("investment")} <br />{t("amount:")}</p>
          <p className="model-range-value">{model.min}</p>
        </div>
        <div className="model-range-item">
          <p className="model-range-label">{t("Max")} <br />{t("investment")} <br />{t("amount:")}</p>
          <p className="model-range-value">{model.max}</p>
        </div>
      </div>
      <div className="model-line"></div>
      {locked ? (
        <>
          <p className="model-locked-note">{t("requiredCrewMembers members required to activate plan", { requiredCrewMembers: model.requiredCrewMembers })}</p>
          <button type="button" className="btn-locked" disabled>
            <Icon icon="fontisto:locked" width="16" />
            {t("Locked")}
          </button>
        </>
      ) : activateHref ? (
        <>
          {model.requiredCrewMembers > 0 && <p className="model-locked-note">{t("Level 1 crew requirement met: {{current}} / {{required}}", { current: userCrewMembers, required: model.requiredCrewMembers })}</p>}
          <Link href={activateHref} className="btn-primary btn-link">{t("Activate")}</Link>
        </>
      ) : (
        <>
          {model.requiredCrewMembers > 0 && <p className="model-locked-note">{t("Level 1 crew requirement met: {{current}} / {{required}}", { current: userCrewMembers, required: model.requiredCrewMembers })}</p>}
          <button type="button" className="btn-primary" onClick={() => onActivate?.(model)}>{t("Activate")}</button>
        </>
      )}
    </div>
  );
}
