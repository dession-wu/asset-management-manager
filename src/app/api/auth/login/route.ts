import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createToken, createRefreshToken } from '@/lib/jwt'
import { localStore } from '@/lib/localStore'
import { loginSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = result.data

    // Find user in local store
    const user = await localStore.findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // Update last login
    await localStore.updateLastLogin(user.id)

    // Get user profile
    const profile = await localStore.getProfileById(user.id)

    // Generate tokens
    const accessToken = await createToken({
      sub: user.id,
      email,
      role: user.role,
    })

    const refreshToken = await createRefreshToken({
      sub: user.id,
      email,
      role: user.role,
    })

    return NextResponse.json({
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      user: {
        id: user.id,
        email,
        nickname: profile?.nickname || user.nickname || email.split('@')[0],
        avatar: profile?.avatar_url,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
}
