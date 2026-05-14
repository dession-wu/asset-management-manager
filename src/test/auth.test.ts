import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginSchema, registerSchema } from '@/lib/validation'

describe('Auth Validation', () => {
  describe('loginSchema', () => {
    it('should validate correct login credentials', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
        rememberMe: false,
      })
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '123',
        rememberMe: false,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        nickname: 'TestUser',
      })
      expect(result.success).toBe(true)
    })

    it('should reject weak password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
        nickname: 'TestUser',
      })
      expect(result.success).toBe(false)
    })

    it('should reject mismatched passwords', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Different123!',
        nickname: 'TestUser',
      })
      expect(result.success).toBe(false)
    })

    it('should reject short nickname', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        nickname: 'T',
      })
      expect(result.success).toBe(false)
    })
  })
})
