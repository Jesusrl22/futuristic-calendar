"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Log para debugging en producción
if (typeof window !== "undefined") {
  console.log("🔧 Supabase Config (v755):", {
    url: supabaseUrl?.substring(0, 30) + "...",
    hasKey: !!supabaseAnonKey,
    keyPrefix: supabaseAnonKey?.substring(0, 10),
    environment: process.env.NODE_ENV,
  })
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables")
  throw new Error("Missing Supabase environment variables")
}

// Validar que la URL sea válida
try {
  new URL(supabaseUrl)
  console.log("✅ Valid Supabase URL")
} catch (error) {
  console.error("❌ Invalid Supabase URL:", supabaseUrl)
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
      })
      console.log("✅ Supabase client created successfully (v755)")
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

    console.log("✅ Supabase connection available")
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
