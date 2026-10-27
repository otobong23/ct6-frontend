"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TransactionDetailsModal } from "@/components/admin/TransactionDetailsModal";
import { useAdminUsers } from "@/hooks/queries/useAdminUsers";
import { useAdminTransactions } from "@/hooks/queries/useAdminTransactions";
import { useCopyTrading } from "@/hooks/queries/useCopyTrading";
import { adminApi } from "@/lib/endpoints";
import { formatTransactionDate, formatUSD } from "@/lib/admin-format";
import type { TransactionResponse, TransactionStatus } from "@/lib/types";

const statsStyle = "rounded-2xl border border-[#252f45] bg-gradient-to-br from-[#151d2d] to-[#1b2a40] p-4 sm:p-5";

export default function AdminOverviewPage() {
  const queryClient = useQueryClient();
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [transactionActionError, setTransactionActionError] = useState("");
  const usersQuery = useAdminUsers(1, 1);
  const transactionsQuery = useAdminTransactions(1, 8);
  const setupsQuery = useCopyTrading();
  const crewsQuery = useQuery({ queryKey: ["admin", "crews", "total"], queryFn: adminApi.crews.total });
  const activeTradesQuery = useQuery({
    queryKey: ["admin", "copy-trade-purchases", "overview"],
    queryFn: () => adminApi.copyTrading.listPurchases({ page: 1, limit: 1, status: "active" }),
  });
  const updateTransactionStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TransactionStatus }) =>
      adminApi.transactions.updateStatus(id, { status }),
    onSuccess: async () => {
      setTransactionActionError("");
      await queryClient.invalidateQueries({ queryKey: ["admin", "transactions"] });
    },
    onError: (error) => setTransactionActionError(error instanceof Error ? error.message : "Could not update transaction status."),
  });

  const totalUsers = usersQuery.data?.pagination.total;
  const totalTransactions = transactionsQuery.data?.pagination.total;
  const setupCount = setupsQuery.data?.length;
  const activeTrades = activeTradesQuery.data?.pagination.total;
  const stats = [
    { label: "Total users", value: totalUsers, icon: "mdi:users-outline", accent: "#00d4a1", loading: usersQuery.isLoading, failed: usersQuery.isError },
    { label: "Crews", value: crewsQuery.data, icon: "mdi:account-group-outline", accent: "#a78bfa", loading: crewsQuery.isLoading, failed: crewsQuery.isError },
    { label: "Transactions", value: totalTransactions, icon: "mdi:swap-horizontal", accent: "#60a5fa", loading: transactionsQuery.isLoading, failed: transactionsQuery.isError },
    { label: "Trader setups", value: setupCount, icon: "mdi:chart-line", accent: "#f5c518", loading: setupsQuery.isLoading, failed: setupsQuery.isError },
    { label: "Active copy trades", value: activeTrades, icon: "mdi:account-cash-outline", accent: "#fb923c", loading: activeTradesQuery.isLoading, failed: activeTradesQuery.isError },
  ];
  const recentTransactions: TransactionResponse[] = transactionsQuery.data?.data ?? [];
  const selectedTransaction = recentTransactions.find((transaction) => transaction._id === selectedTransactionId);

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-xl font-bold text-white sm:text-2xl">Overview</h1>
        <p className="mt-1 text-sm text-penny-text-muted">Current platform activity from the admin APIs.</p>
      </header>

      <section aria-label="Platform totals" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 sm:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={statsStyle}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs text-penny-text-muted">{stat.label}</p>
              <Icon icon={stat.icon} width={20} style={{ color: stat.accent }} />
            </div>
            <p className="text-2xl font-extrabold text-white">{stat.loading ? "…" : stat.failed ? "—" : (stat.value ?? 0).toLocaleString()}</p>
            {stat.label === "Crews" && <Link href="/admin/crews" className="mt-2 inline-block text-xs text-emerald-300">Manage crews</Link>}
            {stat.label === "Transactions" && <Link href="/admin/transactions" className="mt-2 inline-block text-xs text-emerald-300">Review transactions</Link>}
            {stat.label.includes("copy") || stat.label === "Trader setups" ? <Link href="/admin/copy-trading" className="mt-2 inline-block text-xs text-emerald-300">Open copy trading</Link> : null}
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#252f45] bg-[#151d2d]">
        <div className="flex items-center justify-between gap-3 border-b border-[#252f45] px-4 py-4 sm:px-6">
          <div>
            <h2 className="font-bold text-white">Recent transactions</h2>
            <p className="mt-1 text-xs text-penny-text-muted">Latest records returned by the admin transactions endpoint.</p>
          </div>
          <Link href="/admin/transactions" className="shrink-0 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#0d1624] text-xs uppercase tracking-wide text-penny-text-muted"><tr><th scope="col" className="px-4 py-3">User / ID</th><th scope="col" className="px-4 py-3">Type</th><th scope="col" className="px-4 py-3 text-right">Amount</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3">Date</th><th scope="col" className="px-4 py-3">Details</th></tr></thead>
            <tbody className="divide-y divide-[#252f45]">
              {transactionsQuery.isLoading ? <tr><td colSpan={6} className="px-4 py-10 text-center text-penny-text-muted">Loading transactions…</td></tr>
                : transactionsQuery.error ? <tr><td colSpan={6} className="px-4 py-10 text-center text-red-300">{transactionsQuery.error instanceof Error ? transactionsQuery.error.message : "Could not load transactions."}</td></tr>
                  : recentTransactions.length === 0 ? <tr><td colSpan={6} className="px-4 py-10 text-center text-penny-text-muted">No transactions yet.</td></tr>
                    : recentTransactions.map((transaction) => <tr key={transaction._id} className="text-white">
                      <td className="px-4 py-3"><p>{transaction.email || "Unknown user"}</p><p className="text-xs text-penny-text-muted">{transaction.transactionID || transaction._id}</p></td>
                      <td className="px-4 py-3 capitalize">{transaction.type.replaceAll("_", " ")}</td>
                      <td className="px-4 py-3 text-right">{formatUSD(transaction.amount)}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-white/5 px-2.5 py-1 text-xs capitalize text-penny-text-muted">{transaction.status}</span></td>
                      <td className="px-4 py-3 text-xs text-penny-text-muted">{formatTransactionDate(transaction.createdAt)}</td>
                      <td className="px-4 py-3"><button type="button" onClick={() => { setSelectedTransactionId(transaction._id); setTransactionActionError(""); }} className="inline-flex items-center gap-1 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300"><Icon icon="mdi:eye-outline" width={15} /> View</button></td>
                    </tr>)}
            </tbody>
          </table>
        </div>
      </section>
      {selectedTransaction && <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransactionId(null)}
        onStatusChange={(status) => updateTransactionStatus.mutate({ id: selectedTransaction._id, status })}
        isUpdating={updateTransactionStatus.isPending && updateTransactionStatus.variables?.id === selectedTransaction._id}
        errorMessage={transactionActionError}
      />}
    </main>
  );
}
