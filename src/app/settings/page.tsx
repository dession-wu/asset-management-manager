'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  FileText,
  Settings,
  Bell,
  Shield,
  User,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAssetStore } from '@/stores/assetStore'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { UserMenu } from '@/components/auth/UserMenu'

const navItems = [
  { path: '/', label: '仪表盘', icon: LayoutDashboard },
  { path: '/assets', label: '资产管理', icon: Wallet },
  { path: '/allocation', label: '配置分析', icon: PieChart },
  { path: '/reports', label: '报表中心', icon: FileText },
  { path: '/settings', label: '设置', icon: Settings },
]

export default function SettingsPage() {
  const { user } = useAuth()
  const { userSettings, setUserSettings } = useAssetStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile')

  const handleNotificationChange = (key: string, value: boolean) => {
    setUserSettings({
      ...userSettings,
      notifications: {
        ...userSettings.notifications,
        [key]: value,
      },
    })
  }

  const handleSecurityChange = (key: string, value: boolean | number) => {
    setUserSettings({
      ...userSettings,
      security: {
        ...userSettings.security,
        [key]: value,
      },
    })
  }

  return (
    <ProtectedRoute requireAuth>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 font-bold text-xl text-gray-900">资产管理</span>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                    item.path === '/settings'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h1 className="text-xl font-semibold text-gray-900">设置</h1>
            <UserMenu />
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'profile'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    个人资料
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'notifications'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    通知设置
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'security'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    安全设置
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">昵称</label>
                        <input
                          type="text"
                          value={userSettings.nickname}
                          onChange={(e) =>
                            setUserSettings({ ...userSettings, nickname: e.target.value })
                          }
                          className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">邮箱</label>
                        <input
                          type="email"
                          value={userSettings.email}
                          disabled
                          className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">手机号</label>
                        <input
                          type="tel"
                          value={userSettings.phone}
                          onChange={(e) =>
                            setUserSettings({ ...userSettings, phone: e.target.value })
                          }
                          className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">风险偏好</label>
                        <select
                          value={userSettings.riskProfile}
                          onChange={(e) =>
                            setUserSettings({ ...userSettings, riskProfile: e.target.value })
                          }
                          className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="CONSERVATIVE">保守型</option>
                          <option value="MODERATE">稳健型</option>
                          <option value="BALANCED">平衡型</option>
                          <option value="AGGRESSIVE">积极型</option>
                          <option value="RADICAL">激进型</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="space-y-4">
                      {[
                        { key: 'priceAlerts', label: '价格预警', description: '当资产价格大幅波动时通知我' },
                        { key: 'rebalanceReminders', label: '再平衡提醒', description: '当资产配置偏离目标时提醒' },
                        { key: 'weeklyReports', label: '周报', description: '每周发送资产状况报告' },
                        { key: 'monthlyReports', label: '月报', description: '每月发送资产状况报告' },
                        { key: 'backupReminders', label: '备份提醒', description: '定期提醒备份数据' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userSettings.notifications[item.key as keyof typeof userSettings.notifications]}
                              onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">数据库加密</p>
                          <p className="text-sm text-gray-500">对本地存储的数据进行加密</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userSettings.security.dbEncryption}
                            onChange={(e) => handleSecurityChange('dbEncryption', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">自动锁定</p>
                          <p className="text-sm text-gray-500">一段时间不操作后自动锁定</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userSettings.security.autoLock}
                            onChange={(e) => handleSecurityChange('autoLock', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                        </label>
                      </div>
                      {userSettings.security.autoLock && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">自动锁定时间（分钟）</label>
                          <input
                            type="number"
                            min="1"
                            max="60"
                            value={userSettings.security.autoLockTimeout}
                            onChange={(e) =>
                              handleSecurityChange('autoLockTimeout', Number(e.target.value))
                            }
                            className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
