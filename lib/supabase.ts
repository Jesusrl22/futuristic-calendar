"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Version 761 - Enhanced logging and validation
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
console.log("🚀 FutureTask v761 - Supabase Initialization")
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
console.log("📍 URL:", supabaseUrl ? `${supabaseUrl.substring(0, 40)}...` : "❌ MISSING")
console.log("🔑 Key:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "❌ MISSING")
console.log("🌐 Environment:", process.env.NODE_ENV)
console.log("⏰ Timestamp:", new Date().toISOString())
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ [v761] CRITICAL: Missing Supabase environment variables")
  throw new Error("Missing Supabase environment variables")
}

// Strict URL validation
try {
  const url = new URL(supabaseUrl)
  if (!url.hostname.includes("supabase.co")) {
    throw new Error("Invalid Supabase domain")
  }
  console.log("✅ [v761] Valid Supabase URL")
} catch (error) {
  console.error("❌ [v761] Invalid Supabase URL:", supabaseUrl)
  throw new Error("Invalid Supabase URL")
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
        global: {
          headers: {
            "x-app-version": "761",
            "x-client-info": "futuretask-web",
          },
        },
      })
      console.log("✅ [v761] Supabase client created successfully")
    } catch (error) {
      console.error("❌ [v761] Error creating Supabase client:", error)
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
  console.log("🔍 [v761] Checking Supabase connection...")

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("❌ [v761] Supabase credentials not configured")
    return false
  }

  if (!supabaseUrl.startsWith("https://")) {
    console.log("❌ [v761] Supabase URL is invalid")
    return false
  }

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.warn("⚠️ [v761] Supabase session check failed:", sessionError.message)
      return false
    }

    console.log("✅ [v761] Supabase connection available")
    return true
  } catch (error: any) {
    console.warn("⚠️ [v761] Supabase connection check failed:", error?.message || error)
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
