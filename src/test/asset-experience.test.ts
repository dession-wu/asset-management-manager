import { beforeEach, describe, expect, it } from 'vitest'
import { useAssetStore } from '@/stores/assetStore'
import { csvCell } from '@/lib/asset-display'
import type { Asset } from '@/types'

const asset = (updates: Partial<Asset>): Asset => ({ id: 'test', accountId: '', name: '储蓄', category: 'CASH', currency: 'CNY', quantity: 1, costPrice: 100, currentPrice: 120, isActive: true, createdAt: '', updatedAt: '', ...updates })

describe('账本统计与导出', () => {
  beforeEach(() => useAssetStore.getState().reset())
  it('总资产不包含债务，净资产扣除债务，其他币种不直接相加', () => {
    useAssetStore.getState().setAssets([
      asset({}), asset({ category: 'DEBT', currentPrice: 50, costPrice: 50 }),
      asset({ currency: 'USD', currentPrice: 1000 }),
    ])
    const store = useAssetStore.getState()
    expect(store.getTotalAssets()).toBe(120)
    expect(store.getNetWorth()).toBe(70)
    expect(store.getUnrealizedReturn()).toBe(20)
    expect(store.getReturnRate()).toBe(0.2)
    expect(store.getAssetsByCategory()).toEqual({ CASH: 120 })
  })
  it('没有成本时不会产生无穷收益率', () => {
    useAssetStore.getState().setAssets([asset({ costPrice: 0 })])
    expect(useAssetStore.getState().getReturnRate()).toBe(0)
  })
  it('账户退出后清空内存中的账本数据', () => {
    useAssetStore.getState().setAssets([asset({})])
    useAssetStore.getState().reset()
    expect(useAssetStore.getState().assets).toEqual([])
  })
  it('CSV 保留中文、双引号与换行，并保护公式开头的名称', () => {
    expect(csvCell('基金"A",\n组合')).toBe('"基金""A"",\n组合"')
    expect(csvCell(' =SUM(A1)')).toBe('"\' =SUM(A1)"')
    expect(csvCell(-20)).toBe('"-20"')
  })
})
