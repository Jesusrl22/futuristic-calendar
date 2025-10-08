"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { APP_VERSION } from "./version"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl)
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", !!supabaseAnonKey)
}

// Strict URL validation
try {
  const url = new URL(supabaseUrl)
  if (!url.hostname.includes("supabase.co")) {
    throw new Error("Invalid Supabase domain")
  }
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
        global: {
          headers: {
            "x-app-version": APP_VERSION.full,
            "x-client-info": "futuretask-web-v761",
            "X-Build-Id": APP_VERSION.buildId,
          },
        },
      })
      console.log("✅ Supabase client created successfully")
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

export const supabase = createClient()

export async function checkSupabaseConnection(): Promise<boolean> {
  console.log("🔍 Checking Supabase connection...")

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

console.log("🔌 Supabase client initialized")
console.log(`📦 Version: ${APP_VERSION.full}`)
console.log(`🌐 Supabase URL: ${supabaseUrl}`)
console.log(`⏰ Timestamp: ${new Date().toISOString()}`)
