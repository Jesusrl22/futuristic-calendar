import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("🔧 Supabase Config:", {
  url: supabaseUrl ? "Configurada" : "No configurada",
  key: supabaseAnonKey ? "Configurada" : "No configurada",
})

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
            "X-Client-Info": "futuretask-web",
          },
        },
      })
      console.log("✅ Supabase client created successfully")
    } catch (error) {
      console.error("❌ Error creating Supabase client:", error)
      supabaseInstance = null
    }
  }

  // Return a mock client if Supabase is not available
  if (!supabaseInstance) {
    console.log("ℹ️ Using mock Supabase client (Demo mode)")
    return createMockSupabaseClient()
  }

  return supabaseInstance
}

// Mock Supabase client for demo mode
function createMockSupabaseClient() {
  return {
    auth: {
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: "Demo mode - use demo login" },
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: { message: "Demo mode - use demo login" },
      }),
      signOut: async () => ({
        error: null,
      }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: null,
            error: { message: "Demo mode - no database access" },
          }),
        }),
        limit: () => ({
          single: async () => ({
            data: null,
            error: { message: "Demo mode - no database access" },
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: { message: "Demo mode - no database access" },
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({
              data: null,
              error: { message: "Demo mode - no database access" },
            }),
          }),
        }),
      }),
      delete: () => ({
        eq: async () => ({
          error: { message: "Demo mode - no database access" },
        }),
      }),
    }),
  } as any
}

// Export singleton instance
export const supabase = createClient()

// Check if Supabase is available
export async function checkSupabaseConnection(): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false
  }

  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))

    const healthCheck = supabase.from("users").select("count", { count: "exact", head: true })

    await Promise.race([healthCheck, timeout])
    return true
  } catch (error) {
    console.warn("⚠️ Supabase connection check failed:", error)
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
