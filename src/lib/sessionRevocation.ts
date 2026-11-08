import { createHash } from 'node:crypto'
import { query } from '@/lib/db'

let ready: Promise<unknown> | null = null
async function init() {
  if (!ready) ready = query('CREATE TABLE IF NOT EXISTS revoked_sessions (id TEXT PRIMARY KEY, expires_at TIMESTAMPTZ NOT NULL)').catch(error => { ready = null; throw error })
  await ready
}
function id(token: string, sid?: string) { return createHash('sha256').update(sid || token).digest('hex') }
export async function assertActive(token: string, sid?: string) {
  await init()
  const rows = await query<{id: string}>('SELECT id FROM revoked_sessions WHERE id=$1 AND expires_at > NOW()', [id(token,sid)])
  if (rows.length) throw new Error('登录状态已失效')
}
export async function revoke(token: string, sid?: string) {
  await init()
  await query('DELETE FROM revoked_sessions WHERE expires_at < NOW()')
  await query("INSERT INTO revoked_sessions (id,expires_at) VALUES ($1,NOW()+INTERVAL '8 days') ON CONFLICT (id) DO UPDATE SET expires_at=EXCLUDED.expires_at",[id(token,sid)])
}
