/**
 * 服务启动钩子（Next.js instrumentation）
 *
 * 在服务实例启动时校验必需的环境变量，缺失则抛出错误、阻止服务启动（fail-fast）。
 * 构建阶段（next build）不运行数据库与业务逻辑，因此跳过校验以保证离线构建可用。
 */
export async function register() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return
  }

  const missing: string[] = []
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET')
  if (!process.env.REFRESH_SECRET) missing.push('REFRESH_SECRET')
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL')

  if (missing.length > 0) {
    throw new Error(
      `[启动失败] 缺少必需的环境变量: ${missing.join(', ')}。` +
      '请参考 .env.example 配置后再启动服务。'
    )
  }
}