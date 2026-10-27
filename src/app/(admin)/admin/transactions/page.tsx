"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { useAdminTransactions } from "@/hooks/queries/useAdminTransactions";
import { TransactionDetailsModal } from "@/components/admin/TransactionDetailsModal";
import { adminApi } from "@/lib/endpoints";
import { formatTransactionDate, formatUSD } from "@/lib/admin-format";
import type { TransactionResponse, TransactionStatus } from "@/lib/types";

const PAGE_SIZE = 25;
export default function AdminTransactionsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const { data, isLoading, error } = useAdminTransactions(page, PAGE_SIZE);
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TransactionStatus }) =>
      adminApi.transactions.updateStatus(id, { status }),
    onSuccess: async () => {
      setActionError("");
      await queryClient.invalidateQueries({ queryKey: ["admin", "transactions"] });
    },
    onError: (mutationError) => {
      setActionError(mutationError instanceof Error ? mutationError.message : "Could not update transaction status.");
    },
  });

  const transactions: TransactionResponse[] = data?.data ?? [];
  const pagination = data?.pagination;
  const pageCount = pagination?.totalPages ?? 1;
  const selectedTransaction = transactions.find((transaction) => transaction._id === selectedTransactionId);

  function changeStatus(transaction: TransactionResponse, status: TransactionStatus) {
    if (status === transaction.status) return;
    setActionError("");
    updateStatus.mutate({ id: transaction._id, status });
  }

  return (
    <main className="space-y-5 p-4 sm:p-6">
      <header>
        <h1 className="text-xl font-bold text-white sm:text-2xl">Transactions</h1>
        <p className="mt-1 text-sm text-penny-text-muted">
          {pagination ? `${pagination.total.toLocaleString()} transactions` : "Review and update transaction status"}
        </p>
      </header>

      {actionError && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{actionError}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error instanceof Error ? error.message : "Could not load transactions."}</p>}

      <section className="overflow-hidden rounded-2xl border border-[#252f45] bg-[#151d2d]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#0d1624] text-xs uppercase tracking-wide text-penny-text-muted">
              <tr>
                <th scope="col" className="px-4 py-3">User / transaction</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3 text-right">Amount</th>
                <th scope="col" className="px-4 py-3">Date</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252f45]">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-penny-text-muted">Loading transactions…</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-penny-text-muted">No transactions found.</td></tr>
              ) : transactions.map((transaction) => (
                <tr key={transaction._id} className="text-white">
                  <td className="px-4 py-3"><p className="font-medium">{transaction.email || "Unknown user"}</p><p className="mt-0.5 text-xs text-penny-text-muted">{transaction.transactionID || transaction._id}</p></td>
                  <td className="px-4 py-3 capitalize">{transaction.type.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatUSD(transaction.amount)}</td>
                  <td className="px-4 py-3 text-penny-text-muted">{formatTransactionDate(transaction.createdAt)}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-white/5 px-2.5 py-1 text-xs capitalize text-penny-text-muted">{transaction.status}</span></td>
                  <td className="px-4 py-3"><button type="button" onClick={() => { setSelectedTransactionId(transaction._id); setActionError(""); }} className="inline-flex items-center gap-1 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300"><Icon icon="mdi:eye-outline" width={15} /> View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="flex items-center justify-between border-t border-[#252f45] px-4 py-3 text-sm text-penny-text-muted">
          <span>{pagination ? `Page ${pagination.page} of ${pageCount}` : `Page ${page}`}</span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1 || isLoading} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-lg border border-[#303b50] px-3 py-2 text-white disabled:opacity-40">Previous</button>
            <button type="button" disabled={page >= pageCount || isLoading} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="rounded-lg border border-[#303b50] px-3 py-2 text-white disabled:opacity-40">Next</button>
          </div>
        </footer>
      </section>
      {selectedTransaction && <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransactionId(null)}
        onStatusChange={(status) => changeStatus(selectedTransaction, status)}
        isUpdating={updateStatus.isPending && updateStatus.variables?.id === selectedTransaction._id}
        errorMessage={actionError}
      />}
    </main>
  );
}
