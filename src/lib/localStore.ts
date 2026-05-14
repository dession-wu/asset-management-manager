// 本地内存存储，用于替代 Supabase 进行本地开发和演示
import { v4 as uuidv4 } from 'uuid';

interface LocalUser {
  id: string;
  email: string;
  passwordHash: string;
  nickname: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface LocalProfile {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string;
  risk_profile: string;
  created_at: string;
  updated_at: string;
}

class LocalStore {
  private users: Map<string, LocalUser> = new Map();
  private profiles: Map<string, LocalProfile> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> userId

  constructor() {
    // 从 localStorage 加载数据（如果在浏览器环境）
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const usersData = localStorage.getItem('local_users');
      const profilesData = localStorage.getItem('local_profiles');
      if (usersData) {
        const users = JSON.parse(usersData);
        this.users = new Map(Object.entries(users));
      }
      if (profilesData) {
        const profiles = JSON.parse(profilesData);
        this.profiles = new Map(Object.entries(profiles));
      }
      // Rebuild email index
      this.emailIndex.clear();
      this.users.forEach((user, id) => {
        this.emailIndex.set(user.email, id);
      });
    } catch {
      // Ignore storage errors
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        const usersObj = Object.fromEntries(this.users);
        const profilesObj = Object.fromEntries(this.profiles);
        localStorage.setItem('local_users', JSON.stringify(usersObj));
        localStorage.setItem('local_profiles', JSON.stringify(profilesObj));
      } catch {
        // Ignore storage errors
      }
    }
  }

  async findUserByEmail(email: string): Promise<LocalUser | null> {
    const userId = this.emailIndex.get(email);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async createUser(email: string, passwordHash: string, nickname: string): Promise<LocalUser> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error('该邮箱已被注册');
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const user: LocalUser = {
      id,
      email,
      passwordHash,
      nickname,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    };

    const profile: LocalProfile = {
      id,
      email,
      nickname,
      risk_profile: 'MODERATE',
      created_at: now,
      updated_at: now,
    };

    this.users.set(id, user);
    this.profiles.set(id, profile);
    this.emailIndex.set(email, id);
    this.saveToStorage();

    return user;
  }

  async getUserById(id: string): Promise<LocalUser | null> {
    return this.users.get(id) || null;
  }

  async getProfileById(id: string): Promise<LocalProfile | null> {
    return this.profiles.get(id) || null;
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      this.users.set(id, user);
      this.saveToStorage();
    }
  }

  // 模拟 Supabase 的 from().select() 接口
  get profilesTable() {
    const self = this;
    return {
      select: () => ({
        eq: (field: string, value: string) => ({
          single: async () => {
            if (field === 'email') {
              const userId = self.emailIndex.get(value);
              if (!userId) return { data: null, error: null };
              const profile = self.profiles.get(userId);
              return { data: profile || null, error: null };
            }
            if (field === 'id') {
              const profile = self.profiles.get(value);
              return { data: profile || null, error: null };
            }
            return { data: null, error: null };
          },
        }),
      }),
      insert: (data: any) => ({
        async then(resolve: any) {
          // 已经在 createUser 中处理了
          resolve({ data: null, error: null });
        },
      }),
    };
  }

  // 模拟 Supabase Auth
  get auth() {
    const self = this;
    return {
      signUp: async ({ email, password }: { email: string; password: string }) => {
        const existingUser = await self.findUserByEmail(email);
        if (existingUser) {
          return { data: { user: null }, error: { message: '该邮箱已被注册' } };
        }
        return { data: { user: null }, error: null };
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const user = await self.findUserByEmail(email);
        if (!user) {
          return { data: null, error: { message: '用户不存在' } };
        }
        return {
          data: {
            user: {
              id: user.id,
              email: user.email,
            },
          },
          error: null,
        };
      },
    };
  }

  clearAll() {
    this.users.clear();
    this.profiles.clear();
    this.emailIndex.clear();
    this.saveToStorage();
  }
}

export const localStore = new LocalStore();
