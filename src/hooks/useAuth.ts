import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const auth = useAuthStore()

  useEffect(() => {
    if (auth.authState === 'idle') {
      auth.checkAuth()
    }
  }, [auth])

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated(),
    isLoading: auth.isLoading(),
    error: auth.error,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    clearError: auth.clearError,
  }
}
