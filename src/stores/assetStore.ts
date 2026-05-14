import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Asset, Account, Transaction, UserSettings, RiskProfile } from '@/types'

interface AssetState {
  assets: Asset[]
  accounts: Account[]
  transactions: Transaction[]
  userSettings: UserSettings
  isLoading: boolean
  error: string | null

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
        return get().assets.reduce((sum, asset) => {
          return sum + asset.currentPrice * asset.quantity
        }, 0)
      },

      getNetWorth: () => {
        return get().getTotalAssets()
      },

      getAssetsByCategory: () => {
        const result: Record<string, number> = {}
        get().assets.forEach((asset) => {
          const value = asset.currentPrice * asset.quantity
          result[asset.category] = (result[asset.category] || 0) + value
        })
        return result
      },
    }),
    {
      name: 'asset-storage',
      partialize: (state) => ({
        assets: state.assets,
        accounts: state.accounts,
        transactions: state.transactions,
        userSettings: state.userSettings,
      }),
    }
  )
)
