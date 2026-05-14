import { SignJWT, jwtVerify } from 'jose'
import type { JwtClaims } from '@/types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_SECRET || 'your-refresh-secret-change-in-production'
)

export async function createToken(payload: Omit<JwtClaims, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}

export async function createRefreshToken(payload: Omit<JwtClaims, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(REFRESH_SECRET)
}

export async function verifyToken(token: string): Promise<JwtClaims> {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    clockTolerance: 60,
  })
  return payload as unknown as JwtClaims
}

export async function verifyRefreshToken(token: string): Promise<JwtClaims> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET, {
    clockTolerance: 60,
  })
  return payload as unknown as JwtClaims
}
