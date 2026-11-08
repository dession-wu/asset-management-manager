'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Wallet, PieChart, FileText, Check, Landmark, Building2, CreditCard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LedgerBrand } from '@/components/ledger/LedgerUI'

const sample = [
  { label: '现金储蓄', Icon: Landmark, amount: '180,000', share: 30, color: '#285e50' },
  { label: '投资持仓', Icon: PieChart, amount: '300,000', share: 50, color: '#72978b' },
  { label: '其他资产', Icon: Building2, amount: '120,000', share: 20, color: '#b6c5ba' },
]
export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const [view, setView] = useState<'assets'|'debt'>('assets')
  const destination = isAuthenticated && !isLoading ? '/dashboard' : '/register'
  const action = isAuthenticated && !isLoading ? '进入我的账本' : '建立我的账本'
  return <div className="wealth-home"><header className="wealth-header wealth-container"><LedgerBrand /><nav aria-label="首页导航"><a href="#overview">账本预览</a><a href="#features">记录什么</a></nav><div><Link href="/login">登录</Link><Link href={destination} className="wealth-button">{action}<ArrowRight size={15}/></Link></div></header>
    <main><section className="wealth-hero wealth-container"><div className="wealth-hero-copy"><p className="wealth-kicker"><Wallet size={16}/>个人资产记录工具</p><h1>每一笔资产，<br/>都有清楚的去向。</h1><p className="wealth-lede">把现金、投资、房产与负债记在一起，<br className="wealth-desktop-break"/>看清持有多少，理解资金如何分布。</p><div className="wealth-hero-actions"><Link className="wealth-button" href={destination}>{action}<ArrowRight size={17}/></Link><a href="#overview">先看一份示例 ↓</a></div><p className="wealth-quiet"><Check size={14}/>从一笔记录开始，不必一次整理完。</p></div>
      <section className="wealth-demo" id="overview" aria-label="示例账本"><div className="wealth-demo-head"><span><i/>资产总览</span><small>演示数据</small></div><p className="wealth-number-label">净资产 · 人民币</p><strong className="wealth-net">¥ 520,000<span>.00</span></strong><div className="wealth-equation"><span>总资产 <b>600,000</b></span><span>负债 <b>80,000</b></span></div><div className="wealth-tabs" role="tablist" aria-label="示例账本视图"><button id="sample-assets" role="tab" aria-selected={view === 'assets'} aria-controls="wealth-sample" onClick={() => setView('assets')}>资产构成</button><button id="sample-debt" role="tab" aria-selected={view === 'debt'} aria-controls="wealth-sample" onClick={() => setView('debt')}>负债记录</button></div><div id="wealth-sample" role="tabpanel" aria-labelledby={view === 'assets' ? 'sample-assets':'sample-debt'}>{view === 'assets' ? <><div className="wealth-allocation" aria-label="现金30%，投资50%，其他20%">{sample.map(row => <i key={row.label} style={{width:`${row.share}%`,background:row.color}}/>)}</div><div className="wealth-sample-rows">{sample.map(({label,Icon,amount,color,share}) => <div key={label}><span><i style={{background:color}}/>{label}</span><span><b>¥ {amount}</b><small>{share}%</small></span></div>)}</div></> : <div className="wealth-debt"><CreditCard size={25}/><div><strong>贷款余额</strong><span>¥ 80,000.00</span></div><p>记录未偿还的余额，计算净资产时扣除。</p></div>}</div><p className="wealth-demo-note">手动记录与估值 · 示例不代表真实账户</p></section></section>
      <section className="wealth-principles wealth-container" id="features"><div className="wealth-section-head"><p className="wealth-kicker">看清全貌，再做判断</p><h2>一本账，连接你的资产全貌。</h2><p>关心实际持有，也给下一次复盘留下依据。</p></div><div className="wealth-feature-grid">{[[Wallet,'记录持有','现金、储蓄、投资与房产，分类整理数量、成本和当前估值。'],[PieChart,'理解分布','查看资产类别占比，对照负债余额，理解自己的资金结构。'],[FileText,'定期复盘','查看持仓与浮盈，导出账本记录，为阶段性回顾保留依据。']].map(([Icon,title,desc],index) => { const Mark=Icon as typeof Wallet;return <article key={index}><Mark size={24} strokeWidth={1.5}/><h3>{String(title)}</h3><p>{String(desc)}</p></article>})}</div></section>
      <section className="wealth-bottom wealth-container"><div><h2>先把第一笔，记清楚。</h2><p>你的资产节奏，由你自己掌握。</p></div><Link href={destination} className="wealth-button">{action}<ArrowRight size={17}/></Link></section></main><footer className="wealth-footer wealth-container"><LedgerBrand/><span>记录当下，面向长期。</span><Link href="/login">登录账本 <ArrowRight size={14}/></Link></footer></div>
}
