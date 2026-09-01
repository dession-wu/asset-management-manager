'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  PieChart,
  BarChart3,
  ShieldCheck,
  Database,
  LineChart,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/**
 * 数字雨背景（轻量 Canvas 实现）
 * - 绘制缓慢下落的 0/1/¥/$ 数字流，营造金融科技氛围
 * - 监听 prefers-reduced-motion：用户开启"减弱动态效果"时渲染静态渐隐层
 * - 页面不可见时（document.hidden）自动暂停，节省性能
 */
function DigitalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* 列宽与数字字符集 */
    const fontSize = 16
    const chars = '0123456789¥$%'.split('')
    let columns = 0
    let drops: number[] = []
    let rafId = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      columns = Math.floor(canvas.width / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -50)
    }

    const draw = () => {
      /* 半透明黑色覆盖形成拖尾 */
      ctx.fillStyle = 'rgba(11, 17, 32, 0.14)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < columns; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        /* 少量高亮列使用金色，其余使用低透明蓝 */
        ctx.fillStyle = i % 13 === 0 ? 'rgba(245, 158, 11, 0.30)' : 'rgba(59, 130, 246, 0.16)'
        ctx.fillText(text, x, y)
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.5
      }
    }

    const loop = () => {
      if (!document.hidden) draw()
      rafId = window.requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduceMotion) {
      /* 降级：仅绘制一帧静态数字，无连续动画 */
      draw()
    } else {
      rafId = window.requestAnimationFrame(loop)
    }

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-60"
    />
  )
}

/* 核心功能卡片数据 */
const features = [
  {
    icon: Wallet,
    title: '资产管理',
    desc: '集中登记现金、股票、基金、房产等多类资产，成本、数量、现价一目了然。',
    accent: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    icon: PieChart,
    title: '分类统计',
    desc: '按类别、账户维度自动归集，资产分布结构实时掌握，辅助再平衡决策。',
    accent: 'text-blue-400 bg-blue-500/10',
  },
  {
    icon: BarChart3,
    title: '可视化报表',
    desc: '总资产、净资产、持仓浮盈与收益率多卡片呈现，数据变化趋势直观清晰。',
    accent: 'text-amber-400 bg-amber-500/10',
  },
  {
    icon: TrendingUp,
    title: '收益追踪',
    desc: '基于持仓成本自动计算浮动盈亏与收益率，正负收益高亮提示。',
    accent: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    icon: ShieldCheck,
    title: '安全认证',
    desc: 'JWT + Refresh Token 双令牌机制，无感刷新登录态，数据访问层层护航。',
    accent: 'text-blue-400 bg-blue-500/10',
  },
  {
    icon: Database,
    title: '自有数据',
    desc: '自建 PostgreSQL 数据库存储，资产数据完全归属自己，隐私不留第三方。',
    accent: 'text-amber-400 bg-amber-500/10',
  },
]

/* Hero 数据亮点条 */
const stats = [
  { value: '6+', label: '资产类别支持' },
  { value: '100%', label: '数据自主掌控' },
  { value: '24/7', label: '随时访问' },
  { value: 'JWT', label: '安全认证' },
]

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B1120] text-slate-200">
      {/* ===== 背景层：数字雨 Canvas + 矩阵网格 + 光晕 ===== */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <DigitalRain />
        {/* 矩阵网格：CSS 渐变绘制，随动画缓慢纵向滚动 */}
        <div className="absolute inset-0 animate-grid bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* 顶部主色光晕 + 底部金色微光，增加空间层次 */}
        <div className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />
        {/* 上下渐隐遮罩，保证正文可读性 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/40 via-transparent to-[#0B1120]" />
      </div>

      {/* ===== 内容层 ===== */}
      <div className="relative z-10">
        {/* Header：logo + 登录入口 */}
        <header className="border-b border-white/5 bg-[#0B1120]/70 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="block text-sm font-bold tracking-wider text-white">
                  Asset Pilot
                </span>
                <span className="block font-mono text-[10px] tracking-widest text-slate-500">
                  资产管理平台
                </span>
              </div>
            </div>

            {/* 登录入口：已登录 → 进入控制台；未登录 → 登录 / 注册 */}
            <div className="flex items-center space-x-3">
              {!isLoading && isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  进入控制台
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                  >
                    免费注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero：主标题 + 副标题 + 双 CTA + 数据亮点 */}
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center md:pt-28">
          {/* 徽章 */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-xs tracking-widest text-blue-300">
              PERSONAL ASSET MANAGEMENT
            </span>
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            让每一笔资产
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              {' '}清晰可见
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
            集中管理现金、股票、基金等多类资产，自动统计分类与收益，
            可视化报表随时掌握净资产全景。数据自持，安全可靠。
          </p>

          {/* 双 CTA：已登录主按钮直达控制台 */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={isAuthenticated && !isLoading ? '/dashboard' : '/register'}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-[0.98] sm:w-auto"
            >
              {isAuthenticated && !isLoading ? '进入控制台' : '免费开始管理资产'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10 active:scale-[0.98] sm:w-auto"
            >
              已有账户，直接登录
            </Link>
          </div>

          {/* 数据亮点条：金色/绿色高光 */}
          <dl className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#0F172A]/80 px-6 py-6">
                <dt className="font-mono text-2xl font-bold tracking-tight text-amber-400">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 核心功能区：单列(移动端) → 双列(平板) → 三列(桌面) */}
        <section className="border-t border-white/5 bg-[#0F172A]/40 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400">
                Core Features
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                为个人资产量身打造
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                从记录到分析，覆盖资产管理完整链路
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div
                    key={f.title}
                    className="group rounded-2xl border border-white/5 bg-[#0F172A] p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-900/20"
                  >
                    <div
                      className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.accent}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 底部 CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#0F172A] to-[#0B1120] px-8 py-14 text-center md:px-16">
              {/* 面板内部网格装饰 */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"
              />
              <div className="relative">
                <LineChart className="mx-auto mb-5 h-8 w-8 text-emerald-400" />
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  现在开始，掌握你的财务全景
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
                  注册即可创建专属资产管理空间，数据由自建数据库安全存储。
                </p>
                <Link
                  href={isAuthenticated && !isLoading ? '/dashboard' : '/register'}
                  className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-[0.98]"
                >
                  {isAuthenticated && !isLoading ? '进入控制台' : '立即免费注册'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#0B1120]/70 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-slate-600 md:flex-row">
            <div className="flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5" />
              <span className="font-mono tracking-widest">
                © 2026 ASSET PILOT. ALL RIGHTS RESERVED.
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono tracking-widest">
              <span className="text-emerald-400/70">SECURE_JWT_AUTH</span>
              <span className="hidden md:inline">POWERED_BY_POSTGRESQL</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}