'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AssetWorkspace } from '@/components/AssetWorkspace'
import { PageIntro, CategoryDistribution, LedgerEmpty, ValuationNote } from '@/components/ledger/LedgerUI'
import { useAssetStore } from '@/stores/assetStore'
import { categoryLabels } from '@/lib/asset-display'
import { formatCurrency, formatPercent } from '@/lib/utils'

export default function AllocationPage() {
  const { assets, getTotalAssets, getAssetsByCategory, getNetWorth } = useAssetStore()
  const total = getTotalAssets(), categories = Object.entries(getAssetsByCategory()).sort((a, b) => b[1] - a[1])
  const largest = categories[0]
  return <ProtectedRoute requireAuth><AssetWorkspace title="配置分析"><PageIntro title="资金分布在哪里？" description="从各类别的当前价值与占比，理解你的组合结构。" action={<Link href="/assets" className="ledger-text-link">调整资产记录<ArrowUpRight size={15} /></Link>} />
    {!assets.length ? <LedgerEmpty title="先有记录，才有全貌" description="添加一笔资产后，这里会按类别整理你的资金分布。" /> : <><div className="ledger-two-column"><section className="ledger-main-section" style={{ marginTop: 0 }}><div className="ledger-section-heading"><h3>人民币资产分布</h3><small>{categories.length} 个类别</small></div>{categories.length ? <CategoryDistribution entries={categories} total={total} /> : <p className="ledger-muted">当前记录仅包含债务或其他币种，暂无可分析的人民币资产。</p>}</section><section className="ledger-main-section" style={{ marginTop: 0 }}><div className="ledger-section-heading"><h3>组合摘要</h3></div><div className="ledger-balance-breakdown" style={{ padding: 0 }}><div><span>人民币总资产</span><strong>{formatCurrency(total)}</strong></div><div><span>最大资产类别</span><strong>{largest ? categoryLabels[largest[0]] : '暂无'}</strong></div><div><span>最大类别占比</span><strong>{largest && total > 0 ? formatPercent(largest[1] / total) : '—'}</strong></div><div><span>债务余额</span><strong>{formatCurrency(total - getNetWorth())}</strong></div><div><span>全部资产记录</span><strong>{assets.length} 笔</strong></div></div><p className="ledger-info" style={{ marginTop: 24 }}>占比描述当前记录的分布，供你复盘参考。这里不生成买卖建议，也不预设适合你的目标配置。</p></section></div><ValuationNote /></>}
  </AssetWorkspace></ProtectedRoute>
}
