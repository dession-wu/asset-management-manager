'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck, Wallet } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await login({ email, password, rememberMe })
      router.push('/dashboard')
    } catch {
      // Error is exposed by the auth store.
    }
  }

  return (
    <ProtectedRoute guestOnly>
      <div className="asset-login-page">
        <div className="asset-login-grid" aria-hidden="true" />
        <div className="asset-login-shell">
          <header className="asset-login-header">
            <Link href="/" className="asset-login-brand" aria-label="返回 Asset Pilot 首页"><span className="asset-login-mark"><Wallet size={16} /></span><span><strong>ASSET PILOT</strong><small>PERSONAL LEDGER / ACCESS</small></span></Link>
            <span className="asset-login-code">PRIVATE SPACE / 001</span>
          </header>
          <main className="asset-login-main">
            <section className="asset-login-intro" aria-labelledby="asset-login-title">
              <p className="asset-login-kicker">/ YOUR LONG VIEW</p>
              <h1 id="asset-login-title">回到账本，<br /><em>继续掌握全局。</em></h1>
              <p>登录你的私人资产空间，查看最新记录、组合变化和每一次判断留下的依据。</p>
              <div className="asset-login-ledger" aria-label="Asset Pilot 的核心特性"><div><Check size={14} /><span>记录归你掌握</span><b>01</b></div><div><ShieldCheck size={14} /><span>安全保存每笔变化</span><b>02</b></div><div><LockKeyhole size={14} /><span>为长期决定留档</span><b>03</b></div></div>
            </section>
            <section className="asset-login-card" aria-label="登录表单">
              <div className="asset-login-card-top"><span>PERSONAL LEDGER</span><span>OPEN / ACCOUNT</span></div>
              <h2>欢迎回来</h2><p className="asset-login-caption">进入你的资产总览。</p>
              {error && <div className="asset-login-error" role="alert">{error}</div>}
              <form onSubmit={handleSubmit} className="asset-login-form">
                <div className="asset-login-field"><label htmlFor="email">邮箱地址</label><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com…" /></div>
                <div className="asset-login-field"><label htmlFor="password">密码</label><div className="asset-login-password"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码…" /><button type="button" className="asset-login-eye" aria-label={showPassword ? '隐藏密码' : '显示密码'} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
                <label className="asset-login-remember"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> <span>在此设备上保持登录</span></label>
                <button type="submit" className="asset-login-submit" disabled={isLoading} aria-busy={isLoading}>{isLoading ? <><Loader2 size={16} className="asset-login-spinner" /> 登录中…</> : <>打开资产总览 <ArrowRight size={17} /></>}</button>
              </form>
              <p className="asset-login-register">还没有私人账本？ <Link href="/register">创建账户 <ArrowRight size={13} /></Link></p>
            </section>
          </main>
          <footer className="asset-login-footer"><span>ASSET PILOT</span><span>YOUR DATA. YOUR RECORD.</span><span>© 2026</span></footer>
        </div>
      </div>
    </ProtectedRoute>
  )
}
