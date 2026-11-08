import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { LedgerBrand } from '@/components/ledger/LedgerUI'

export function AuthFrame({ mode, children }: { mode: 'login' | 'register'; children: React.ReactNode }) {
  const register = mode === 'register'
  return <div className="ledger-auth"><header><LedgerBrand /><Link href="/" className="ledger-text-link"><ArrowLeft size={14} /> 返回首页</Link></header><main className="ledger-auth-main"><section className="ledger-auth-story"><span className="ledger-overline">记录资产，理解全貌</span><h1>{register ? <>建立你的私人账本。</> : <>继续记录资产变化。</>}</h1><p>{register ? '为你的现金、投资、房产与债务建立一份长期记录。先从一笔储蓄开始，慢慢看清全貌。' : '记录当下的持有，理解资金的分布，为下一次决定保留清晰的依据。'}</p><div className="ledger-auth-equation"><span>总资产</span><b>−</b><span>债务余额</span><b>=</b><strong>你的净资产</strong></div><ol><li><span>01</span><div><strong>记录持有</strong><p>数量、成本与估值，都有清楚的出处。</p></div></li><li><span>02</span><div><strong>理解分布</strong><p>看清不同类别的占比，建立自己的判断。</p></div></li><li><span>03</span><div><strong>留存账本</strong><p>导出当前持仓，为定期复盘留下记录。</p></div></li></ol></section><section className="ledger-auth-panel" aria-label={register ? '注册表单' : '登录表单'}><div className="ledger-auth-panel-top"><span>{register ? '建立你的私人账本' : '你的私人账本'}</span><ArrowUpRight size={17} /></div><h2>{register ? '创建账户' : '欢迎回来'}</h2><p className="ledger-muted">{register ? '填写以下信息，开始记录第一笔资产。' : '使用邮箱与密码，继续你的记录。'}</p>{children}</section></main><footer><span>资产账本</span><span>记录当下，面向长期。</span></footer></div>
}

