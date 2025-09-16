import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseAvailable = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseAvailable ? createClient(supabaseUrl!, supabaseAnonKey!) : null

console.log("🔗 Supabase Status:", {
  available: isSupabaseAvailable,
  url: supabaseUrl ? "✅ Configured" : "❌ Missing",
  anonKey: supabaseAnonKey ? "✅ Configured" : "❌ Missing",
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          password: string
          language: string
          theme: string
          is_premium: boolean
          is_pro: boolean
          onboarding_completed: boolean
          pomodoro_sessions: number
          work_duration: number
          short_break_duration: number
          long_break_duration: number
          sessions_until_long_break: number
          created_at: string
          updated_at: string
          premium_expiry: string | null
          ai_credits: number
          ai_credits_used: number
          ai_total_cost_eur: number
          subscription_status: string | null
          subscription_cancelled_at: string | null
          subscription_ends_at: string | null
          email_verified: boolean
          verification_token: string | null
          verification_expires: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          password: string
          language?: string
          theme?: string
          is_premium?: boolean
          is_pro?: boolean
          onboarding_completed?: boolean
          pomodoro_sessions?: number
          work_duration?: number
          short_break_duration?: number
          long_break_duration?: number
          sessions_until_long_break?: number
          created_at?: string
          updated_at?: string
          premium_expiry?: string | null
          ai_credits?: number
          ai_credits_used?: number
          ai_total_cost_eur?: number
          subscription_status?: string | null
          subscription_cancelled_at?: string | null
          subscription_ends_at?: string | null
          email_verified?: boolean
          verification_token?: string | null
          verification_expires?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password?: string
          language?: string
          theme?: string
          is_premium?: boolean
          is_pro?: boolean
          onboarding_completed?: boolean
          pomodoro_sessions?: number
          work_duration?: number
          short_break_duration?: number
          long_break_duration?: number
          sessions_until_long_break?: number
          created_at?: string
          updated_at?: string
          premium_expiry?: string | null
          ai_credits?: number
          ai_credits_used?: number
          ai_total_cost_eur?: number
          subscription_status?: string | null
          subscription_cancelled_at?: string | null
          subscription_ends_at?: string | null
          email_verified?: boolean
          verification_token?: string | null
          verification_expires?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          completed: boolean
          priority: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: string
          achieved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority?: string
          achieved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: string
          achieved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          user_id: string
          email_type: string
          subject: string
          sent_at: string
          status: string
          error_message: string | null
        }
        Insert: {
          id?: string
          user_id: string
          email_type: string
          subject: string
          sent_at?: string
          status?: string
          error_message?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          email_type?: string
          subject?: string
          sent_at?: string
          status?: string
          error_message?: string | null
        }
      }
    }
    Views: {
      subscription_analytics: {
        Row: {
          total_users: number
          premium_users: number
          pro_users: number
          monthly_revenue: number
          cancelled_subscriptions: number
        }
      }
    }
    Functions: {
      update_subscription_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
  }
}
