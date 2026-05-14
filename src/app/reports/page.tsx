'use client'

import Link from 'next/link'
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  FileText,
  Settings,
  Download,
  Printer,
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

const categoryLabels: Record<string, string> = {
  CASH: '现金',
  FIXED: '固收',
  EQUITY: '权益',
  ALTERNATIVE: '另类',
  REAL_ESTATE: '房产',
  DEBT: '债务',
}

export default function ReportsPage() {
  const { assets, getTotalAssets, getAssetsByCategory } = useAssetStore()
  const totalAssets = getTotalAssets()
  const assetsByCategory = getAssetsByCategory()

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const headers = ['名称', '类别', '数量', '成本价', '当前价', '当前价值', '币种']
    const rows = assets.map((asset) => [
      asset.name,
      categoryLabels[asset.category] || asset.category,
      asset.quantity,
      asset.costPrice,
      asset.currentPrice,
      asset.currentPrice * asset.quantity,
      asset.currency,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `资产报表_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
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
                    item.path === '/reports'
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
            <h1 className="text-xl font-semibold text-gray-900">报表中心</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                导出CSV
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Printer className="w-4 h-4" />
                打印
              </button>
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500">总资产</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalAssets)}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500">资产数量</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{assets.length}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500">资产类别</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{Object.keys(assetsByCategory).length}</p>
                </div>
              </div>

              {/* Asset Detail Table */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">资产明细</h2>
                {assets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">暂无资产数据</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">名称</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">类别</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">数量</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">成本价</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">当前价</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">当前价值</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">盈亏</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.map((asset) => {
                          const currentValue = asset.currentPrice * asset.quantity
                          const costValue = asset.costPrice * asset.quantity
                          const profit = currentValue - costValue
                          const profitRate = costValue > 0 ? profit / costValue : 0

                          return (
                            <tr key={asset.id} className="border-b border-gray-100">
                              <td className="py-3 px-4 text-sm text-gray-900">{asset.name}</td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                {categoryLabels[asset.category] || asset.category}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right">{asset.quantity}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                {formatCurrency(asset.costPrice)}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                {formatCurrency(asset.currentPrice)}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                {formatCurrency(currentValue)}
                              </td>
                              <td className={`py-3 px-4 text-sm text-right ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {profit >= 0 ? '+' : ''}{formatCurrency(profit)} ({formatPercent(profitRate)})
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-200 font-medium">
                          <td colSpan={5} className="py-3 px-4 text-sm text-gray-900">合计</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">
                            {formatCurrency(totalAssets)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            {(() => {
                              const totalCost = assets.reduce((sum, a) => sum + a.costPrice * a.quantity, 0)
                              const totalProfit = totalAssets - totalCost
                              const totalRate = totalCost > 0 ? totalProfit / totalCost : 0
                              return (
                                <span className={totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)} ({formatPercent(totalRate)})
                                </span>
                              )
                            })()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* Category Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">类别汇总</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">类别</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">金额</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">占比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(assetsByCategory)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, value]) => (
                          <tr key={category} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-sm text-gray-900">
                              {categoryLabels[category] || category}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right">
                              {formatCurrency(value)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right">
                              {formatPercent(totalAssets > 0 ? value / totalAssets : 0)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
