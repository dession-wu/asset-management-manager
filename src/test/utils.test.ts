import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatPercent, cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'active', false && 'hidden')
      expect(result).toBe('base active')
    })
  })

  describe('formatCurrency', () => {
    it('should format CNY currency', () => {
      const result = formatCurrency(1234.56, 'CNY')
      expect(result).toContain('1,234.56')
    })

    it('should format USD currency', () => {
      const result = formatCurrency(1234.56, 'USD')
      expect(result).toContain('1,234.56')
    })
  })

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2024-01-15')
      expect(result).toContain('2024')
    })

    it('should format Date object', () => {
      const result = formatDate(new Date('2024-01-15'))
      expect(result).toContain('2024')
    })
  })

  describe('formatPercent', () => {
    it('should format percentage', () => {
      const result = formatPercent(0.1234)
      expect(result).toBe('12.34%')
    })

    it('should format zero', () => {
      const result = formatPercent(0)
      expect(result).toBe('0.00%')
    })
  })
})
