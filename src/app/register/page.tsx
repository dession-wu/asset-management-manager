'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Minus, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthFrame } from '@/components/auth/AuthFrame'

const requirements = [
  { label: '至少 8 位', test: (v: string) => v.length >= 8 },
  { label: '大写字母', test: (v: string) => /[A-Z]/.test(v) },
  { label: '小写字母', test: (v: string) => /[a-z]/.test(v) },
  { label: '数字', test: (v: string) => /[0-9]/.test(v) },
  { label: '特殊字符', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [show, setShow] = useState(false)
  const [localError, setLocalError] = useState('')
  const { register, isLoading, error, clearError } = useAuth()
  const validPassword = requirements.every(r => r.test(password))
  const clear = () => { clearError(); setLocalError('') }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isLoading) return
    clear()
    if (!validPassword) { setLocalError('请完成下方密码要求后再创建账户。'); return }
    if (password !== confirmPassword) { setLocalError('两次输入的密码不一致。'); return }
    if (nickname.trim().length < 2) { setLocalError('昵称至少需要 2 个字符。'); return }
    try { await register({ email: email.trim(), nickname: nickname.trim(), password, confirmPassword }) } catch { /* Store provides the error. */ }
  }
  return <ProtectedRoute guestOnly><AuthFrame mode="register"><form onSubmit={submit}>
    {(error || localError) && <p className="ledger-alert" role="alert">{localError || error}</p>}
    <fieldset disabled={isLoading}>
      <div className="ledger-field"><label htmlFor="nickname">昵称</label><input id="nickname" autoComplete="nickname" required minLength={2} maxLength={20} value={nickname} placeholder="希望我们如何称呼你" onChange={e => { setNickname(e.target.value); clear() }} /></div>
      <div className="ledger-field"><label htmlFor="email">邮箱地址</label><input id="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required value={email} placeholder="name@example.com" onChange={e => { setEmail(e.target.value); clear() }} /></div>
      <div className="ledger-field"><label htmlFor="password">设置密码</label><div className="ledger-password"><input id="password" type={show ? 'text' : 'password'} autoComplete="new-password" required aria-describedby="password-rules" value={password} placeholder="设置一个安全的密码" onChange={e => { setPassword(e.target.value); clear() }} /><button type="button" aria-label={show ? '隐藏密码' : '显示密码'} aria-pressed={show} onClick={() => setShow(v => !v)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div><div id="password-rules" className="ledger-password-rules">{requirements.map(r => <span key={r.label} data-met={r.test(password)}>{r.test(password) ? <Check size={11} /> : <Minus size={11} />}{r.label}<span className="sr-only">{r.test(password) ? '已满足' : '未满足'}</span></span>)}</div></div>
      <div className="ledger-field"><label htmlFor="confirm-password">确认密码</label><input id="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} placeholder="再次输入密码" aria-invalid={Boolean(confirmPassword && password !== confirmPassword)} aria-describedby="confirm-hint" onChange={e => { setConfirmPassword(e.target.value); clear() }} /><p id="confirm-hint" className="ledger-hint">{confirmPassword ? password === confirmPassword ? '两次密码一致。' : '两次输入的密码不一致。' : '确认后即可建立你的私人账本。'}</p></div>
      <button type="submit" className="ledger-button" disabled={isLoading} aria-busy={isLoading}>{isLoading ? <><Loader2 size={16} className="animate-spin" />创建中…</> : <>建立我的账本<ArrowRight size={16} /></>}</button>
    </fieldset>
  </form><p className="ledger-auth-switch">已有账户？<Link href="/login" onClick={clearError}>立即登录</Link></p></AuthFrame></ProtectedRoute>
}
