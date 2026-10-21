export type PaginationQuery = { page?: number; limit?: number };
export interface PaginationMeta { page: number; limit: number; total: number; totalPages: number }
export interface PaginatedResponse<T> { data: T[]; pagination: PaginationMeta }
export interface ApiMessageResponse { message: string }
export interface SuccessMessageResponse { success: boolean; message: string }

// Auth request DTOs and responses
export interface SignUpDto { email: string; password: string; firstName?: string; lastName?: string; phone?: string; referral_code?: string }
export interface LoginDto { email: string; password: string }
export interface ProviderSignInDto { idToken: string; firstName?: string; lastName?: string; referral_code?: string }
export interface ForgotPasswordDto { email: string }
export interface ResetPasswordDto { token: string; newPassword: string }
export interface RefreshTokenDto { refreshToken: string }
export interface AuthUser { _id: string; userID: string; email: string; firstName: string; lastName: string; authType?: string }
export interface AuthResponse extends SuccessMessageResponse { accessToken: string; refreshToken: string; user: AuthUser }
export interface ForgotPasswordResponse extends SuccessMessageResponse { resetToken?: string }

// Profile request DTOs and response
export interface UpdateProfileDto { firstName?: string; lastName?: string; profileImage?: string }
export interface UserProfile {
  _id: string; userID: string; email: string; firstName: string; lastName: string; isAdmin?: boolean; 
  phone?: string; profileImage?: string; walletAddress?: string; walletPassword?: string; balance: number;
  totalWithdraw: number; totalDeposit: number; transactionCount: number; isSuspended: boolean;
  createdAt?: string; updatedAt?: string
}

// Transactions and order request DTOs/responses
export type TransactionType = "deposit" | "withdraw" | "profit" | "loss" | "buy" | "sell" | "copy_trade" | "copy_trade_add_funds" | "copy_trade_liquidation";
export type TransactionStatus = "pending" | "completed" | "rejected" | "failed";
export interface CreateTransactionDto { type: TransactionType; amount: number; currency?: string; reference?: string; note?: string }
export interface TransactionResponse {
  _id: string; transactionID: string; userId: string; email: string;
  type: TransactionType | "withdrawal" | "bonus"; status: TransactionStatus; amount: number;
  currency: string; reference?: string; note?: string; createdAt: string;
}
export interface EarnerResponse { _id: string; userID: string; status: "pending" | "completed" | "failed"; daily_rate: number; expiresAt: string }
export type CreateEarnerResponse = { success: true; newEarner: EarnerResponse } | undefined;
export interface CreateUserOrderDto { amount: number }
export interface WithdrawDto { amount: number; walletAddress?: string }
export interface UserOrderResponse {
  _id: string; invoiceId: string; email: string; displayAmount: number; expectedAmount?: number;
  status: "pending" | "completed" | "failed"; coin: string; network: "BEP20" | "TRC20";
  address?: string; referenceID?: string; expiresAt: string;
}
export interface DepositAddressResponse { message: string; order: UserOrderResponse }
export interface DepositConfirmationResponse extends ApiMessageResponse { transaction?: TransactionResponse; success?: boolean; redirect?: boolean }
export interface WithdrawResponse extends ApiMessageResponse { newTransaction: TransactionResponse }

// Copy-trading DTOs and responses
export type RiskLevel = "low" | "medium" | "high";
export interface CreateCopyTradingDto {
  traderName: string; riskLevel: RiskLevel; leverage: number; winrate: number; country?: string;
  last_10_trades?: number[]; duration: string; dailyAverageProfit: number; purchases: number; totalAssets: number; price: number;
}
export type UpdateCopyTradingDto = Partial<CreateCopyTradingDto>;
export interface BuyCopyTradingDto { amountInvested: number }
export interface LiquidateCopyTradingDto { note?: string }
export interface CopyTradingResponse extends CreateCopyTradingDto { _id: string; currency: string; createdAt?: string; updatedAt?: string }
export type CopyTradePurchaseStatus = "active" | "liquidated" | "expired";
export interface CopyTradePurchaseResponse {
  _id: string; userId: string; copyTradingId: string | CopyTradingResponse; traderName: string; riskLevel: RiskLevel;
  duration: string; dailyAverageProfit: number; leverage: number; winrate: number; pnl: number; purchases: number;
  totalAssets: number; price: number; amountInvested: number; currency: string; expiredAt: string;
  status: CopyTradePurchaseStatus; liquidatedAt?: string; liquidationAmount?: number; liquidationFee?: number;
}
export interface CopyTradeActionResponse { purchase: CopyTradePurchaseResponse; transaction: TransactionResponse }
export interface CopyTradeLiquidationResponse extends CopyTradeActionResponse { payout: number; fee: number }

// Admin request DTOs and responses
export interface UpdateAdminUserDto {
  firstName?: string; lastName?: string; phone?: string; balance?: number; totalWithdraw?: number; totalDeposit?: number;
  transactionCount?: number; walletAddress?: string; walletPassword?: string; isSuspended?: boolean; isAdmin?: boolean;
}
export interface UpdateTransactionStatusDto { status: TransactionStatus }
export interface UpdateCopyTradePurchaseDto {
  traderName?: string; riskLevel?: RiskLevel; duration?: string; leverage?: number; winrate?: number; pnl?: number;
  purchases?: number; totalAssets?: number; amountInvested?: number; currency?: string; expiredAt?: string;
  status?: "active" | "liquidated"; liquidatedAt?: string; liquidationAmount?: number; liquidationFee?: number;
}
export interface AdminCopyTradePurchaseQuery extends PaginationQuery { userId?: string; status?: "active" | "liquidated" }
export interface AdminUserResponse extends UserProfile { isAdmin?: boolean; createdAt?: string; updatedAt?: string }
export interface AdminCrewMember { userID: string; email: string; level: number; joinedAt?: string; totalDeposits: number; totalWithdrawals: number; transactionCount: number }
export interface CrewResponse {
  userID: string; ownerEmail: string; ownerReferralCode: string; totalMembers: number;
  totalCrewDeposits: number; totalCrewWithdrawals: number; totalCrewTransactions: number;
  members?: { level_1: AdminCrewMember[]; level_2: AdminCrewMember[]; level_3: AdminCrewMember[] };
  level_1?: AdminCrewMember[]; level_2?: AdminCrewMember[]; level_3?: AdminCrewMember[]; lastUpdated?: string;
}
export interface AdminCrewListResponse { crews: CrewResponse[]; page: number; limit: number; total: number; totalPages: number }
export interface AdminCrewQuery { limit?: number; page?: number }
export interface KeywordQuery { keyword: string }
export interface AdminUserCrewQuery { userID: string }
export interface DetachUserDto { userID: string }


export type UserTransactionListResponse = PaginatedResponse<TransactionResponse>;
export type AdminUserListResponse = PaginatedResponse<AdminUserResponse>;
export type AdminTransactionListResponse = PaginatedResponse<TransactionResponse>;
export type AdminCopyTradePurchaseListResponse = PaginatedResponse<CopyTradePurchaseResponse>;

/** Response types returned by the typed API functions in endpoints.ts. */
export interface EndpointResponses {
  "user.auth.signup": AuthResponse;
  "user.auth.login": AuthResponse;
  "user.auth.googleSignIn": AuthResponse;
  "user.auth.appleSignIn": AuthResponse;
  "user.auth.forgotPassword": ForgotPasswordResponse;
  "user.auth.resetPassword": AuthResponse;
  "user.auth.refresh": AuthResponse;
  "user.auth.logout": SuccessMessageResponse;
  "user.profile.get": UserProfile;
  "user.profile.update": UserProfile;
  "user.profile.deleteAccount": ApiMessageResponse;
  "user.transactions.create": TransactionResponse;
  "user.transactions.list": UserTransactionListResponse;
  "user.transactions.get": TransactionResponse;
  "user.transactions.createEarner": CreateEarnerResponse;
  "user.transactions.orders.generateDepositAddress": DepositAddressResponse;
  "user.transactions.orders.confirmDeposit": DepositConfirmationResponse;
  "user.transactions.orders.withdraw": WithdrawResponse;
  "user.copyTrading.list": CopyTradingResponse[];
  "user.copyTrading.get": CopyTradingResponse;
  "user.copyTrading.myPurchases": CopyTradePurchaseResponse[];
  "user.copyTrading.buy": CopyTradeActionResponse;
  "user.copyTrading.addFunds": CopyTradeActionResponse;
  "user.copyTrading.liquidate": CopyTradeLiquidationResponse;
  "user.crew.get": CrewResponse | null;
  "user.public.hello": string;
  "admin.auth.login": AuthResponse;
  "admin.users.list": AdminUserListResponse;
  "admin.users.search": AdminUserResponse[];
  "admin.users.update": AdminUserResponse;
  "admin.transactions.list": AdminTransactionListResponse;
  "admin.transactions.updateStatus": TransactionResponse;
  "admin.copyTrading.createPlan": CopyTradingResponse;
  "admin.copyTrading.updatePlan": CopyTradingResponse;
  "admin.copyTrading.deletePlan": ApiMessageResponse;
  "admin.copyTrading.listPurchases": AdminCopyTradePurchaseListResponse;
  "admin.copyTrading.updatePurchase": CopyTradePurchaseResponse;
  "admin.copyTrading.userPurchases": AdminCopyTradePurchaseListResponse;
  "admin.crews.total": number;
  "admin.crews.list": AdminCrewListResponse;
  "admin.crews.getUserCrew": CrewResponse | null;
  "admin.crews.search": CrewResponse[];
  "admin.crews.detachUser": ApiMessageResponse;
}

