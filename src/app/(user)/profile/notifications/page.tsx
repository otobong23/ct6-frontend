"use client";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";

export default function NotificationsPage() {
  const { t } = useTranslation();
    return(
        <div className = "dashboard-shell">
            <PageHeader right ={<BackPill href="/profile" />} />
            <p className="placeholder-text">{t("No notifications yet.")}</p>
        </div>
    );
}