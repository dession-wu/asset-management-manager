'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  FileText,
  Settings,
  Plus,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAssetStore } from '@/stores/assetStore'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { UserMenu } from '@/components/auth/UserMenu'
import { formatCurrency } from '@/lib/utils'
import type { Asset } from '@/types'

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

export default function AssetsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { assets, setAssets, addAsset, updateAsset, deleteAsset } = useAssetStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: 'CASH' as const,
    quantity: '',
    costPrice: '',
    currentPrice: '',
    currency: 'CNY',
    memo: '',
  })

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const assetData = {
      name: formData.name,
      category: formData.category,
      quantity: Number(formData.quantity),
      cost_price: Number(formData.costPrice),
      current_price: Number(formData.currentPrice),
      currency: formData.currency,
      memo: formData.memo,
      account_id: 'default',
    }

    try {
      if (editingAsset) {
        const response = await fetch(`/api/assets/${editingAsset.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(assetData),
        })

        if (response.ok) {
          const updated = await response.json()
          updateAsset(editingAsset.id, updated)
        }
      } else {
        const response = await fetch('/api/assets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(assetData),
        })

        if (response.ok) {
          const created = await response.json()
          addAsset(created)
        }
      }

      setIsModalOpen(false)
      setEditingAsset(null)
      setFormData({
        name: '',
        category: 'CASH',
        quantity: '',
        costPrice: '',
        currentPrice: '',
        currency: 'CNY',
        memo: '',
      })
    } catch (error) {
      console.error('Failed to save asset:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setFormData({
      name: asset.name,
      category: asset.category,
      quantity: String(asset.quantity),
      costPrice: String(asset.costPrice),
      currentPrice: String(asset.currentPrice),
      currency: asset.currency,
      memo: asset.memo || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个资产吗？')) return

    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (response.ok) {
        deleteAsset(id)
      }
    } catch (error) {
      console.error('Failed to delete asset:', error)
    }
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
                    item.path === '/assets'
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
            <h1 className="text-xl font-semibold text-gray-900">资产管理</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setEditingAsset(null)
                  setFormData({
                    name: '',
                    category: 'CASH',
                    quantity: '',
                    costPrice: '',
                    currentPrice: '',
                    currency: 'CNY',
                    memo: '',
                  })
                  setIsModalOpen(true)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加资产
              </button>
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">名称</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">类别</th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">数量</th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">成本价</th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">当前价</th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">当前价值</th>
                        <th className="text-center py-4 px-6 text-sm font-medium text-gray-500">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-500">
                            暂无资产，点击"添加资产"开始管理
                          </td>
                        </tr>
                      ) : (
                        assets.map((asset) => (
                          <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-6 text-sm text-gray-900">{asset.name}</td>
                            <td className="py-4 px-6 text-sm text-gray-500">
                              {categoryLabels[asset.category] || asset.category}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900 text-right">{asset.quantity}</td>
                            <td className="py-4 px-6 text-sm text-gray-900 text-right">
                              {formatCurrency(asset.costPrice)}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900 text-right">
                              {formatCurrency(asset.currentPrice)}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900 text-right">
                              {formatCurrency(asset.currentPrice * asset.quantity)}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(asset)}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(asset.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingAsset ? '编辑资产' : '添加资产'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">资产名称</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">类别</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="CASH">现金</option>
                  <option value="FIXED">固收</option>
                  <option value="EQUITY">权益</option>
                  <option value="ALTERNATIVE">另类</option>
                  <option value="REAL_ESTATE">房产</option>
                  <option value="DEBT">债务</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">数量</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">币种</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">成本价</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">当前价</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">备注</label>
                <textarea
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}
