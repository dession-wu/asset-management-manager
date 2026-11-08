import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser, AuthTokens, LoginCredentials, RegisterCredentials, AuthState } from '@/types'
import { useAssetStore } from '@/stores/assetStore'

interface AuthStore {
  authState: AuthState
  user: AuthUser | null
  tokens: AuthTokens | null
  error: string | null
  rememberMe: boolean

  isAuthenticated: () => boolean
  isLoading: () => boolean

  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      authState: 'idle',
      user: null,
      tokens: null,
      error: null,
      rememberMe: false,

      isAuthenticated: () => get().authState === 'authenticated',
      isLoading: () => get().authState === 'loading',

      login: async (credentials) => {
        set({ authState: 'loading', error: null })
        try {
          const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            signal: AbortSignal.timeout(15000),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || '登录失败')
          }

          set({
            authState: 'authenticated',
            rememberMe: credentials.rememberMe,
            user: data.user,
            tokens: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresAt: data.expiresAt,
            },
            error: null,
          })
          localStorage.removeItem('access_token')
          useAssetStore.getState().reset()
        } catch (err: unknown) {
          set({
            authState: 'unauthenticated',
            error: err instanceof TypeError ? '网络连接失败，请检查网络后重试' : err instanceof DOMException ? '连接超时，请稍后重试' : err instanceof Error ? err.message : '登录失败，请重试',
          })
          throw err
        }
      },

      register: async (credentials) => {
        set({ authState: 'loading', error: null })
        try {
          const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || '注册失败')
          }

          set({
            authState: 'authenticated',
            user: data.user,
            tokens: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresAt: data.expiresAt,
            },
            error: null,
          })
          localStorage.removeItem('access_token')
          useAssetStore.getState().reset()
        } catch (err: unknown) {
          set({
            authState: 'unauthenticated',
            error: err instanceof Error ? err.message : '注册失败',
          })
          throw err
        }
      },

      logout: async () => {
        const { tokens } = get()
        if (tokens?.accessToken) {
          const response = await fetch(`${API_BASE}/api/auth/logout`, {
            method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${tokens.accessToken}`},
            body:JSON.stringify({refreshToken:tokens.refreshToken}), signal:AbortSignal.timeout(15000),
          })
          if (!response.ok && response.status!==401) throw new Error('退出未完成，请重试。')
        }
        useAssetStore.getState().reset()
        set({
          authState: 'unauthenticated',
          user: null,
          tokens: null,
          error: null,
        })
        localStorage.removeItem('access_token')
      },

      refreshToken: async () => {
        const { tokens } = get()
        if (!tokens?.refreshToken) return

        try {
          const response = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: tokens.refreshToken }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error('刷新令牌失败')
          }

          set({
            tokens: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresAt: data.expiresAt,
            },
          })
        } catch {
          void get().logout().catch(() => set({authState:'unauthenticated',user:null,tokens:null}))
        }
      },

      checkAuth: async () => {
        const { tokens } = get()
        if (!tokens?.accessToken) {
          set({ authState: 'unauthenticated' })
          return
        }

        try {
          const response = await fetch(`${API_BASE}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          })

          if (!response.ok) {
            // Try to refresh token
            if (response.status !== 401) throw new Error('暂时无法验证登录状态')
            await get().refreshToken()
            const refreshed = get().tokens
            if (!refreshed) return
            const retry = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${refreshed.accessToken}` } })
            if (!retry.ok) { await get().logout(); return }
            set({ authState: 'authenticated', user: await retry.json() })
            return
          }

          const user = await response.json()
          set({ authState: 'authenticated', user })
        } catch {
          set({ authState: 'unauthenticated' })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ tokens: state.tokens, rememberMe: state.rememberMe }),
      storage: createJSONStorage(() => ({
        getItem: name => localStorage.getItem(name) || sessionStorage.getItem(name),
        setItem: (name, value) => {
          const remember = JSON.parse(value).state.rememberMe
          const target = remember ? localStorage : sessionStorage
          const other = remember ? sessionStorage : localStorage
          other.removeItem(name)
          target.setItem(name, value)
        },
        removeItem: name => { localStorage.removeItem(name); sessionStorage.removeItem(name) },
      })),
    }
  )
)


