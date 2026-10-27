"use client";

import { Icon } from "@iconify/react";
import { formatTransactionDate, formatUSD } from "@/lib/admin-format";
import type { TransactionResponse, TransactionStatus } from "@/lib/types";

const statuses: TransactionStatus[] = ["pending", "completed", "rejected", "failed"];

export function TransactionDetailsModal({
  transaction,
  onClose,
  onStatusChange,
  isUpdating = false,
  errorMessage = "",
}: {
  transaction: TransactionResponse;
  onClose: () => void;
  onStatusChange: (status: TransactionStatus) => void;
  isUpdating?: boolean;
  errorMessage?: string;
}) {
  const userId = transaction.userId;
  const userReference = typeof userId === "string" ? userId : userId?._id ?? userId?.userID ?? "—";
  const userName = typeof userId === "object" && userId
    ? `${userId.firstName ?? ""} ${userId.lastName ?? ""}`.trim()
    : "";
  const fields: Array<[string, string]> = [
    ["Transaction ID", transaction.transactionID || "—"],
    ["Record ID", transaction._id],
    ["User", userName ? `${userName} · ${transaction.email}` : transaction.email || "Unknown user"],
    ["User ID", userReference],
    ["Type", transaction.type.replaceAll("_", " ")],
    ["Amount", `${formatUSD(transaction.amount)}${transaction.currency ? ` · ${transaction.currency}` : ""}`],
    ["Created", formatTransactionDate(transaction.createdAt)],
    ["Reference", transaction.reference || "—"],
    ["Destination wallet", transaction.withdrawWalletAddress || "—"],
    ["Note", transaction.note || "—"],
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3 sm:p-5"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="transaction-details-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#303b50] bg-[#151d2d] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#252f45] px-5 py-4 sm:px-6">
          <div>
            <h2 id="transaction-details-title" className="text-lg font-bold text-white">Transaction details</h2>
            <p className="mt-1 text-xs text-penny-text-muted">{transaction.transactionID || transaction._id}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close transaction details" className="rounded-lg bg-[#0d1624] p-2 text-penny-text-muted hover:text-white">
            <Icon icon="mdi:close" width={20} />
          </button>
        </header>

        <div className="grid gap-px bg-[#252f45] sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="min-w-0 bg-[#151d2d] px-5 py-3 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-penny-text-muted">{label}</p>
              <p className={`mt-1 break-words text-sm ${label === "Destination wallet" && value !== "—" ? "font-mono text-emerald-300" : "text-white"}`}>{value}</p>
            </div>
          ))}
        </div>

        <footer className="space-y-3 px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold text-penny-text-muted">Update status</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                disabled={isUpdating || transaction.status === status}
                onClick={() => onStatusChange(status)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize disabled:cursor-not-allowed disabled:opacity-40 ${transaction.status === status ? "bg-white/10 text-white" : "border border-[#303b50] text-penny-text-muted hover:text-white"}`}
              >
                {isUpdating && transaction.status !== status ? "Saving…" : status === "completed" ? "Mark completed" : status === "rejected" ? "Reject" : status === "failed" ? "Mark failed" : "Set pending"}
              </button>
            ))}
          </div>
          {errorMessage && <p role="alert" className="text-xs text-red-300">{errorMessage}</p>}
        </footer>
      </section>
    </div>
  );
}
