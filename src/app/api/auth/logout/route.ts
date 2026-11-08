import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, verifyRefreshToken } from '@/lib/jwt'
import { revoke } from '@/lib/sessionRevocation'

export async function POST(request: NextRequest) {
  const token=request.headers.get('authorization')?.replace(/^Bearer /,'')
  if (!token) return NextResponse.json({error:'请重新登录'}, {status:401})
  try {
    const claims=await verifyToken(token)
    const body=await request.json().catch(()=>({}))
    // Older logins may lack sid. Revoke their refresh token as well.
    if (body.refreshToken) {
      const refresh=await verifyRefreshToken(body.refreshToken)
      if (refresh.sub!==claims.sub) return NextResponse.json({error:'会话不匹配'}, {status:403})
      await revoke(body.refreshToken,refresh.sid)
    }
    await revoke(token,claims.sid)
    return NextResponse.json({message:'已退出登录'}, {headers:{'Cache-Control':'no-store'}})
  } catch {
    return NextResponse.json({error:'登录状态已失效'}, {status:401})
  }
}
