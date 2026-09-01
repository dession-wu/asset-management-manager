import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createToken, createRefreshToken } from '@/lib/jwt'
import { query } from '@/lib/db'
import { registerSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password, nickname } = result.data

    // 检查邮箱是否已注册
    const existing = await query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    if (existing.length > 0) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      )
    }

    // 密码哈希后入库（bcrypt，cost 12）
    const passwordHash = await bcrypt.hash(password, 12)

    const users = await query<{
      id: string
      email: string
      nickname: string | null
      avatar_url: string | null
      created_at: Date
      updated_at: Date
    }>(
      `INSERT INTO users (email, password_hash, nickname, risk_profile)
       VALUES ($1, $2, $3, 'MODERATE')
       RETURNING id, email, nickname, avatar_url, created_at, updated_at`,
      [email, passwordHash, nickname]
    )
    const user = users[0]

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
        nickname,
        role: 'user',
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    })
  } catch (error: any) {
    // 并发注册撞唯一约束时兜底返回 409
    if (error?.code === '23505') {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      )
    }
    console.error('Register error:', error)
    return NextResponse.json(
      { error: error?.message || '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}