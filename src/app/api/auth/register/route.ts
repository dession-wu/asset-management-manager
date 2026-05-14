import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createToken, createRefreshToken } from '@/lib/jwt'
import { localStore } from '@/lib/localStore'
import { registerSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, nickname } = result.data

    // Check if user already exists
    const existingUser = await localStore.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user in local store
    const user = await localStore.createUser(email, passwordHash, nickname)

    // Generate tokens
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: error.message || '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}
