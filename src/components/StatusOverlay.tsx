"use client";

import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

export function StatusOverlay({
  kind,
  title,
  subtitle,
  confirmRows,
  onContinue,
  onCancel,
}: {
  kind: "confirm" | "success" | "fail";
  title: string;
  subtitle?: string;
  confirmRows?: { label: string; value: string }[];
  onContinue: () => void;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="overlay-backdrop">
      <div className="overlay-card">
        {kind === "success" && (
          <div className="overlay-icon overlay-icon--success">
            <Icon icon="lucide:check" width="28" />
          </div>
        )}
        {kind === "fail" && (
          <div className="overlay-icon overlay-icon--fail">
            <Icon icon="lucide:x" width="28" />
          </div>
        )}
        <h3 className="overlay-title">{title}</h3>
        {subtitle && <p className="overlay-subtitle">{subtitle}</p>}

        {confirmRows && (
          <div className="overlay-rows">
            {confirmRows.map((r) => (
              <div className="overlay-row" key={r.label}>
                <span>{r.label}</span>
                <span>{r.value}</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className={`btn-primary ${kind === "fail" ? "btn-primary--danger" : ""}`}
          onClick={onContinue}
        >
          {t("Continue")}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {t("Cancel")}
          </button>
        )}
      </div>
    </div>
  );
}
