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
