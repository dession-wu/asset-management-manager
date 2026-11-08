'use client'

import { useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { useAssetStore } from '@/stores/assetStore'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AssetWorkspace } from '@/components/AssetWorkspace'
import { PageIntro, LedgerEmpty, ValuationNote } from '@/components/ledger/LedgerUI'
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils'
import { categoryLabels, csvCell } from '@/lib/asset-display'

export default function ReportsPage() {
  const { assets, getTotalAssets, getNetWorth, getUnrealizedReturn, getReturnRate } = useAssetStore()
  const [generated] = useState(() => new Date())
  const total = getTotalAssets(), profit = getUnrealizedReturn()
  const exportCSV = () => {
    const rows = assets.map(a => [a.name, categoryLabels[a.category], a.quantity, a.costPrice, a.currentPrice, a.quantity * a.currentPrice, a.currency])
    const csv = [['名称', '类别', '数量', '成本价', '当前价', '当前价值', '币种'], ...rows].map(row => row.map(csvCell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a'); link.href = url; link.download = `资产报表_${generated.toLocaleDateString('sv-SE')}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <ProtectedRoute requireAuth><AssetWorkspace title="报表中心" actions={<><button className="ledger-button secondary" disabled={!assets.length} onClick={() => window.print()}><Printer size={15} />打印</button><button className="ledger-button" disabled={!assets.length} onClick={exportCSV}><Download size={15} />导出CSV</button></>}><PageIntro title="为下一次复盘，留一份记录。" description="这是一份当前持仓快照。CSV 保留全部币种的明细，也可在打印窗口另存为 PDF。" />
    {!assets.length ? <LedgerEmpty title="你的第一份报告，从记录开始" description="添加资产后，即可在这里查看持仓明细并导出报表。" /> : <article className="ledger-report"><header className="ledger-report-heading"><div><h2>个人资产账本报告</h2><p>生成日期：{formatDate(generated)} · 当前持仓快照</p></div><span className="ledger-overline">ASSET PILOT / PERSONAL LEDGER</span></header><dl className="ledger-inline-stats"><div><dt>净资产 · 人民币</dt><dd>{formatCurrency(getNetWorth())}</dd></div><div><dt>总资产 · 人民币</dt><dd>{formatCurrency(total)}</dd></div><div><dt>债务余额 · 人民币</dt><dd>{formatCurrency(total - getNetWorth())}</dd></div><div><dt>全部记录</dt><dd>{assets.length} 笔</dd></div></dl><ValuationNote /><section className="ledger-main-section"><div className="ledger-section-heading"><h3>资产明细</h3><small>全部币种 / 原币计价</small></div><div className="ledger-full-table"><table className="ledger-table"><thead><tr><th>资产名称</th><th>类别 / 币种</th><th className="numeric">数量</th><th className="numeric">成本价</th><th className="numeric">当前价</th><th className="numeric">当前价值</th><th className="numeric">持仓浮盈</th></tr></thead><tbody>{assets.map(a => { const p = (a.currentPrice - a.costPrice) * a.quantity; return <tr key={a.id}><td>{a.name}</td><td>{categoryLabels[a.category]}<small>{a.currency}</small></td><td className="numeric">{a.quantity}</td><td className="numeric">{formatCurrency(a.costPrice, a.currency)}</td><td className="numeric">{formatCurrency(a.currentPrice, a.currency)}</td><td className="numeric">{formatCurrency(a.quantity * a.currentPrice, a.currency)}</td><td className={`numeric ${p < 0 ? 'ledger-negative' : 'ledger-positive'}`}>{a.category === 'DEBT' ? '债务余额' : `${p >= 0 ? '+' : ''}${formatCurrency(p, a.currency)}`}</td></tr> })}</tbody></table></div></section><div className="ledger-report-foot"><p>人民币持仓浮盈：{profit >= 0 ? '+' : ''}{formatCurrency(profit)} / 收益率 {formatPercent(getReturnRate())}</p><p>本报告不包含历史交易和已实现收益，不同币种未作换算。金额基于手动维护的最新记录。</p></div></article>}
  </AssetWorkspace></ProtectedRoute>
}
