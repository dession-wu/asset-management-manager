'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Wallet } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PasswordStrength } from '@/components/auth/PasswordStrength'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const { register, isLoading, error, clearError } = useAuth()
  const router = useRouter()

  const passwordValidation = useMemo(() => {
    const errors = []
    if (password.length < 8) errors.push('密码至少需要8个字符')
    if (!/[A-Z]/.test(password)) errors.push('需要包含至少一个大写字母')
    if (!/[a-z]/.test(password)) errors.push('需要包含至少一个小写字母')
    if (!/[0-9]/.test(password)) errors.push('需要包含至少一个数字')
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('需要包含至少一个特殊字符')
    return errors
  }, [password])

  const isPasswordValid = passwordValidation.length === 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLocalError('')

    if (password !== confirmPassword) {
      setLocalError('两次输入的密码不一致')
      return
    }

    if (!isPasswordValid) {
      setLocalError('密码不符合要求：' + passwordValidation.join('，'))
      return
    }

    try {
      await register({ email, password, confirmPassword, nickname })
      router.push('/')
    } catch {
      // Error handled by store
    }
  }

  return (
    <ProtectedRoute guestOnly>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">创建账户</h2>
            <p className="mt-2 text-sm text-gray-600">开始管理您的资产</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {(error || localError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error || localError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                  昵称
                </label>
                <input
                  id="nickname"
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入昵称"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  邮箱地址
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="至少8位，包含大小写字母、数字和特殊字符"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <PasswordStrength password={password} />
                {password && !isPasswordValid && (
                  <div className="mt-1 text-xs text-red-600 space-y-0.5">
                    {passwordValidation.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  确认密码
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请再次输入密码"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">两次输入的密码不一致</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || password !== confirmPassword || !isPasswordValid}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '注册中...' : '注册'}
            </button>

            <p className="text-center text-sm text-gray-600">
              已有账户？{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                立即登录
              </Link>
            </p>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
