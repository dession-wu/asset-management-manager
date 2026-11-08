import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  rememberMe: z.boolean().default(false),
});

export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z
    .string()
    .min(8, '密码至少需要8个字符')
    .regex(/[A-Z]/, '密码需要包含至少一个大写字母')
    .regex(/[a-z]/, '密码需要包含至少一个小写字母')
    .regex(/[0-9]/, '密码需要包含至少一个数字')
    .regex(/[^A-Za-z0-9]/, '密码需要包含至少一个特殊字符'),
  confirmPassword: z.string(),
  nickname: z.string().min(2, '昵称至少需要2个字符').max(20, '昵称最多20个字符'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

export const assetSchema = z.object({
  name: z.string().min(1, '资产名称不能为空'),
  category: z.enum(['CASH', 'FIXED', 'EQUITY', 'ALTERNATIVE', 'REAL_ESTATE', 'DEBT']),
  quantity: z.number().min(0, '数量不能为负数'),
  costPrice: z.number().min(0, '成本价不能为负数'),
  currentPrice: z.number().min(0, '当前价格不能为负数'),
  currency: z.string().default('CNY'),
  memo: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AssetInput = z.infer<typeof assetSchema>;

/* 资产 API 层 schema：入参为 snake_case（前端 assets/page.tsx 提交格式） */
export const assetApiSchema = z.object({
  name: z.string().min(1, '资产名称不能为空').max(100),
  category: z.enum(['CASH', 'FIXED', 'EQUITY', 'ALTERNATIVE', 'REAL_ESTATE', 'DEBT']),
  quantity: z.number().min(0, '数量不能为负数'),
  cost_price: z.number().min(0, '成本价不能为负数'),
  current_price: z.number().min(0, '当前价格不能为负数'),
  currency: z.string().default('CNY'),
  memo: z.string().max(500).optional().default(''),
});

/* PATCH 部分更新：全部字段可选，禁止 user_id/account_id/created_at 透传 */
export const assetUpdateApiSchema = z.object({
  name: z.string().min(1, '资产名称不能为空').max(100).optional(),
  category: z.enum(['CASH', 'FIXED', 'EQUITY', 'ALTERNATIVE', 'REAL_ESTATE', 'DEBT']).optional(),
  quantity: z.number().min(0, '数量不能为负数').optional(),
  cost_price: z.number().min(0, '成本价不能为负数').optional(),
  current_price: z.number().min(0, '当前价格不能为负数').optional(),
  currency: z.string().optional(),
  memo: z.string().max(500).optional(),
});

export type AssetApiInput = z.infer<typeof assetApiSchema>;
export type AssetUpdateApiInput = z.infer<typeof assetUpdateApiSchema>;

/* DB snake_case 行 → 前端 Asset 类型（camelCase）映射 */
export function mapAssetRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    accountId: row.account_id,
    category: row.category,
    name: row.name,
    quantity: Number(row.quantity),
    costPrice: Number(row.cost_price),
    currentPrice: Number(row.current_price),
    currency: row.currency,
    memo: row.memo,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
