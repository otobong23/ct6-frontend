"use client";

import { adminApi } from "@/lib/endpoints";
import { useQuery } from "@tanstack/react-query";
import type { TransactionType } from "@/lib/types";

export function useAdminTransactions(page: number = 1, limit: number = 20, type?: TransactionType | "all") {
  return useQuery({
    queryKey: ["admin", "transactions", page, limit, type],
    queryFn: () => adminApi.transactions.list({page, limit, type}),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
  });
}
