"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackPill } from "@/components/AuthShell";
import { PageHeader } from "@/components/PageHeader";
import { transactionApi } from "@/lib/endpoints";
import type { TransactionResponse } from "@/lib/types";

const PAGE_SIZE = 20;
const debitTypes = new Set(["withdraw", "withdrawal", "buy", "copy_trade", "copy_trade_add_funds"]);

export default function HistoryPage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    transactionApi.list({ page, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) return;
        setTransactions(response.data);
        setTotalPages(response.pagination.totalPages);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : t("Could not load transaction history"));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, t]);

  function formatAmount(transaction: TransactionResponse) {
    const currency = transaction.currency || "USD";
    const amount = new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(Math.abs(transaction.amount));
    return `${debitTypes.has(transaction.type) ? "−" : "+"}${amount}`;
  }

  function formatType(type: string) {
    return t(type.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "));
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<BackPill href="/profile" />} />
      <h1 className="section-title" style={{ marginTop: 18 }}>{t("History")}</h1>
      {loading && <p className="text-muted text-center" role="status">{t("Loading...")}</p>}
      {error && <p className="field-error-text" role="alert">{error}</p>}
      {!loading && !error && transactions.length === 0 && <p className="text-muted text-center">{t("No transactions yet.")}</p>}
      {!loading && !error && transactions.length > 0 && <>
        <div className="history-list">
          {transactions.map((transaction) => {
            const date = new Date(transaction.createdAt);
            return <div className="history-row" key={transaction._id}>
              <div>
                <p className="history-title">{formatType(transaction.type)}</p>
                <p className="history-time">{Number.isNaN(date.getTime()) ? "—" : date.toLocaleTimeString()}</p>
                <p className="text-muted text-xs">{t("Status")}: {t(transaction.status)}</p>
                {transaction.reference && <p className="text-muted text-xs">{t("Reference")}: {transaction.reference}</p>}
              </div>
              <div className="history-right">
                <p className="history-amount">{formatAmount(transaction)}</p>
                <p className="history-date">{Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString()}</p>
              </div>
            </div>;
          })}
        </div>
        {totalPages > 1 && <div className="profile-actions-row" style={{ marginTop: 16 }}>
          <button type="button" className="btn-secondary btn-primary--half" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>{t("Previous")}</button>
          <span className="text-muted self-center">{page} / {totalPages}</span>
          <button type="button" className="btn-secondary btn-primary--half" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>{t("Next")}</button>
        </div>}
      </>}
    </div>
  );
}
