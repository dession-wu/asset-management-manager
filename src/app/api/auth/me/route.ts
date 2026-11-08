import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/apiAuth'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未提供认证令牌或令牌无效' },
        { status: 401 }
      )
    }

    const profiles = await query<{
      id: string
      email: string
      nickname: string | null
      avatar_url: string | null
      created_at: Date
      updated_at: Date
    }>(
      'SELECT id, email, nickname, avatar_url, created_at, updated_at FROM users WHERE id = $1',
      [user.sub]
    )

    const profile = profiles[0]
    if (!profile) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      nickname: profile.nickname || profile.email.split('@')[0],
      avatar: profile.avatar_url,
      role: 'user',
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    )
  }
}