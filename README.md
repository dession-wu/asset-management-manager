# 资产管理 Web 版

基于 Next.js + Supabase 的无服务器个人资产管理平台。

## 技术栈

- **前端**: Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes + Edge Middleware
- **数据库**: Supabase PostgreSQL + Row Level Security
- **认证**: JWT + Supabase Auth
- **状态管理**: Zustand + persist
- **部署**: Vercel (Serverless)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 填入你的 Supabase 项目信息：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-jwt-secret
REFRESH_SECRET=your-refresh-secret
```

### 3. 初始化数据库

在 Supabase SQL 编辑器中执行 `supabase/schema.sql` 中的 SQL 语句。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 运行测试

```bash
npm test
```

## 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 自动部署

## 项目结构

```
asset-manager-web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── login/        # 登录页面
│   │   ├── register/     # 注册页面
│   │   ├── assets/       # 资产管理
│   │   ├── allocation/   # 配置分析
│   │   ├── reports/      # 报表中心
│   │   └── settings/     # 设置
│   ├── components/       # React 组件
│   ├── stores/           # Zustand 状态管理
│   ├── hooks/            # 自定义 Hooks
│   ├── lib/              # 工具函数
│   ├── types/            # TypeScript 类型
│   └── test/             # 测试文件
├── supabase/             # 数据库 Schema
└── public/               # 静态资源
```

## 功能特性

- 用户注册/登录 (JWT 认证)
- 资产 CRUD 管理
- 资产配置分析
- 报表导出 (CSV)
- 响应式设计
- PWA 支持
- 离线缓存

## 安全特性

- HTTPS 强制
- Content Security Policy
- Row Level Security (RLS)
- JWT 认证
- 输入验证 (Zod)
- XSS/CSRF 防护

## 许可证

MIT
