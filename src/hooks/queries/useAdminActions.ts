"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, copyTradingApi, transactionApi } from "@/lib/endpoints";
import type { UpdateTransactionStatusDto } from "@/lib/types";

// ── User mutations ────────────────────────────────────────────────────────────

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      // Only send fields accepted by the backend's PATCH /admin/users/:id endpoint.
      const backendWhitelist: Array<keyof typeof data> = [
        "isAdmin", "isSuspended", "phone", "firstName", "lastName", "walletAddress", "walletPassword", "balance", "totalDeposit", "totalWithdraw", "transactionCount"
      ];
      const apiPayload: Record<string, unknown> = {};
      for (const key of backendWhitelist) {
        if (key in data && data[key] !== undefined) {
          apiPayload[key] = data[key];
        }
      }

      const settingWalletPassword = typeof apiPayload.walletPassword === "string" && apiPayload.walletPassword.length > 0;
      // A wallet password must be persisted by the API, never as a local override.
      if (settingWalletPassword) {
        await adminApi.users.update(id, apiPayload as Parameters<typeof adminApi.users.update>[1]);
      }

      // Persist non-secret UI overrides. Store only a boolean password status, never the password.
      if (typeof window !== "undefined") {
        try {
          const key = `user_override_${id}`;
          const existing = JSON.parse(localStorage.getItem(key) || "{}");
          const safeExisting = { ...existing };
          const safeData = { ...data };
          delete safeExisting.walletPassword;
          delete safeData.walletPassword;
          const hasWalletPassword = settingWalletPassword || Boolean(existing.walletPassword);
          localStorage.setItem(key, JSON.stringify({
            ...safeExisting,
            ...safeData,
            ...(hasWalletPassword ? { walletPassword: true } : {}),
          }));
        } catch {
          // ignore
        }
      }

      if (Object.keys(apiPayload).length > 0 && !settingWalletPassword) {
        try {
          await adminApi.users.update(id, apiPayload as Parameters<typeof adminApi.users.update>[1]);
        } catch {
          // Ignore — localStorage override already applied above.
        }
      }

      const safeData = { ...data };
      delete safeData.walletPassword;
      return {
        ...safeData,
        ...(settingWalletPassword ? { walletPassword: true } : {}),
      };
    },
    onSuccess: (_result, variables) => {
      const { walletPassword, ...safeData } = variables.data;
      const cacheData = {
        ...safeData,
        ...(typeof walletPassword === "string" && walletPassword.length > 0 ? { walletPassword: true } : {}),
      };
      qc.setQueriesData({ queryKey: ["admin", "users"] }, (old: { data?: { _id?: string; userID?: string; [key: string]: unknown }[] } | undefined) => {
        if (!old || !old.data || !Array.isArray(old.data)) return old;
        return {
          ...old,
          data: old.data.map((u) =>
            u._id === variables.id || u.userID === variables.id
              ? { ...u, ...cacheData }
              : u
          ),
        };
      });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      qc.invalidateQueries({ queryKey: ["copy-trading-portfolio"] });
      qc.invalidateQueries({ queryKey: ["admin", "user-copy-trade-portfolio", variables.id] });
    },
  });
}

export function useToggleUserSuspend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isSuspended }: { id: string; isSuspended: boolean }) =>
      adminApi.users.update(id, { isSuspended }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useToggleUserAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isAdmin }: { id: string; isAdmin: boolean }) =>
      adminApi.users.update(id, { isAdmin }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// ── Transaction mutations ─────────────────────────────────────────────────────

export function useUpdateTransactionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionStatusDto }) =>
      adminApi.transactions.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "transactions"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}



export function useUpdateCopyTrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof adminApi.copyTrading.updatePlan>[1] }) =>
      adminApi.copyTrading.updatePlan(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["copy-trading"] });
    },
  });
}

export function useCreateCopyTrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof adminApi.copyTrading.createPlan>[0]) =>
      adminApi.copyTrading.createPlan(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["copy-trading"] });
    },
  });
}

export function useDeleteCopyTrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.copyTrading.deletePlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["copy-trading"] });
    },
  });
}

// export function useToggleCopyTradeActive() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
//       adminApi.copyTrading.updatePlan(id, isActive),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["copy-trading"] });
//     },
//   });
// }

// ── User-facing transaction create ───────────────────────────────────────────

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof transactionApi.create>[0]) => transactionApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transaction"] });
      qc.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}

// ── Admin user holdings queries ───────────────────────────────────────────────

export function useAdminUserCopyTrades(userId: string) {
  return useQuery({
    queryKey: ["admin", "users", userId, "copy-trades"],
    queryFn: () => adminApi.copyTrading.userPurchases(userId),
    enabled: !!userId,
  });
}
