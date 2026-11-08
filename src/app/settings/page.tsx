'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AssetWorkspace } from '@/components/AssetWorkspace'
import { PageIntro } from '@/components/ledger/LedgerUI'
import { useAssetStore } from '@/stores/assetStore'

const notifications = [
  { key: 'priceAlerts', label: '价格预警', description: '资产价格大幅波动时提醒' },
  { key: 'rebalanceReminders', label: '再平衡提醒', description: '资产配置偏离目标时提醒' },
  { key: 'weeklyReports', label: '周报', description: '每周的资产状况报告' },
  { key: 'monthlyReports', label: '月报', description: '每月的资产状况报告' },
  { key: 'backupReminders', label: '备份提醒', description: '定期提醒备份数据' },
] as const

export default function SettingsPage() {
  const { user } = useAuth()
  const { userSettings: settings, setUserSettings } = useAssetStore()
  const [tab, setTab] = useState('profile')
  return <ProtectedRoute requireAuth><AssetWorkspace title="设置"><div className="ledger-settings"><PageIntro title="让账本适合你的习惯。" description="账户信息与本机偏好分开管理，能力边界清楚可见。" /><div className="ledger-settings-tabs" aria-label="设置分类">{[['profile', '个人资料'], ['notifications', '通知设置'], ['security', '安全设置']].map(([id, label]) => <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</div><div className="ledger-settings-body">
    {tab === 'profile' && <><p className="ledger-info">偏好自动保存在当前浏览器，暂不跨设备同步；退出账户会清除本机偏好。账户邮箱以登录信息为准。</p><div className="ledger-main-section"><div className="ledger-form-grid"><div className="ledger-field"><label htmlFor="profile-name">本机显示昵称</label><input id="profile-name" maxLength={20} value={settings.nickname} onChange={e => setUserSettings({ ...settings, nickname: e.target.value })} /></div><div className="ledger-field"><label htmlFor="profile-email">邮箱</label><input id="profile-email" type="email" disabled value={user?.email || ''} /><p className="ledger-hint">用于登录，此处暂不支持修改。</p></div><div className="ledger-field"><label htmlFor="profile-phone">手机号（选填）</label><input id="profile-phone" type="tel" value={settings.phone} onChange={e => setUserSettings({ ...settings, phone: e.target.value })} /></div><div className="ledger-field"><label htmlFor="profile-risk">风险偏好</label><select id="profile-risk" value={settings.riskProfile} onChange={e => setUserSettings({ ...settings, riskProfile: e.target.value })}>{[['CONSERVATIVE', '保守型'], ['MODERATE', '稳健型'], ['BALANCED', '平衡型'], ['AGGRESSIVE', '积极型'], ['RADICAL', '激进型']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><p className="ledger-hint">仅作为你的偏好记录，不生成配置建议。</p></div></div></div></>}
    {tab === 'notifications' && <><p className="ledger-info">通知发送尚未接入。以下选项仅保存偏好，不会实际发送预警或报告。</p>{notifications.map(n => <div className="ledger-setting-row" key={n.key}><div><strong>{n.label}</strong><p>{n.description}</p></div><input aria-label={n.label} type="checkbox" checked={settings.notifications[n.key]} onChange={e => setUserSettings({ ...settings, notifications: { ...settings.notifications, [n.key]: e.target.checked } })} /></div>)}</>}
    {tab === 'security' && <><p className="ledger-info">加密和自动锁定尚未接入，暂不可启用。使用共用设备后，请通过右上角菜单退出账户。</p>{[['数据库加密', '对本地存储的数据进行加密'], ['自动锁定', '一段时间不操作后自动锁定']].map(([title, description]) => <div className="ledger-setting-row" key={title}><div><strong>{title}</strong><p>{description} · 尚未接入</p></div><input type="checkbox" checked={false} disabled aria-label={`${title}（尚未接入）`} /></div>)}</>}
  </div></div></AssetWorkspace></ProtectedRoute>
}
