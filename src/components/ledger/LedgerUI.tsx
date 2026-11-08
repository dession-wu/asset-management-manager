import Link from 'next/link'
import { ArrowUpRight, Wallet } from 'lucide-react'
import { categoryLabels } from '@/lib/asset-display'
import { formatCurrency, formatPercent } from '@/lib/utils'

export function LedgerBrand() {
  return <Link href="/" className="ledger-brand" aria-label="资产账本首页"><img src="/brand/icon.svg?v=20261103-brand1" width={34} height={34} alt="" style={{flexShrink:0,borderRadius:8}} /><div><strong>资产账本</strong><small>ASSET LEDGER</small></div></Link>
}

export function PageIntro({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="ledger-page-intro"><div><h2>{title}</h2><p>{description}</p></div>{action}</div>
}

export function LedgerEmpty({ title = '从第一笔记录开始', description = '记下一笔现金、储蓄或投资，逐步建立你的资产全貌。' }: { title?: string; description?: string }) {
  return <div className="ledger-empty"><Wallet size={26} strokeWidth={1.2} /><h3>{title}</h3><p>{description}</p><Link href="/assets" className="ledger-button">前往资产管理 <ArrowUpRight size={16} /></Link></div>
}

export function ValuationNote() {
  return <details className="ledger-note"><summary>关于统计口径与估值</summary><p>汇总仅计人民币记录；净资产 = 总资产 − 债务余额。其他币种按原币展示，未作汇率换算。价格由你手动维护，浮盈不代表已实现收益。</p></details>
}

export function CategoryDistribution({ entries, total }: { entries: [string, number][]; total: number }) {
  return <div className="ledger-distribution">{entries.map(([key, value], index) => <div className="ledger-distribution-row" key={key}><div><span><i style={{ background: categoryColors[key] }} />{categoryLabels[key] || key}</span><b>{formatPercent(total > 0 ? value / total : 0)}</b></div><div className="ledger-track"><span style={{ width: `${total > 0 ? value / total * 100 : 0}%`, background: categoryColors[key] }} /></div><small>{formatCurrency(value)}<span>{String(index + 1).padStart(2, '0')}</span></small></div>)}</div>
}

export const categoryColors: Record<string, string> = { CASH: '#176d68', FIXED: '#6e9490', EQUITY: '#a9bc78', ALTERNATIVE: '#a1977e', REAL_ESTATE: '#354f60', DEBT: '#9b6d5c' }
