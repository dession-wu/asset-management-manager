import { NextRequest, NextResponse } from 'next/server'
import { verifyRefreshToken, createToken, createRefreshToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { error: '缺少刷新令牌' },
        { status: 400 }
      )
    }

    const claims = await verifyRefreshToken(refreshToken)

    // Generate new tokens
    const newAccessToken = await createToken({
      sub: claims.sub,
      email: claims.email,
      role: claims.role,
    })

    const newRefreshToken = await createRefreshToken({
      sub: claims.sub,
      email: claims.email,
      role: claims.role,
    })

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    })
  } catch (error) {
    return NextResponse.json(
      { error: '无效的刷新令牌' },
      { status: 401 }
    )
  }
}
