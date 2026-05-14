import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { localStore } from '@/lib/localStore'

async function getUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    const token = authHeader.substring(7)
    const claims = await verifyToken(token)
    return claims
  } catch {
    return null
  }
}

// In-memory assets storage (per user)
const assetsDB: Map<string, any[]> = new Map()
let assetIdCounter = 1

export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userAssets = assetsDB.get(user.sub) || []
  return NextResponse.json(userAssets)
}

export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const newAsset = {
      id: `asset_${assetIdCounter++}`,
      user_id: user.sub,
      name: body.name,
      category: body.category,
      quantity: body.quantity || 0,
      cost_price: body.cost_price || 0,
      current_price: body.current_price || 0,
      costPrice: body.cost_price || 0,
      currentPrice: body.current_price || 0,
      currency: body.currency || 'CNY',
      memo: body.memo || '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const userAssets = assetsDB.get(user.sub) || []
    userAssets.push(newAsset)
    assetsDB.set(user.sub, userAssets)

    return NextResponse.json(newAsset, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
