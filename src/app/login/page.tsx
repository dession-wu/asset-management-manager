'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthFrame } from '@/components/auth/AuthFrame'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const { login, isLoading, error, clearError } = useAuth()
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isLoading) return
    clearError()
    try { await login({ email: email.trim(), password, rememberMe }) } catch { /* Store provides the error. */ }
  }
  return <ProtectedRoute guestOnly><AuthFrame mode="login"><form onSubmit={submit}>
    {error && <p className="ledger-alert" role="alert">{error}</p>}
    <fieldset disabled={isLoading}>
      <div className="ledger-field"><label htmlFor="email">邮箱地址</label><input id="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required value={email} placeholder="name@example.com" onChange={e => { setEmail(e.target.value); clearError() }} /></div>
      <div className="ledger-field"><label htmlFor="password">密码</label><div className="ledger-password"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" minLength={6} required value={password} placeholder="请输入密码" aria-describedby="password-hint" onChange={e => { setPassword(e.target.value); clearError() }} onKeyUp={e => setCapsLock(e.getModifierState('CapsLock'))} onBlur={() => setCapsLock(false)} /><button type="button" aria-label={showPassword ? '隐藏密码' : '显示密码'} aria-pressed={showPassword} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div><p id="password-hint" className="ledger-hint" role="status">{capsLock ? '大写锁定已开启，请注意密码大小写。' : '输入注册时设置的密码。'}</p></div>
      <label className="ledger-check"><input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />在此设备上保持登录</label><p className="ledger-hint">共用设备请勿勾选，使用后记得退出账户。</p>
      <button className="ledger-button" type="submit" disabled={isLoading} aria-busy={isLoading}>{isLoading ? <><Loader2 size={16} className="animate-spin" />登录中…</> : <>打开资产总览<ArrowRight size={16} /></>}</button>
    </fieldset>
  </form><p className="ledger-auth-switch">还没有私人账本？<Link href="/register" onClick={clearError}>创建账户</Link></p></AuthFrame></ProtectedRoute>
}
