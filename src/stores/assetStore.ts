import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Asset, Account, Transaction, UserSettings } from '@/types'

interface AssetState {
  assets: Asset[]
  accounts: Account[]
  transactions: Transaction[]
  userSettings: UserSettings
  isLoading: boolean
  error: string | null
  reset: () => void

  setAssets: (assets: Asset[]) => void
  setAccounts: (accounts: Account[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setUserSettings: (settings: UserSettings) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  addAsset: (asset: Asset) => void
  updateAsset: (id: string, updates: Partial<Asset>) => void
  deleteAsset: (id: string) => void

  getTotalAssets: () => number
  getNetWorth: () => number
  getAssetsByCategory: () => Record<string, number>
  getTotalCost: () => number
  getUnrealizedReturn: () => number
  getReturnRate: () => number
}
const defaultSettings: UserSettings = {
  nickname: '用户',
  email: '',
  phone: '',
  riskProfile: 'MODERATE',
  notifications: {
    priceAlerts: true,
    rebalanceReminders: true,
    weeklyReports: true,
    monthlyReports: true,
    backupReminders: true,
  },
  security: {
    dbEncryption: false,
    autoLock: false,
    autoLockTimeout: 5,
  },
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: [],
      accounts: [],
      transactions: [],
      userSettings: defaultSettings,
      isLoading: false,
      error: null,
      reset: () => set({ assets: [], accounts: [], transactions: [], userSettings: defaultSettings, error: null, isLoading: false }),

      setAssets: (assets) => set({ assets }),
      setAccounts: (accounts) => set({ accounts }),
      setTransactions: (transactions) => set({ transactions }),
      setUserSettings: (userSettings) => set({ userSettings }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),
      updateAsset: (id, updates) =>
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),
      deleteAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
        })),

      getTotalAssets: () => {
        return get().assets.filter(a => a.category !== 'DEBT' && a.currency === 'CNY').reduce((sum, asset) => {
          return sum + asset.currentPrice * asset.quantity
        }, 0)
      },

      getNetWorth: () => {
        return get().getTotalAssets() - get().assets.filter(a => a.category === 'DEBT' && a.currency === 'CNY').reduce((sum, a) => sum + a.currentPrice * a.quantity, 0)
      },

      getAssetsByCategory: () => {
        const result: Record<string, number> = {}
        get().assets.forEach((asset) => {
          if (asset.category === 'DEBT' || asset.currency !== 'CNY') return
          const value = asset.currentPrice * asset.quantity
          result[asset.category] = (result[asset.category] || 0) + value
        })
        return result
      },

      /* 持仓总成本：Σ costPrice * quantity */
      getTotalCost: () => {
        return get().assets.filter(a => a.category !== 'DEBT' && a.currency === 'CNY').reduce(
          (sum, asset) => sum + asset.costPrice * asset.quantity,
          0
        )
      },

      /* 持仓浮盈（未实现收益）：Σ (currentPrice - costPrice) * quantity */
      getUnrealizedReturn: () => {
        return get().assets.filter(a => a.category !== 'DEBT' && a.currency === 'CNY').reduce(
          (sum, asset) => sum + (asset.currentPrice - asset.costPrice) * asset.quantity,
          0
        )
      },

      /* 收益率：浮盈 / 总成本，无成本时返回 0 */
      getReturnRate: () => {
        const totalCost = get().getTotalCost()
        if (totalCost <= 0) return 0
        return get().getUnrealizedReturn() / totalCost
      },
    }),
    {
      name: 'asset-storage',
      partialize: (state) => ({
        userSettings: state.userSettings,
      }),
      merge: (persisted, current) => ({ ...current, userSettings: (persisted as { userSettings?: UserSettings })?.userSettings || defaultSettings }),
    }
  )
)
