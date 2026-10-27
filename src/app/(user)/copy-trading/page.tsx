"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { copyTradingApi } from "@/lib/endpoints";
import type { CopyTradePurchaseResponse } from "@/lib/types";
import type { FormEvent } from "react";

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
}

function formatDate(value?: string) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "—";
  return new Date(value).toLocaleString();
}

function PurchaseCard({ purchase, onAddFunds }: { purchase: CopyTradePurchaseResponse; onAddFunds: () => void }) {
  const pnl = purchase.pnl ?? 0;
  const pnlPositive = pnl >= 0;
  const isActive = purchase.status === "active";
  const currency = purchase.currency || "USD";
  const investmentRange = `${formatMoney(purchase.minInvestment, currency)} – ${formatMoney(purchase.maxInvestment, currency)}`;

  return (
    <article className="rounded-2xl border border-[#252f45] bg-[#151d2d] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Icon icon="mdi:chart-line" width={22} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-white">{purchase.traderName}</h2>
            <p className="mt-1 text-xs capitalize text-penny-text-muted">{purchase.riskLevel} risk · {purchase.duration}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${isActive ? "bg-emerald-400/10 text-emerald-300" : "bg-white/10 text-penny-text-muted"}`}>
          {purchase.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-[#0d1624] p-3">
          <p className="text-[10px] text-penny-text-muted">Amount invested</p>
          <p className="mt-1 text-sm font-bold text-white">{formatMoney(purchase.amountInvested, currency)}</p>
        </div>
        <div className="rounded-xl bg-[#0d1624] p-3">
          <p className="text-[10px] text-penny-text-muted">Live PnL</p>
          <p className={`mt-1 text-sm font-bold ${pnlPositive ? "text-emerald-300" : "text-red-300"}`}>{pnlPositive ? "+" : ""}{formatMoney(pnl, currency)}</p>
        </div>
        <div className="rounded-xl bg-[#0d1624] p-3">
          <p className="text-[10px] text-penny-text-muted">Return</p>
          <p className={`mt-1 text-sm font-bold ${pnlPositive ? "text-emerald-300" : "text-red-300"}`}>
            {purchase.amountInvested > 0 ? `${pnlPositive ? "+" : ""}${((pnl / purchase.amountInvested) * 100).toFixed(2)}%` : "—"}
          </p>
        </div>
        <div className="rounded-xl bg-[#0d1624] p-3">
          <p className="text-[10px] text-penny-text-muted">Daily average</p>
          <p className="mt-1 text-sm font-semibold text-white">{purchase.dailyAveragePercentage}%</p>
        </div>
        <div className="rounded-xl bg-[#0d1624] p-3">
          <p className="text-[10px] text-penny-text-muted">Win rate</p>
          <p className="mt-1 text-sm font-semibold text-white">{purchase.winrate}%</p>
        </div>
        <div className="rounded-xl bg-[#0d1624] p-3">
          <p className="text-[10px] text-penny-text-muted">Leverage</p>
          <p className="mt-1 text-sm font-semibold text-white">{purchase.leverage}x</p>
        </div>
        <div className="rounded-xl bg-[#0d1624] p-3">
          <p className="text-[10px] text-penny-text-muted">Investment range</p>
          <p className="mt-1 text-xs font-semibold text-white">{investmentRange}</p>
        </div>
        <div className="rounded-xl bg-[#0d1624] p-3">
          <p className="text-[10px] text-penny-text-muted">Total assets</p>
          <p className="mt-1 text-sm font-semibold text-white">{formatMoney(purchase.totalAssets, currency)}</p>
        </div>
        <div className="rounded-xl bg-[#0d1624] p-3">
          <p className="text-[10px] text-penny-text-muted">Copies</p>
          <p className="mt-1 text-sm font-semibold text-white">{purchase.purchases.toLocaleString()}</p>
        </div>
        <div className="col-span-2 rounded-xl bg-[#0d1624] p-3 sm:col-span-3">
          <p className="text-[10px] text-penny-text-muted">Expires</p>
          <p className="mt-1 text-sm font-semibold text-white">{formatDate(purchase.expiredAt)}</p>
        </div>
        {purchase.liquidatedAt && <div className="col-span-2 rounded-xl bg-[#0d1624] p-3 sm:col-span-3">
          <p className="text-[10px] text-penny-text-muted">Liquidated</p>
          <p className="mt-1 text-sm font-semibold text-white">{formatDate(purchase.liquidatedAt)}</p>
          {purchase.liquidationAmount !== undefined && <p className="mt-1 text-xs text-penny-text-muted">Payout {formatMoney(purchase.liquidationAmount, currency)}{purchase.liquidationFee !== undefined ? ` · Fee ${formatMoney(purchase.liquidationFee, currency)}` : ""}</p>}
        </div>}
      </div>

      {isActive && <button type="button" onClick={onAddFunds} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#35D7A2] to-[#04A180] px-4 py-3 text-sm font-bold text-[#04170f]">
        <Icon icon="mdi:plus-circle-outline" width={19} /> Add funds
      </button>}
    </article>
  );
}

export default function MyCopyTradesPage() {
  const queryClient = useQueryClient();
  const { refreshProfile } = useAuth();
  const [fundingPurchase, setFundingPurchase] = useState<CopyTradePurchaseResponse | null>(null);
  const [amount, setAmount] = useState("");
  const [fundError, setFundError] = useState("");
  const [feedback, setFeedback] = useState("");
  const purchasesQuery = useQuery({
    queryKey: ["copy-trading", "my-purchases"],
    queryFn: copyTradingApi.myPurchases,
    staleTime: 30_000,
  });
  const addFundsMutation = useMutation({
    mutationFn: ({ purchaseId, amountInvested }: { purchaseId: string; amountInvested: number }) =>
      copyTradingApi.addFunds(purchaseId, { amountInvested }),
    onSuccess: async (result) => {
      setFundError("");
      setFundingPurchase(null);
      setAmount("");
      setFeedback(`Funds added to your trade. Transaction ${result.transaction.transactionID || result.transaction._id} is recorded.`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["copy-trading", "my-purchases"] }),
        refreshProfile().catch(() => {}),
      ]);
    },
    onError: (error) => setFundError(error instanceof Error ? error.message : "Could not add funds to this trade."),
  });

  const purchases = purchasesQuery.data ?? [];

  function openAddFunds(purchase: CopyTradePurchaseResponse) {
    setFundingPurchase(purchase);
    setAmount("");
    setFundError("");
    setFeedback("");
  }

  function submitAddFunds(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amountInvested = Number(amount);
    if (!Number.isFinite(amountInvested) || amountInvested <= 0) {
      setFundError("Enter an amount greater than zero.");
      return;
    }
    if (!fundingPurchase || fundingPurchase.status !== "active") return;
    setFundError("");
    addFundsMutation.mutate({ purchaseId: fundingPurchase._id, amountInvested });
  }

  return (
    <main className="dashboard-shell !pb-28">
      <PageHeader right={<AccountMenu />} />
      <section className="px-4 pb-6 pt-5">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-white">My copy trades</h1>
          <p className="mt-1 text-sm text-penny-text-muted">Review your positions, performance, and funding details.</p>
        </div>

        {feedback && <p role="status" className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{feedback}</p>}
        {purchasesQuery.isLoading && <p role="status" className="py-10 text-center text-sm text-penny-text-muted">Loading your copy trades…</p>}
        {purchasesQuery.error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{purchasesQuery.error instanceof Error ? purchasesQuery.error.message : "Could not load your copy trades."}</p>}
        {!purchasesQuery.isLoading && !purchasesQuery.error && purchases.length === 0 && (
          <div className="rounded-2xl border border-[#252f45] bg-[#151d2d] px-5 py-10 text-center">
            <Icon icon="mdi:chart-timeline-variant" width={38} className="mx-auto text-penny-text-muted" />
            <p className="mt-3 text-sm font-semibold text-white">No copy trades yet</p>
            <p className="mt-1 text-xs text-penny-text-muted">Browse available traders to start your first trade.</p>
            <Link href="/models" className="mt-4 inline-flex rounded-xl bg-emerald-400/10 px-4 py-2.5 text-xs font-semibold text-emerald-300">Browse traders</Link>
          </div>
        )}
        {purchases.length > 0 && <div className="grid gap-4 lg:grid-cols-2">
          {purchases.map((purchase) => <PurchaseCard key={purchase._id} purchase={purchase} onAddFunds={() => openAddFunds(purchase)} />)}
        </div>}
      </section>

      {fundingPurchase && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !addFundsMutation.isPending) setFundingPurchase(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="add-funds-title" className="w-full max-w-md rounded-2xl border border-[#252f45] bg-[#151d2d] p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 id="add-funds-title" className="text-lg font-bold text-white">Add funds</h2>
              <p className="mt-1 text-xs text-penny-text-muted">{fundingPurchase.traderName} · Current amount {formatMoney(fundingPurchase.amountInvested, fundingPurchase.currency || "USD")}</p>
            </div>
            <button type="button" disabled={addFundsMutation.isPending} onClick={() => setFundingPurchase(null)} aria-label="Close add funds dialog" className="rounded-lg bg-[#0d1624] p-2 text-penny-text-muted hover:text-white disabled:opacity-50"><Icon icon="mdi:close" width={19} /></button>
          </div>
          <form onSubmit={submitAddFunds} className="space-y-4">
            <label htmlFor="add-funds-amount" className="block text-xs font-semibold text-penny-text-muted">Amount to add ({fundingPurchase.currency || "USD"})</label>
            <input
              id="add-funds-amount"
              type="number"
              min="0.01"
              step="any"
              required
              autoFocus
              value={amount}
              onChange={(event) => { setAmount(event.target.value); setFundError(""); }}
              placeholder="Enter amount"
              className="w-full rounded-xl border border-[#303b50] bg-[#0d1624] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
            />
            {fundError && <p role="alert" className="text-xs text-red-300">{fundError}</p>}
            <div className="flex gap-3 pt-1">
              <button type="button" disabled={addFundsMutation.isPending} onClick={() => setFundingPurchase(null)} className="flex-1 rounded-xl border border-[#303b50] px-4 py-3 text-sm font-semibold text-penny-text-muted disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={addFundsMutation.isPending || !amount} className="flex-1 rounded-xl bg-gradient-to-r from-[#35D7A2] to-[#04A180] px-4 py-3 text-sm font-bold text-[#04170f] disabled:opacity-50">{addFundsMutation.isPending ? "Adding funds…" : "Confirm"}</button>
            </div>
          </form>
        </section>
      </div>}
      <BottomNav />
    </main>
  );
}
