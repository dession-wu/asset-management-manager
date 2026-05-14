export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          nickname: string | null
          avatar_url: string | null
          risk_profile: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nickname?: string | null
          avatar_url?: string | null
          risk_profile?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string | null
          avatar_url?: string | null
          risk_profile?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          currency: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          account_id: string
          user_id: string
          category: string
          subcategory: string | null
          name: string
          code: string | null
          quantity: number
          cost_price: number
          current_price: number
          currency: string
          purchase_date: string | null
          memo: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          user_id: string
          category: string
          subcategory?: string | null
          name: string
          code?: string | null
          quantity?: number
          cost_price?: number
          current_price?: number
          currency?: string
          purchase_date?: string | null
          memo?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          user_id?: string
          category?: string
          subcategory?: string | null
          name?: string
          code?: string | null
          quantity?: number
          cost_price?: number
          current_price?: number
          currency?: string
          purchase_date?: string | null
          memo?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          asset_id: string
          user_id: string
          type: string
          date: string
          quantity: number
          price: number
          amount: number
          fee: number
          memo: string | null
          created_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          user_id: string
          type: string
          date: string
          quantity?: number
          price?: number
          amount?: number
          fee?: number
          memo?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          user_id?: string
          type?: string
          date?: string
          quantity?: number
          price?: number
          amount?: number
          fee?: number
          memo?: string | null
          created_at?: string
        }
      }
      allocation_targets: {
        Row: {
          id: string
          user_id: string
          category: string
          target_percent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          target_percent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          target_percent?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          notifications: Json
          security: Json
          target_allocation: Json
          updated_at: string
        }
        Insert: {
          id: string
          notifications?: Json
          security?: Json
          target_allocation?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          notifications?: Json
          security?: Json
          target_allocation?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
