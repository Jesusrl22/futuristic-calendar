"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith("https://")) {
    console.warn("⚠️ Supabase not configured properly")

    return {
      auth: {
        getSession: async () => ({
          data: { session: null },
          error: null,
        }),
        onAuthStateChange: (callback: any) => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        signInWithPassword: async () => ({
          data: { session: null, user: null },
          error: new Error("Supabase not configured"),
        }),
        signUp: async () => ({
          data: { session: null, user: null },
          error: new Error("Supabase not configured"),
        }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({
          data: { user: null },
          error: new Error("Supabase not configured"),
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
            order: () => ({ data: null, error: null }),
          }),
          order: () => ({ data: null, error: null }),
        }),
        insert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: async () => ({ data: null, error: null }),
            }),
          }),
        }),
        delete: () => ({
          eq: () => ({ error: null }),
        }),
      }),
    } as any
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "futuretask-auth",
        },
      })
    } catch (error) {
      console.error("❌ Error creating Supabase client:", error)
      throw error
    }
  }

  return supabaseInstance
}

export const supabase = createClient()

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          subscription_plan: "free" | "premium" | "pro"
          subscription_tier: "free" | "premium" | "pro" | "premium-yearly" | "pro-yearly"
          plan: "free" | "premium" | "pro"
          ai_credits: number
          theme: "light" | "dark"
          theme_preference: "light" | "dark"
          subscription_status: string
          subscription_id: string | null
          billing_cycle: "monthly" | "yearly"
          pomodoro_work_duration: number
          pomodoro_break_duration: number
          pomodoro_long_break_duration: number
          pomodoro_sessions_until_long_break: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subscription_plan?: "free" | "premium" | "pro"
          subscription_tier?: "free" | "premium" | "pro" | "premium-yearly" | "pro-yearly"
          plan?: "free" | "premium" | "pro"
          ai_credits?: number
          theme?: "light" | "dark"
          theme_preference?: "light" | "dark"
          subscription_status?: string
          subscription_id?: string | null
          billing_cycle?: "monthly" | "yearly"
          pomodoro_work_duration?: number
          pomodoro_break_duration?: number
          pomodoro_long_break_duration?: number
          pomodoro_sessions_until_long_break?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subscription_plan?: "free" | "premium" | "pro"
          subscription_tier?: "free" | "premium" | "pro" | "premium-yearly" | "pro-yearly"
          plan?: "free" | "premium" | "pro"
          ai_credits?: number
          theme?: "light" | "dark"
          theme_preference?: "light" | "dark"
          subscription_status?: string
          subscription_id?: string | null
          billing_cycle?: "monthly" | "yearly"
          pomodoro_work_duration?: number
          pomodoro_break_duration?: number
          pomodoro_long_break_duration?: number
          pomodoro_sessions_until_long_break?: number
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          completed: boolean
          priority: "low" | "medium" | "high"
          status: string
          category: string | null
          tags: string[] | null
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
          priority?: "low" | "medium" | "high"
          status?: string
          category?: string | null
          tags?: string[] | null
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
          priority?: "low" | "medium" | "high"
          status?: string
          category?: string | null
          tags?: string[] | null
          due_date?: string | null
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
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          price: number | null
          url: string | null
          priority: "low" | "medium" | "high"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          price?: number | null
          url?: string | null
          priority?: "low" | "medium" | "high"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          price?: number | null
          url?: string | null
          priority?: "low" | "medium" | "high"
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          title: string
          description: string
          icon: string
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          title: string
          description: string
          icon: string
          unlocked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          title?: string
          description?: string
          icon?: string
          unlocked_at?: string
          created_at?: string
        }
      }
      pomodoro_sessions: {
        Row: {
          id: string
          user_id: string
          duration: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          duration: number
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          duration?: number
          completed?: boolean
          created_at?: string
        }
      }
    }
  }
}
