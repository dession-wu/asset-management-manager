import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import type { JwtClaims } from '@/types'

/**
 * 从请求头解析 Bearer Token 并校验，返回 JWT claims。
 * 校验失败（未提供 / 格式错误 / 签名无效 / 已过期）一律返回 null，
 * 由各路由自行返回 401。
 */
export async function getUser(request: NextRequest): Promise<JwtClaims | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    return await verifyToken(authHeader.substring(7))
  } catch {
    return null
  }
}

/** UUID 格式校验：避免非法 id 直接触发 PostgreSQL 22P02 错误 */
export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}