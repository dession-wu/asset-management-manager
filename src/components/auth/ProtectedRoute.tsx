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
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !isAuthenticated) {
      router.push('/login')
    }

    if (guestOnly && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, requireAuth, guestOnly, router, pathname])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
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
