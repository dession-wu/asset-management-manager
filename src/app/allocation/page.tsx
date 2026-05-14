'use client'

import Link from 'next/link'
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  FileText,
  Settings,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAssetStore } from '@/stores/assetStore'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { UserMenu } from '@/components/auth/UserMenu'
import { formatCurrency, formatPercent } from '@/lib/utils'

const navItems = [
  { path: '/', label: '仪表盘', icon: LayoutDashboard },
  { path: '/assets', label: '资产管理', icon: Wallet },
  { path: '/allocation', label: '配置分析', icon: PieChart },
  { path: '/reports', label: '报表中心', icon: FileText },
  { path: '/settings', label: '设置', icon: Settings },
]

const categoryColors: Record<string, string> = {
  CASH: '#3b82f6',
  FIXED: '#10b981',
  EQUITY: '#f59e0b',
  ALTERNATIVE: '#8b5cf6',
  REAL_ESTATE: '#ef4444',
  DEBT: '#6b7280',
}

const categoryLabels: Record<string, string> = {
  CASH: '现金',
  FIXED: '固收',
  EQUITY: '权益',
  ALTERNATIVE: '另类',
  REAL_ESTATE: '房产',
  DEBT: '债务',
}

export default function AllocationPage() {
  const { assets, getTotalAssets, getAssetsByCategory } = useAssetStore()
  const totalAssets = getTotalAssets()
  const assetsByCategory = getAssetsByCategory()

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
                    item.path === '/allocation'
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
            <h1 className="text-xl font-semibold text-gray-900">配置分析</h1>
            <UserMenu />
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
              {assets.length === 0 ? (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                  <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">暂无资产数据，请先添加资产</p>
                </div>
              ) : (
                <>
                  {/* Allocation Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">资产类别分布</h2>
                      <div className="space-y-4">
                        {Object.entries(assetsByCategory).map(([category, value]) => {
                          const percent = totalAssets > 0 ? value / totalAssets : 0
                          return (
                            <div key={category}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">
                                  {categoryLabels[category] || category}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatPercent(percent)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all"
                                  style={{
                                    width: `${percent * 100}%`,
                                    backgroundColor: categoryColors[category] || '#6b7280',
                                  }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatCurrency(value)}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">配置概览</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">总资产</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">
                            {formatCurrency(totalAssets)}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">资产类别数</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">
                            {Object.keys(assetsByCategory).length}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">最大持仓</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">
                            {Object.entries(assetsByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">资产数量</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">
                            {assets.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Table */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">类别详情</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">类别</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">金额</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">占比</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">可视化</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(assetsByCategory)
                            .sort((a, b) => b[1] - a[1])
                            .map(([category, value]) => {
                              const percent = totalAssets > 0 ? value / totalAssets : 0
                              return (
                                <tr key={category} className="border-b border-gray-100">
                                  <td className="py-3 px-4 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: categoryColors[category] || '#6b7280' }}
                                      />
                                      {categoryLabels[category] || category}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                    {formatCurrency(value)}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                    {formatPercent(percent)}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="h-2 rounded-full"
                                        style={{
                                          width: `${percent * 100}%`,
                                          backgroundColor: categoryColors[category] || '#6b7280',
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
