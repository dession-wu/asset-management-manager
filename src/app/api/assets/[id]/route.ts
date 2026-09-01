import { NextRequest, NextResponse } from 'next/server'
import { getUser, isUuid } from '@/lib/apiAuth'
import { query } from '@/lib/db'
import { assetUpdateApiSchema, mapAssetRow } from '@/lib/validation'

const SELECT_COLUMNS = `id, account_id, category, name, quantity, cost_price, current_price,
                        currency, memo, is_active, created_at, updated_at`

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!isUuid(id)) {
    return NextResponse.json({ error: '资产 ID 格式无效' }, { status: 400 })
  }

  try {
    const rows = await query(
      `SELECT ${SELECT_COLUMNS} FROM assets WHERE id = $1 AND user_id = $2`,
      [id, user.sub]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: '资产不存在' }, { status: 404 })
    }

    return NextResponse.json(mapAssetRow(rows[0]))
  } catch (error) {
    console.error('Get asset error:', error)
    return NextResponse.json({ error: '获取资产失败' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!isUuid(id)) {
    return NextResponse.json({ error: '资产 ID 格式无效' }, { status: 400 })
  }

  try {
    const body = await request.json()

    const parsed = assetUpdateApiSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || '请求参数无效' },
        { status: 400 }
      )
    }

    /* 白名单字段：user_id / account_id / created_at 不可透传修改 */
    const allowedFields = ['name', 'category', 'quantity', 'cost_price', 'current_price', 'currency', 'memo'] as const
    const updates = allowedFields.filter((field) => parsed.data[field] !== undefined)

    if (updates.length === 0) {
      return NextResponse.json({ error: '没有可更新的字段' }, { status: 400 })
    }

    const setClauses = updates.map((field, index) => `${field} = $${index + 1}`)
    const values = updates.map((field) => parsed.data[field])
    setClauses.push(`updated_at = NOW()`)

    const rows = await query(
      `UPDATE assets SET ${setClauses.join(', ')}
        WHERE id = $${updates.length + 1} AND user_id = $${updates.length + 2}
        RETURNING ${SELECT_COLUMNS}`,
      [...values, id, user.sub]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: '资产不存在' }, { status: 404 })
    }

    return NextResponse.json(mapAssetRow(rows[0]))
  } catch (error: any) {
    console.error('Update asset error:', error)
    return NextResponse.json(
      { error: error.message || '更新资产失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!isUuid(id)) {
    return NextResponse.json({ error: '资产 ID 格式无效' }, { status: 400 })
  }

  try {
    /* 软删除：置 is_active = false，保留数据 */
    const rows = await query(
      `UPDATE assets SET is_active = false, updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING id`,
      [id, user.sub]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: '资产不存在' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete asset error:', error)
    return NextResponse.json({ error: '删除资产失败' }, { status: 500 })
  }
}