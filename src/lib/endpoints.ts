import { api } from "./client";
import type {
  AdminCopyTradePurchaseListResponse,
  AdminCopyTradePurchaseQuery,
  AdminCrewListResponse,
  AdminCrewQuery,
  AdminTransactionListResponse,
  AdminUserCrewQuery,
  AdminUserListResponse,
  AdminUserResponse,
  ApiMessageResponse,
  AuthResponse,
  BuyCopyTradingDto,
  CopyTradeActionResponse,
  CopyTradeLiquidationResponse,
  CopyTradePurchaseResponse,
  CopyTradingResponse,
  CreateCopyTradingDto,
  CreateEarnerResponse,
  CreateTransactionDto,
  CreateUserOrderDto,
  CrewResponse,
  DepositAddressResponse,
  DepositConfirmationResponse,
  DetachUserDto,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  KeywordQuery,
  LiquidateCopyTradingDto,
  LoginDto,
  PaginationQuery,
  ProviderSignInDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignUpDto,
  SuccessMessageResponse,
  TransactionResponse,
  UpdateAdminUserDto,
  UpdateCopyTradingDto,
  UpdateCopyTradePurchaseDto,
  UpdateProfileDto,
  UpdateTransactionStatusDto,
  UserProfile,
  UserTransactionListResponse,
  WithdrawDto,
  WithdrawResponse,
} from "./types";

function queryString(query?: object): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

function jsonBody(data: unknown): Pick<RequestInit, "headers" | "body"> {
  return { headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) };
}

export const authApi = {
  signup: (data: SignUpDto) => api<AuthResponse>("/auth/signup", { method: "POST", ...jsonBody(data) }),
  login: (data: LoginDto) => api<AuthResponse>("/auth/login", { method: "POST", ...jsonBody(data) }),
  googleSignIn: (data: ProviderSignInDto) => api<AuthResponse>("/auth/google", { method: "POST", ...jsonBody(data) }),
  appleSignIn: (data: ProviderSignInDto) => api<AuthResponse>("/auth/apple", { method: "POST", ...jsonBody(data) }),
  forgotPassword: (data: ForgotPasswordDto) => api<ForgotPasswordResponse>("/auth/forgot-password", { method: "POST", ...jsonBody(data) }),
  resetPassword: (data: ResetPasswordDto) => api<AuthResponse>("/auth/reset-password", { method: "POST", ...jsonBody(data) }),
  refresh: (data: RefreshTokenDto) => api<AuthResponse>("/auth/refresh", { method: "POST", ...jsonBody(data) }),
  logout: () => api<SuccessMessageResponse>("/auth/logout", { method: "POST" }),
};

export const userApi = {
  profile: {
    get: () => api<UserProfile>("/user/profile"),
    update: (data: UpdateProfileDto) => api<UserProfile>("/user/profile", { method: "PATCH", ...jsonBody(data) }),
    deleteAccount: () => api<ApiMessageResponse>("/user/account", { method: "DELETE" }),
  },
  crew: { get: () => api<CrewResponse | null>("/crew") },
};

export const transactionApi = {
  create: (data: CreateTransactionDto) => api<TransactionResponse>("/transactions", { method: "POST", ...jsonBody(data) }),
  list: (query?: PaginationQuery) => api<UserTransactionListResponse>(`/transactions${queryString(query)}`),
  get: (id: string) => api<TransactionResponse>(`/transactions/${encodeURIComponent(id)}`),
  createEarner: () => api<CreateEarnerResponse>("/transactions/earners", { method: "POST" }),
  orders: {
    generateDepositAddress: (data: CreateUserOrderDto) => api<DepositAddressResponse>("/transactions/orders/deposit-address", { method: "POST", ...jsonBody(data) }),
    confirmDeposit: (orderId: string) => api<DepositConfirmationResponse>(`/transactions/orders/${encodeURIComponent(orderId)}/confirm-deposit`, { method: "POST" }),
    withdraw: (data: WithdrawDto) => api<WithdrawResponse>("/transactions/orders/withdraw", { method: "POST", ...jsonBody(data) }),
  },
};

export const copyTradingApi = {
  list: () => api<CopyTradingResponse[]>("/copy-trading"),
  get: (id: string) => api<CopyTradingResponse>(`/copy-trading/${encodeURIComponent(id)}`),
  myPurchases: () => api<CopyTradePurchaseResponse[]>("/copy-trading/me/purchases"),
  buy: (id: string) => api<CopyTradeActionResponse>(`/copy-trading/${encodeURIComponent(id)}/buy`, { method: "POST" }),
  addFunds: (purchaseId: string, data: BuyCopyTradingDto) => api<CopyTradeActionResponse>(`/copy-trading/purchases/${encodeURIComponent(purchaseId)}/add-funds`, { method: "POST", ...jsonBody(data) }),
  liquidate: (purchaseId: string, data: LiquidateCopyTradingDto = {}) => api<CopyTradeLiquidationResponse>(`/copy-trading/purchases/${encodeURIComponent(purchaseId)}/liquidate`, { method: "POST", ...jsonBody(data) }),
};

export const adminApi = {
  auth: { login: (data: LoginDto) => api<AuthResponse>("/admin/login", { method: "POST", ...jsonBody(data) }) },
  users: {
    list: (query?: PaginationQuery) => api<AdminUserListResponse>(`/admin/users${queryString(query)}`),
    search: (query: KeywordQuery) => api<AdminUserResponse[]>(`/admin/search/users${queryString(query)}`),
    update: (id: string, data: UpdateAdminUserDto) => api<AdminUserResponse>(`/admin/users/${encodeURIComponent(id)}`, { method: "PATCH", ...jsonBody(data) }),
  },
  transactions: {
    list: (query?: PaginationQuery) => api<AdminTransactionListResponse>(`/admin/transactions${queryString(query)}`),
    updateStatus: (id: string, data: UpdateTransactionStatusDto) => api<TransactionResponse>(`/admin/transactions/${encodeURIComponent(id)}/status`, { method: "PATCH", ...jsonBody(data) }),
  },
  copyTrading: {
    createPlan: (data: CreateCopyTradingDto) => api<CopyTradingResponse>("/copy-trading", { method: "POST", ...jsonBody(data) }),
    updatePlan: (id: string, data: UpdateCopyTradingDto) => api<CopyTradingResponse>(`/copy-trading/${encodeURIComponent(id)}`, { method: "PATCH", ...jsonBody(data) }),
    deletePlan: (id: string) => api<ApiMessageResponse>(`/copy-trading/${encodeURIComponent(id)}`, { method: "DELETE" }),
    listPurchases: (query?: AdminCopyTradePurchaseQuery) => api<AdminCopyTradePurchaseListResponse>(`/admin/copy-trade-purchases${queryString(query)}`),
    updatePurchase: (id: string, data: UpdateCopyTradePurchaseDto) => api<CopyTradePurchaseResponse>(`/admin/copy-trade-purchases/${encodeURIComponent(id)}`, { method: "PATCH", ...jsonBody(data) }),
    userPurchases: (userId: string, query?: AdminCopyTradePurchaseQuery) => api<AdminCopyTradePurchaseListResponse>(`/admin/users/${encodeURIComponent(userId)}/copy-trade-purchases${queryString(query)}`),
  },
  crews: {
    total: () => api<number>("/admin/totalCrews"),
    list: (query?: AdminCrewQuery) => api<AdminCrewListResponse>(`/admin/crews${queryString(query)}`),
    getUserCrew: (query: AdminUserCrewQuery) => api<CrewResponse>(`/admin/crew${queryString(query)}`),
    search: (query: KeywordQuery) => api<CrewResponse[]>(`/admin/search/crews${queryString(query)}`),
    detachUser: (data: DetachUserDto) => api<unknown>("/admin/detachUser", { method: "PATCH", ...jsonBody(data) }),
  },
};


