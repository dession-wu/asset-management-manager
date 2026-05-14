import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供认证令牌' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const claims = await verifyToken(token)

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', claims.sub)
      .single()

    if (error || !profile) {
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
    return NextResponse.json(
      { error: '无效的认证令牌' },
      { status: 401 }
    )
  }
}
