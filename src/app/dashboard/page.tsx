'use client'

import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AssetWorkspace } from '@/components/AssetWorkspace'
import { PageIntro, CategoryDistribution, LedgerEmpty, ValuationNote } from '@/components/ledger/LedgerUI'
import { useAssetStore } from '@/stores/assetStore'
import { categoryLabels } from '@/lib/asset-display'
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils'

export default function DashboardPage() {
  const { assets, getTotalAssets, getNetWorth, getAssetsByCategory, getUnrealizedReturn, getReturnRate } = useAssetStore()
  const total = getTotalAssets(), net = getNetWorth(), profit = getUnrealizedReturn()
  const categories = Object.entries(getAssetsByCategory()).sort((a, b) => b[1] - a[1])
  const recent = [...assets].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()).slice(0, 4)
  const hasRmb = assets.some(a => a.currency === 'CNY' && a.category !== 'DEBT')
  return <ProtectedRoute requireAuth><AssetWorkspace title="资产总览" actions={<Link href="/assets" className="ledger-button"><Plus size={15} />记录资产</Link>}>
    <PageIntro title="你的资产，心中有数。" description="用一份清晰的账本，连接每一次记录与下一次判断。" />
    <section className="ledger-balance-sheet" aria-label="资产概况"><div className="ledger-net-worth"><p>净资产<span className="ledger-overline">NET WORTH</span></p><h3 className="ledger-amount">{formatCurrency(net)}</h3><p>{assets.length ? `基于 ${assets.length} 笔已记录持有 · 人民币口径` : '添加第一笔资产，开始建立你的记录。'}</p></div><div className="ledger-balance-breakdown"><div><span>总资产</span><strong>{formatCurrency(total)}</strong></div><div><span>减：债务余额</span><strong>{formatCurrency(total - net)}</strong></div><div><span>持仓浮盈 / 收益率</span><div style={{ textAlign: 'right' }}><strong className={profit < 0 ? 'ledger-negative' : 'ledger-positive'}>{hasRmb ? `${profit >= 0 ? '+' : ''}${formatCurrency(profit)}` : '—'}</strong><span>{hasRmb ? `${getReturnRate() >= 0 ? '+' : ''}${formatPercent(getReturnRate())}` : '录入成本后计算'}</span></div></div></div></section>
    <ValuationNote />
    {assets.length === 0 ? <div className="ledger-main-section"><LedgerEmpty /></div> : <div className="ledger-two-column"><section className="ledger-main-section"><div className="ledger-section-heading"><h3>资产分布</h3><Link href="/allocation" className="ledger-text-link">查看配置<ArrowUpRight size={14} /></Link></div>{categories.length ? <CategoryDistribution entries={categories} total={total} /> : <p className="ledger-muted">还没有人民币资产，其他币种与债务可在账本中查看。</p>}</section><section className="ledger-main-section"><div className="ledger-section-heading"><h3>最近更新的记录</h3><Link href="/assets" className="ledger-text-link">全部记录<ArrowUpRight size={14} /></Link></div>{recent.map(a => <div className="ledger-recent-row" key={a.id}><div><strong>{a.name}</strong><small>{categoryLabels[a.category]} · {a.currency}{a.updatedAt ? ` · ${formatDate(a.updatedAt)}` : ''}</small></div><b>{formatCurrency(a.quantity * a.currentPrice, a.currency)}</b></div>)}</section></div>}
  </AssetWorkspace></ProtectedRoute>
}
