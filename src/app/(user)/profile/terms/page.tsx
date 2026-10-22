"use client";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";

export default function TermsPage() {
  const { t } = useTranslation();
    return(
        <div className = "dashboard-shell">
            <PageHeader right ={<BackPill href="/profile" />} />
            <div className="info-card">
                <h3 className="info-title">{t("Terms & Conditions")}</h3>
                <p className="info-body">{t("Terms content goes here.")}</p>
            </div>
        </div>
    )
}