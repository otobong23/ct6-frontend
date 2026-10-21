"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { adminApi } from "@/lib/endpoints";
import { formatUSD } from "@/lib/admin-format";
import type { AdminCrewMember, CrewResponse } from "@/lib/types";

const PAGE_SIZE = 20;
type CrewLevel = 1 | 2 | 3;

function getMembers(crew: CrewResponse, level: CrewLevel): AdminCrewMember[] {
  return crew.members?.[`level_${level}`] ?? crew[`level_${level}`] ?? [];
}

export default function AdminCrewsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedUserID, setSelectedUserID] = useState("");
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const totalQuery = useQuery({
    queryKey: ["admin", "crews", "total"],
    queryFn: () => adminApi.crews.total(),
  });
  const listQuery = useQuery({
    queryKey: ["admin", "crews", "list", page],
    queryFn: () => adminApi.crews.list({ page, limit: PAGE_SIZE }),
    enabled: !activeSearch,
  });
  const searchQuery = useQuery({
    queryKey: ["admin", "crews", "search", activeSearch],
    queryFn: () => adminApi.crews.search({ keyword: activeSearch }),
    enabled: Boolean(activeSearch),
  });
  const detailQuery = useQuery({
    queryKey: ["admin", "crews", "detail", selectedUserID],
    queryFn: () => adminApi.crews.getUserCrew({ userID: selectedUserID }),
    enabled: Boolean(selectedUserID),
  });
  const detachMutation = useMutation({
    mutationFn: (userID: string) => adminApi.crews.detachUser({ userID }),
    onSuccess: async () => {
      setNotice("Crew member detached.");
      setErrorMessage("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "crews"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
      ]);
    },
    onError: (error) => {
      setNotice("");
      setErrorMessage(error instanceof Error ? error.message : "Could not detach this member.");
    },
  });

  const crews = activeSearch ? searchQuery.data ?? [] : listQuery.data?.crews ?? [];
  const isLoading = activeSearch ? searchQuery.isLoading : listQuery.isLoading;
  const currentPage = listQuery.data?.page ?? page;
  const totalPages = listQuery.data?.totalPages ?? 1;
  const selectedCrew = detailQuery.data;
  const membersByLevel = useMemo(() => selectedCrew
    ? ([1, 2, 3] as const).map((level) => ({ level, members: getMembers(selectedCrew, level) }))
    : [], [selectedCrew]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setNotice("");
    setErrorMessage("");
    setActiveSearch(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  }

  function detach(userID: string) {
    if (window.confirm(`Detach ${userID} from their crew?`)) {
      setNotice("");
      setErrorMessage("");
      detachMutation.mutate(userID);
    }
  }

  return (
    <main className="space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">Crews</h1>
          <p className="mt-1 text-xs text-penny-text-muted sm:text-sm">
            {totalQuery.isLoading ? "Loading crew count…" : `${(totalQuery.data ?? 0).toLocaleString()} crews`}
          </p>
        </div>
      </header>

      <form onSubmit={submitSearch} className="flex gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search crews by owner, email, or referral code</span>
          <Icon icon="mdi:magnify" width={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-penny-text-muted" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by user ID, email, or referral code"
            className="w-full rounded-xl border border-[#252f45] bg-[#151d2d] py-2.5 pl-10 pr-3 text-sm text-white outline-none"
          />
        </label>
        <button type="submit" className="rounded-xl bg-[#00d4a1] px-4 text-sm font-semibold text-[#0d1624]">Search</button>
        {activeSearch && <button type="button" onClick={clearSearch} className="rounded-xl border border-[#252f45] px-4 text-sm text-white">Clear</button>}
      </form>

      {notice && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{notice}</p>}
      {errorMessage && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{errorMessage}</p>}
      {(listQuery.error || searchQuery.error || totalQuery.error) && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {(listQuery.error ?? searchQuery.error ?? totalQuery.error) instanceof Error
            ? (listQuery.error ?? searchQuery.error ?? totalQuery.error as Error).message
            : "Could not load crews."}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#252f45] bg-[#151d2d]">
        <div className="grid grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(5rem,1fr))_auto] gap-3 border-b border-[#252f45] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-penny-text-muted sm:px-5">
          <span>Crew owner</span><span>Members</span><span>Deposits</span><span>Withdrawals</span><span> </span>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-sm text-penny-text-muted">Loading crews…</div>
        ) : crews.length === 0 ? (
          <div className="p-8 text-center text-sm text-penny-text-muted">{activeSearch ? "No matching crews." : "No crews found."}</div>
        ) : crews.map((crew) => (
          <article key={crew.userID} className="grid grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(5rem,1fr))_auto] items-center gap-3 border-b border-[#252f45] px-4 py-4 last:border-0 sm:px-5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{crew.ownerEmail || crew.userID}</p>
              <p className="truncate text-xs text-penny-text-muted">{crew.userID} · {crew.ownerReferralCode || "No referral code"}</p>
            </div>
            <span className="text-sm text-white">{crew.totalMembers}</span>
            <span className="text-sm text-emerald-300">{formatUSD(crew.totalCrewDeposits)}</span>
            <span className="text-sm text-white">{formatUSD(crew.totalCrewWithdrawals)}</span>
            <button type="button" onClick={() => { setSelectedUserID(crew.userID); setNotice(""); setErrorMessage(""); }} className="flex items-center gap-1 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
              <Icon icon="mdi:eye-outline" width={16} /> View
            </button>
          </article>
        ))}
        {!activeSearch && totalPages > 1 && (
          <footer className="flex items-center justify-between border-t border-[#252f45] px-4 py-3 text-sm text-penny-text-muted">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-[#252f45] px-3 py-1.5 text-white disabled:opacity-40">Previous</button>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-[#252f45] px-3 py-1.5 text-white disabled:opacity-40">Next</button>
            </div>
          </footer>
        )}
      </section>

      {selectedUserID && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 p-3" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedUserID(""); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="crew-detail-title" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#252f45] bg-[#151d2d] p-4 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="crew-detail-title" className="text-lg font-bold text-white">Crew details</h2>
                {selectedCrew && <p className="mt-1 text-sm text-penny-text-muted">{selectedCrew.ownerEmail} · {selectedCrew.userID} · Referral {selectedCrew.ownerReferralCode}</p>}
              </div>
              <button type="button" onClick={() => setSelectedUserID("")} aria-label="Close crew details" className="rounded-lg p-2 text-penny-text-muted hover:text-white"><Icon icon="mdi:close" width={20} /></button>
            </div>
            {detailQuery.isLoading ? <p className="py-8 text-center text-sm text-penny-text-muted">Loading crew…</p> : detailQuery.error ? (
              <p role="alert" className="py-8 text-center text-sm text-red-300">{detailQuery.error instanceof Error ? detailQuery.error.message : "Could not load this crew."}</p>
            ) : selectedCrew && (
              <>
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["Members", selectedCrew.totalMembers.toLocaleString()],
                    ["Deposits", formatUSD(selectedCrew.totalCrewDeposits)],
                    ["Withdrawals", formatUSD(selectedCrew.totalCrewWithdrawals)],
                    ["Transactions", selectedCrew.totalCrewTransactions.toLocaleString()],
                  ].map(([label, value]) => <div key={label} className="rounded-xl border border-[#252f45] bg-[#0d1624] p-3"><p className="text-[10px] text-penny-text-muted">{label}</p><p className="mt-1 text-sm font-semibold text-white">{value}</p></div>)}
                </div>
                <div className="space-y-5">
                  {membersByLevel.map(({ level, members }) => (
                    <div key={level}>
                      <h3 className="mb-2 text-sm font-semibold text-white">Level {level} <span className="font-normal text-penny-text-muted">({members.length})</span></h3>
                      {members.length === 0 ? <p className="rounded-xl bg-[#0d1624] px-3 py-4 text-xs text-penny-text-muted">No members at this level.</p> : (
                        <div className="overflow-hidden rounded-xl border border-[#252f45]">
                          {members.map((member) => (
                            <div key={`${member.userID}-${level}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-[#252f45] bg-[#0d1624] px-3 py-3 last:border-0 sm:grid-cols-[minmax(0,1fr)_repeat(3,auto)_auto]">
                              <div className="min-w-0"><p className="truncate text-xs font-medium text-white">{member.email}</p><p className="text-[10px] text-penny-text-muted">{member.userID}{member.joinedAt ? ` · Joined ${new Date(member.joinedAt).toLocaleDateString()}` : ""}</p></div>
                              <span className="hidden text-xs text-emerald-300 sm:block">Deposits {formatUSD(member.totalDeposits)}</span>
                              <span className="hidden text-xs text-penny-text-muted sm:block">Withdrawals {formatUSD(member.totalWithdrawals)}</span>
                              <span className="hidden text-xs text-penny-text-muted sm:block">{member.transactionCount} tx</span>
                              <button type="button" disabled={detachMutation.isPending} onClick={() => detach(member.userID)} className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 disabled:opacity-50">Detach</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
