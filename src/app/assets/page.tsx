'use client'

import { Fragment, useState } from 'react'
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { assetRequest } from '@/lib/client-api'
import { AssetDialog } from '@/components/AssetDialog'
import { useAssetStore } from '@/stores/assetStore'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AssetWorkspace } from '@/components/AssetWorkspace'
import { PageIntro, ValuationNote } from '@/components/ledger/LedgerUI'
import { categoryLabels } from '@/lib/asset-display'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Asset, AssetCategory } from '@/types'

const emptyForm = { name: '', category: 'CASH' as AssetCategory, quantity: '1', costPrice: '', currentPrice: '', currency: 'CNY', memo: '' }

export default function AssetsPage() {
  const { assets, addAsset, updateAsset, deleteAsset } = useAssetStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Asset | null>(null)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState('recent')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const visible = assets.filter(a => (category === 'ALL' || a.category === category) && a.name.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name, 'zh-CN') : new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
  const change = (key: keyof typeof form, value: string) => { setForm(f => ({ ...f, [key]: value })); setDirty(true); setError('') }
  const openNew = () => { setEditing(null); setForm(emptyForm); setError(''); setDirty(false); setOpen(true) }
  const edit = (asset: Asset) => {
    setEditing(asset); setError(''); setDirty(false)
    setForm({ name: asset.name, category: asset.category, quantity: String(asset.quantity), costPrice: String(asset.costPrice), currentPrice: String(asset.currentPrice), currency: asset.currency, memo: asset.memo || '' }); setOpen(true)
  }
  const close = () => { if (!saving && (!dirty || confirm('修改尚未保存，确定放弃这些输入吗？'))) setOpen(false) }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    if (!form.name.trim()) { setError('请输入资产名称'); return }
    setError(''); setSaving(true)
    try {
      const body = { name: form.name.trim(), category: form.category, quantity: Number(form.quantity), cost_price: Number(form.costPrice), current_price: Number(form.currentPrice), currency: form.currency, memo: form.memo }
      const result = await assetRequest<Asset>(editing ? `/api/assets/${editing.id}` : '/api/assets', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(body) })
      if (editing) updateAsset(editing.id, result); else addAsset(result)
      setOpen(false); setDirty(false); toast.success(editing ? '资产已更新' : '资产已添加')
    } catch (err) { setError(err instanceof Error ? err.message : '保存失败，请重试') } finally { setSaving(false) }
  }
  const remove = async (a: Asset) => {
    if (deleting || !confirm(`确定删除「${a.name}」吗？它将从资产列表和汇总中移除。`)) return
    setDeleting(a.id)
    try { await assetRequest(`/api/assets/${a.id}`, { method: 'DELETE' }); deleteAsset(a.id); toast.success('资产已删除') } catch (err) { toast.error(err instanceof Error ? err.message : '删除失败，请重试') } finally { setDeleting(null) }
  }
  const actions = (a: Asset) => <><button className="ledger-icon-button" aria-label={`编辑 ${a.name}`} onClick={() => edit(a)}><Pencil size={15} /></button><button className="ledger-icon-button" aria-label={`删除 ${a.name}`} disabled={deleting !== null} onClick={() => remove(a)}><Trash2 size={15} /></button></>
  const detail = (a: Asset) => <dl><div><dt>持有数量</dt><dd>{a.quantity}</dd></div><div><dt>成本单价</dt><dd>{formatCurrency(a.costPrice, a.currency)}</dd></div><div><dt>当前单价</dt><dd>{formatCurrency(a.currentPrice, a.currency)}</dd></div><div><dt>更新日期</dt><dd>{a.updatedAt ? formatDate(a.updatedAt) : '暂无记录'}</dd></div>{a.memo && <div><dt>备注</dt><dd style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{a.memo}</dd></div>}</dl>
  return <ProtectedRoute requireAuth><AssetWorkspace title="资产管理" actions={<button className="ledger-button" onClick={openNew}><Plus size={15} />添加资产</button>}><PageIntro title="每一笔持有，都有出处。" description="集中记录资产与债务。查看当前价值，展开明细，随时更新你的估值。" />
    <div className="ledger-toolbar"><label className="ledger-search">搜索资产<input type="search" placeholder="输入资产名称" value={search} onChange={e => setSearch(e.target.value)} /></label><label>资产类别<select value={category} onChange={e => setCategory(e.target.value)}><option value="ALL">全部类别</option>{Object.entries(categoryLabels).map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></label><label>排序<select value={sort} onChange={e => setSort(e.target.value)}><option value="recent">最近更新</option><option value="name">名称排序</option></select></label><p className="ledger-result-count" role="status">显示 {visible.length} / {assets.length} 条</p></div>
    {!visible.length ? <div className="ledger-empty"><h3>{assets.length ? '没有找到匹配资产' : '从一笔现金或储蓄开始'}</h3><p>{assets.length ? '试试其他名称，或清除筛选条件。' : '现金、整笔投资或房产，都可以按「数量 1 × 总金额」录入。'}</p><button className="ledger-button" onClick={assets.length ? () => { setSearch(''); setCategory('ALL') } : openNew}>{assets.length ? '清除筛选' : '添加第一笔资产'}</button></div> : <>
      <div className="ledger-desktop-assets"><table className="ledger-table"><thead><tr><th>资产名称</th><th>类别</th><th className="numeric">当前价值</th><th className="numeric">持仓浮盈</th><th className="numeric">记录操作</th></tr></thead><tbody>{visible.map(a => { const profit = (a.currentPrice - a.costPrice) * a.quantity; return <Fragment key={a.id}><tr><td className="ledger-asset-name">{a.name}<small>{a.currency}</small></td><td>{categoryLabels[a.category]}</td><td className="numeric">{formatCurrency(a.quantity * a.currentPrice, a.currency)}</td><td className={`numeric ${profit < 0 ? 'ledger-negative' : 'ledger-positive'}`}>{a.category === 'DEBT' ? <span className="ledger-muted">债务余额</span> : `${profit >= 0 ? '+' : ''}${formatCurrency(profit, a.currency)}`}</td><td><div className="ledger-row-actions"><button className="ledger-icon-button" aria-expanded={expanded === a.id} aria-label={`${expanded === a.id ? '收起' : '展开'} ${a.name} 详情`} onClick={() => setExpanded(expanded === a.id ? null : a.id)}>{expanded === a.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>{actions(a)}</div></td></tr>{expanded === a.id && <tr className="ledger-detail-row"><td colSpan={5}>{detail(a)}</td></tr>}</Fragment> })}</tbody></table></div>
      <div className="ledger-mobile-assets">{visible.map(a => <article className="ledger-mobile-asset" key={a.id}><div><div><h3>{a.name}</h3><small>{categoryLabels[a.category]} · {a.currency}</small></div><b>{formatCurrency(a.quantity * a.currentPrice, a.currency)}</b></div><details><summary>查看明细与操作</summary>{detail(a)}<div className="ledger-row-actions">{actions(a)}</div></details></article>)}</div>
    </>}<ValuationNote />
  </AssetWorkspace>{open && <AssetDialog titleId="asset-form-title" busy={saving} onClose={close}><div className="ledger-dialog-header"><h2 id="asset-form-title">{editing ? '编辑资产' : '添加资产'}</h2><button className="ledger-icon-button" aria-label="关闭资产表单" disabled={saving} onClick={close}><X size={18} /></button></div><form className="ledger-dialog-form" onSubmit={submit}>{error && <p role="alert" className="ledger-alert">{error}，已保留你的输入。</p>}<fieldset disabled={saving}>
    <fieldset className="ledger-form-section"><legend>01 / 基本信息</legend><div className="ledger-field"><label htmlFor="asset-name">资产名称</label><input id="asset-name" required autoFocus maxLength={100} value={form.name} placeholder="例如：日常储蓄、指数基金" onChange={e => change('name', e.target.value)} /></div><div className="ledger-form-grid"><div className="ledger-field"><label htmlFor="asset-category">类别</label><select id="asset-category" value={form.category} onChange={e => change('category', e.target.value)}>{Object.entries(categoryLabels).map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></div><div className="ledger-field"><label htmlFor="asset-currency">币种</label><select id="asset-currency" value={form.currency} onChange={e => change('currency', e.target.value)}>{Array.from(new Set(['CNY', 'USD', 'HKD', 'EUR', 'GBP', 'JPY', form.currency])).map(v => <option key={v} value={v}>{v}</option>)}</select></div></div></fieldset>
    <fieldset className="ledger-form-section"><legend>02 / 数量与估值</legend><p className="ledger-hint" style={{ marginTop: -7, marginBottom: 14 }}>{form.category === 'DEBT' ? '债务填写正数余额；数量为 1 时，当前价即尚欠总金额。' : form.category === 'CASH' || form.category === 'REAL_ESTATE' ? '按总金额录入时，数量填 1，成本价和当前价填写整笔金额。' : '填写持有数量与每单位价格，账本会自动计算当前价值。'}</p><div className="ledger-field"><label htmlFor="asset-quantity">数量</label><input id="asset-quantity" type="number" required min="0" step="any" value={form.quantity} onChange={e => change('quantity', e.target.value)} /></div><div className="ledger-form-grid"><div className="ledger-field"><label htmlFor="asset-cost">成本价</label><input id="asset-cost" type="number" required min="0" step="any" value={form.costPrice} onChange={e => change('costPrice', e.target.value)} /></div><div className="ledger-field"><label htmlFor="asset-price">当前价</label><input id="asset-price" type="number" required min="0" step="any" value={form.currentPrice} onChange={e => change('currentPrice', e.target.value)} /></div></div></fieldset>
    <fieldset className="ledger-form-section"><legend>03 / 补充说明</legend><div className="ledger-field"><label htmlFor="asset-memo">备注（选填）</label><textarea id="asset-memo" rows={2} maxLength={500} value={form.memo} placeholder="记录估值依据或其他需要留存的信息" onChange={e => change('memo', e.target.value)} /></div></fieldset></fieldset><div className="ledger-value-preview" aria-live="polite"><span>{form.category === 'DEBT' ? '债务余额' : '当前价值'}</span><strong>{formatCurrency(Number(form.quantity || 0) * Number(form.currentPrice || 0), form.currency)}</strong></div><p className="ledger-hint">{form.category === 'DEBT' ? '保存后从人民币净资产中扣除（仅人民币债务）。' : '数量 × 当前价。汇总仅计人民币，其他币种保留原币记录。'}</p><div className="ledger-dialog-footer"><button type="button" className="ledger-button secondary" disabled={saving} onClick={close}>取消</button><button type="submit" className="ledger-button" disabled={saving} aria-busy={saving}>{saving ? '保存中…' : editing ? '保存修改' : '保存资产'}</button></div></form></AssetDialog>}</ProtectedRoute>
}
