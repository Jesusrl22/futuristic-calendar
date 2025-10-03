"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("🔧 [v758] Supabase Configuration Check:")
console.log("📍 URL exists:", !!supabaseUrl)
console.log("📍 URL value:", supabaseUrl)
console.log("🔑 Key exists:", !!supabaseAnonKey)
console.log("🔑 Key length:", supabaseAnonKey?.length || 0)
console.log("🌐 Environment:", process.env.NODE_ENV)
console.log("⏰ Build timestamp:", new Date().toISOString())

// Validación estricta
if (!supabaseUrl || supabaseUrl === "undefined" || !supabaseUrl.includes("supabase.co")) {
  console.error("❌ [v758] CRITICAL: Invalid Supabase URL!")
  throw new Error("Invalid Supabase URL configuration")
}

if (!supabaseAnonKey || supabaseAnonKey === "undefined" || supabaseAnonKey.length < 100) {
  console.error("❌ [v758] CRITICAL: Invalid Supabase Anon Key!")
  throw new Error("Invalid Supabase Anon Key configuration")
}

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    try {
      supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
      console.log("✅ Supabase client created successfully [v758]")
    } catch (error) {
      console.error("❌ Error creating Supabase client:", error)
      supabaseInstance = null
    }
  }

  if (!supabaseInstance) {
    throw new Error("Supabase client could not be initialized. Check your environment variables.")
  }

  return supabaseInstance
}

// Export singleton instance
export const supabase = createClient()

// Check if Supabase is available
export async function checkSupabaseConnection(): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("❌ Supabase credentials not configured")
    return false
  }

  if (!supabaseUrl.startsWith("https://")) {
    console.log("❌ Supabase URL is invalid")
    return false
  }

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.warn("⚠️ Supabase session check failed:", sessionError.message)
      return false
    }

    console.log("✅ Supabase connection available [v758]")
    return true
  } catch (error: any) {
    console.warn("⚠️ Supabase connection check failed:", error?.message || error)
    return false
  }
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          subscription_plan: "free" | "premium" | "pro"
          plan: "free" | "premium" | "pro"
          ai_credits: number
          theme: "light" | "dark"
          subscription_status: string
          subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subscription_plan?: "free" | "premium" | "pro"
          plan?: "free" | "premium" | "pro"
          ai_credits?: number
          theme?: "light" | "dark"
          subscription_status?: string
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subscription_plan?: "free" | "premium" | "pro"
          plan?: "free" | "premium" | "pro"
          ai_credits?: number
          theme?: "light" | "dark"
          subscription_status?: string
          subscription_id?: string | null
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
          category: string | null
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
          category?: string | null
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
          category?: string | null
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
    }
  }
}
