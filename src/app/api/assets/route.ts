import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/apiAuth'
import { query } from '@/lib/db'
import { assetApiSchema, mapAssetRow } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rows = await query(
      `SELECT id, account_id, category, name, quantity, cost_price, current_price,
              currency, memo, is_active, created_at, updated_at
         FROM assets
        WHERE user_id = $1 AND is_active = true
        ORDER BY created_at DESC`,
      [user.sub]
    )

    return NextResponse.json(rows.map(mapAssetRow))
  } catch (error) {
    console.error('List assets error:', error)
    return NextResponse.json({ error: '获取资产列表失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const parsed = assetApiSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || '请求参数无效' },
        { status: 400 }
      )
    }

    const { name, category, quantity, cost_price, current_price, currency, memo } = parsed.data

    const rows = await query(
      `INSERT INTO assets (user_id, name, category, quantity, cost_price, current_price, currency, memo, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
       RETURNING id, account_id, category, name, quantity, cost_price, current_price,
                 currency, memo, is_active, created_at, updated_at`,
      [user.sub, name, category, quantity, cost_price, current_price, currency, memo]
    )

    return NextResponse.json(mapAssetRow(rows[0]), { status: 201 })
  } catch (error: any) {
    console.error('Create asset error:', error)
    return NextResponse.json(
      { error: error.message || '创建资产失败' },
      { status: 500 }
    )
  }
}
