'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Wallet, PieChart, FileText, Settings, Menu, X } from 'lucide-react'
import { UserMenu } from '@/components/auth/UserMenu'
import { LedgerBrand } from '@/components/ledger/LedgerUI'
import { useAssetStore } from '@/stores/assetStore'
import { assetRequest } from '@/lib/client-api'
import type { Asset } from '@/types'

const nav = [
  { href: '/dashboard', label: '资产总览', icon: LayoutDashboard },
  { href: '/assets', label: '资产管理', icon: Wallet },
  { href: '/allocation', label: '配置分析', icon: PieChart },
  { href: '/reports', label: '报表中心', icon: FileText },
  { href: '/settings', label: '设置', icon: Settings },
]

export function AssetWorkspace({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  const path = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(path !== '/settings')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const trigger = useRef<HTMLButtonElement>(null)
  const sidebar = useRef<HTMLElement>(null)
  const setAssets = useAssetStore(s => s.setAssets)
  const close = () => { setMenuOpen(false); trigger.current?.focus() }
  useEffect(() => {
    if (path === '/settings') return
    const controller = new AbortController()
    assetRequest<Asset[]>('/api/assets', { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setAssets(data) })
      .catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : '读取失败，请重试') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [path, attempt, setAssets])
  useEffect(() => {
    if (!menuOpen) return
    const links = sidebar.current!.querySelectorAll<HTMLElement>('a,button')
    links[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); trigger.current?.focus() }
      if (e.key === 'Tab') {
        const first = links[0], last = links[links.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])
  return <div className="ledger-app flex h-dvh"><a href="#workspace-main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">跳到主要内容</a>
    {menuOpen && <button className="fixed inset-0 z-30 bg-black/30 md:hidden" aria-label="关闭导航遮罩" onClick={close} />}
    <aside ref={sidebar} id="workspace-nav" className={`ledger-sidebar ${menuOpen ? '' : 'closed'}`}><div className="relative"><LedgerBrand /><button className="ledger-icon-button absolute right-1 top-8 md:hidden" aria-label="关闭导航" onClick={close}><X size={18} /></button></div><nav aria-label="主导航">{nav.map(({ href, label, icon: Icon }, index) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="ledger-nav-link" aria-current={path === href ? 'page' : undefined}><Icon size={17} strokeWidth={1.5} /><span>{label}</span><small>{String(index + 1).padStart(2, '0')}</small></Link>)}</nav><div className="ledger-sidebar-foot"><p>记录当下，面向长期。</p><span>YOUR PERSONAL LEDGER</span></div></aside>
    <div className="ledger-shell"><header className="ledger-header"><div className="ledger-header-title"><button ref={trigger} className="ledger-icon-button md:hidden" aria-label="打开导航" aria-expanded={menuOpen} aria-controls="workspace-nav" onClick={() => setMenuOpen(true)}><Menu size={19} /></button><div><span>私人账本</span><h1>{title}</h1></div></div><div className="ledger-header-actions"><fieldset disabled={loading || Boolean(error)}>{actions}</fieldset><UserMenu /></div></header><main id="workspace-main" tabIndex={-1} className="ledger-main">
      {loading ? <p role="status" className="ledger-muted text-center py-20">正在读取你的资产记录…</p> : error ? <div className="ledger-empty" role="alert"><h2>暂时无法读取资产</h2><p>{error}。已有记录不会被修改。</p><button className="ledger-button" onClick={() => { setLoading(true); setError(''); setAttempt(v => v + 1) }}>重新加载</button></div> : children}
    </main></div>
  </div>
}
