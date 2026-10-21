"use client";

import { adminApi } from "@/lib/endpoints";
import { useQuery } from "@tanstack/react-query";

export function useAdminTransactions(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["admin", "transactions", page, limit],
    queryFn: () => adminApi.transactions.list({page, limit}),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
  });
}
