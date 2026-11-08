'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  guestOnly?: boolean
}

export function ProtectedRoute({ children, requireAuth = false, guestOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isChecking } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }

    if (guestOnly && isAuthenticated) {
      const next = new URLSearchParams(window.location.search).get('next')
      router.replace(next && /^\/(dashboard|assets|allocation|reports|settings)$/.test(next) ? next : '/dashboard')
    }
  }, [isAuthenticated, isLoading, requireAuth, guestOnly, router, pathname])

  if (isChecking || (isLoading && !guestOnly)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p role="status" className="text-gray-500">正在验证登录状态…</p>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (guestOnly && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
