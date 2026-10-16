"use client";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { transactions } from "@/lib/history";

export default function HistoryPage() {
  const { t } = useTranslation();
  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/profile" />} />
      <div className="history-list">
        {transactions.map((transaction, i) => (
          <div className="history-row" key={i}>
            <div>
              <p className="history-title">{t(transaction.label)}</p>
              <p className="history-time">{transaction.time}</p>
            </div>
            <div className="history-right">
              <p className="history-amount">{transaction.amount}</p>
              <p className="history-date">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
