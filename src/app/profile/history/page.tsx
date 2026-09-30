import { PageHeader } from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { transactions } from "@/lib/history";

export default function HistoryPage() {
  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/profile" />} />
      <div className="history-list">
        {transactions.map((t, i) => (
          <div className="history-row" key={i}>
            <div>
              <p className="history-title">{t.label}</p>
              <p className="history-time">{t.time}</p>
            </div>
            <div className="history-right">
              <p className="history-amount">{t.amount}</p>
              <p className="history-date">{t.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}