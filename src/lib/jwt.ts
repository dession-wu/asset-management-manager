import { SignJWT, jwtVerify } from 'jose'
import type { JwtClaims } from '@/types'

/**
 * JWT 密钥管理（fail-fast）
 *
 * JWT_SECRET / REFRESH_SECRET 必须通过环境变量提供，不再提供硬编码默认值。
 * 未设置时在服务启动（instrumentation.ts）以及首次签发/验签时抛出错误。
 */

function getSecret(name: 'JWT_SECRET' | 'REFRESH_SECRET'): Uint8Array {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} 环境变量未设置。请生成强随机密钥并通过环境变量注入，禁止使用默认值上线。`)
  }
  if (value.length < 32) {
    throw new Error(`${name} 长度不足 32 字符，存在被暴力破解风险，请使用强随机密钥。`)
  }
  return new TextEncoder().encode(value)
}

/** 启动期校验密钥是否已配置（供 instrumentation 调用，未配置则抛错阻止服务启动） */
export function assertJwtEnv(): void {
  getSecret('JWT_SECRET')
  getSecret('REFRESH_SECRET')
}

export async function createToken(payload: Omit<JwtClaims, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret('JWT_SECRET'))
}

export async function createRefreshToken(payload: Omit<JwtClaims, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret('REFRESH_SECRET'))
}

export async function verifyToken(token: string): Promise<JwtClaims> {
  const { payload } = await jwtVerify(token, getSecret('JWT_SECRET'), {
    clockTolerance: 60,
  })
  return payload as unknown as JwtClaims
}

export async function verifyRefreshToken(token: string): Promise<JwtClaims> {
  const { payload } = await jwtVerify(token, getSecret('REFRESH_SECRET'), {
    clockTolerance: 60,
  })
  return payload as unknown as JwtClaims
}