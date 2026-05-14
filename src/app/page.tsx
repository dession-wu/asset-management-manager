'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
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

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { assets, getTotalAssets, getNetWorth, getAssetsByCategory } = useAssetStore()

  const totalAssets = getTotalAssets()
  const netWorth = getNetWorth()
  const assetsByCategory = getAssetsByCategory()

  // Mock data for display
  const monthlyReturn = 1250.5
  const monthlyReturnRate = 0.025
  const yearlyReturn = 15200.0
  const yearlyReturnRate = 0.12

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
                    item.path === '/'
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
            <h1 className="text-xl font-semibold text-gray-900">仪表盘</h1>
            <UserMenu />
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">总资产</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(totalAssets)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">净资产</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(netWorth)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">本月收益</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(monthlyReturn)}
                      </p>
                      <p className={`text-sm mt-1 ${monthlyReturnRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {monthlyReturnRate >= 0 ? '+' : ''}{formatPercent(monthlyReturnRate)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">本年收益</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(yearlyReturn)}
                      </p>
                      <p className={`text-sm mt-1 ${yearlyReturnRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {yearlyReturnRate >= 0 ? '+' : ''}{formatPercent(yearlyReturnRate)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset Categories */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">资产分布</h2>
                {Object.keys(assetsByCategory).length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">暂无资产数据</p>
                    <button
                      onClick={() => router.push('/assets')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      添加资产
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(assetsByCategory).map(([category, value]) => (
                      <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">{category}</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {formatCurrency(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Assets */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">最近资产</h2>
                  <Link
                    href="/assets"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    查看全部
                  </Link>
                </div>
                {assets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">暂无资产</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">名称</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">类别</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">数量</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">当前价值</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.slice(0, 5).map((asset) => (
                          <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{asset.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-500">{asset.category}</td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right">{asset.quantity}</td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right">
                              {formatCurrency(asset.currentPrice * asset.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
