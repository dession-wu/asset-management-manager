import { Pool } from 'pg'

/**
 * PostgreSQL 连接池（懒加载单例）
 *
 * 连接信息通过 DATABASE_URL 环境变量注入，例如：
 * DATABASE_URL=postgres://user:password@localhost:5432/asset_manager
 *
 * 未设置 DATABASE_URL 时在首次查询抛出错误（fail-fast），
 * 而非在模块加载时抛出，避免 next build 阶段（不连接数据库）构建失败。
 */

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL 环境变量未设置。请在 .env 或部署环境中配置 PostgreSQL 连接串，' +
        '例如 postgres://user:password@localhost:5432/asset_manager'
      )
    }
    pool = new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    })
    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL pool error:', err)
    })
  }
  return pool
}

/** 执行参数化查询，返回行数组 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query(text, params as never[])
  return result.rows as T[]
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}