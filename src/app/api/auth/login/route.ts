import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createToken, createRefreshToken } from '@/lib/jwt'
import { query } from '@/lib/db'
import { loginSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password } = result.data

    // 查询用户（含密码哈希）
    const users = await query<{
      id: string
      email: string
      password_hash: string
      nickname: string | null
      avatar_url: string | null
      created_at: Date
      updated_at: Date
    }>(
      'SELECT id, email, password_hash, nickname, avatar_url, created_at, updated_at FROM users WHERE email = $1',
      [email]
    )

    // 用户不存在与密码错误统一返回，避免账号枚举
    if (users.length === 0) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    const user = users[0]

    const passwordValid = await bcrypt.compare(password, user.password_hash)
    if (!passwordValid) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 更新最后登录时间
    await query(
      'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1',
      [user.id]
    )

    // 生成令牌
    const accessToken = await createToken({
      sub: user.id,
      email,
      role: 'user',
    })

    const refreshToken = await createRefreshToken({
      sub: user.id,
      email,
      role: 'user',
    })

    return NextResponse.json({
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      user: {
        id: user.id,
        email,
        nickname: user.nickname || email.split('@')[0],
        avatar: user.avatar_url,
        role: 'user',
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLoginAt: new Date().toISOString(),
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