export type AssetCategory =
  | 'CASH'
  | 'FIXED'
  | 'EQUITY'
  | 'ALTERNATIVE'
  | 'REAL_ESTATE'
  | 'DEBT';

export type AssetSubcategory = string;

export type AccountType =
  | 'BANK'
  | 'SECURITIES'
  | 'ALIPAY'
  | 'WECHAT'
  | 'OTHER';

export type TransactionType =
  | 'BUY'
  | 'SELL'
  | 'DIVIDEND'
  | 'DEPOSIT'
  | 'WITHDRAW'
  | 'TRANSFER';

export type RiskProfile =
  | 'CONSERVATIVE'
  | 'MODERATE'
  | 'BALANCED'
  | 'AGGRESSIVE'
  | 'RADICAL';

export interface User {
  id: string;
  email: string;
  phone?: string;
  nickname?: string;
  riskProfile?: RiskProfile;
  role?: 'user' | 'admin';
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  accountId: string;
  category: AssetCategory;
  subcategory?: string;
  name: string;
  code?: string;
  quantity: number;
  costPrice: number;
  currentPrice: number;
  currency: string;
  purchaseDate?: string;
  memo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  assetId: string;
  type: TransactionType;
  date: string;
  quantity: number;
  price: number;
  amount: number;
  fee: number;
  memo?: string;
  createdAt: string;
}

export interface AllocationTarget {
  id: string;
  userId: string;
  category: AssetCategory;
  targetPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketPrice {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  price: number;
  currency: string;
  updatedAt: string;
  dataSource: string;
}

export interface AssetCategoryConfig {
  code: AssetCategory;
  name: string;
  description: string;
  color: string;
  icon: string;
  subcategories: { code: string; name: string }[];
}

export interface RiskProfileConfig {
  code: RiskProfile;
  name: string;
  description: string;
  allocation: Record<AssetCategory, number>;
}

export interface DashboardData {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyReturn: number;
  monthlyReturnRate: number;
  yearlyReturn: number;
  yearlyReturnRate: number;
  totalReturn: number;
  totalReturnRate: number;
  allocation: AllocationItem[];
}

export interface AllocationItem {
  category: string;
  name: string;
  value: number;
  percent: number;
  color: string;
}

export interface Recommendation {
  id: string;
  type: 'REBALANCE' | 'RISK_WARNING' | 'CONCENTRATION' | 'OPTIMIZATION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  action?: string;
  read: boolean;
  createdAt: string;
}

export interface UserSettings {
  nickname: string;
  email: string;
  phone: string;
  riskProfile: string;
  notifications: {
    priceAlerts: boolean;
    rebalanceReminders: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
    backupReminders: boolean;
  };
  security: {
    dbEncryption: boolean;
    autoLock: boolean;
    autoLockTimeout: number;
  };
  targetAllocation?: Record<AssetCategory, number>;
}

export type AuthState = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthUser {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface JwtClaims {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export type { Database } from './database';
