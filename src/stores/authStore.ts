import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, AuthTokens, LoginCredentials, RegisterCredentials, AuthState } from '@/types'

interface AuthStore {
  authState: AuthState
  user: AuthUser | null
  tokens: AuthTokens | null
  error: string | null

  isAuthenticated: () => boolean
  isLoading: () => boolean

  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
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

      isAuthenticated: () => get().authState === 'authenticated',
      isLoading: () => get().authState === 'loading',

      login: async (credentials) => {
        set({ authState: 'loading', error: null })
        try {
          const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || '登录失败')
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
          localStorage.setItem('access_token', data.accessToken)
        } catch (err: any) {
          set({
            authState: 'unauthenticated',
            error: err.message || '登录失败',
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
          localStorage.setItem('access_token', data.accessToken)
        } catch (err: any) {
          set({
            authState: 'unauthenticated',
            error: err.message || '注册失败',
          })
          throw err
        }
      },

      logout: () => {
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
          get().logout()
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
            await get().refreshToken()
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
      partialize: (state) => ({ tokens: state.tokens }),
      onRehydrateStorage: () => (state) => {
        if (state?.tokens?.accessToken) {
          localStorage.setItem('access_token', state.tokens.accessToken)
        }
      },
    }
  )
)
