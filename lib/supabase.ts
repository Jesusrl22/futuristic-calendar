import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

console.log("🔍 Checking Supabase configuration...")
console.log("URL:", supabaseUrl)
console.log("Key:", supabaseAnonKey ? "SET" : "NOT SET")

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase credentials not found, using mock client")
    return createMockClient()
  }

  try {
    const client = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    console.log("✅ Supabase client created successfully")
    return client
  } catch (error) {
    console.error("❌ Error creating Supabase client:", error)
    return createMockClient()
  }
}

function createMockClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      signInWithPassword: async () => ({ data: { session: null, user: null }, error: { message: "Mock client" } }),
      signUp: async () => ({ data: { session: null, user: null }, error: { message: "Mock client" } }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { message: "Mock client" } }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        order: () => ({
          limit: async () => ({ data: [], error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: { message: "Mock client" } }),
        }),
      }),
      upsert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: { message: "Mock client" } }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: "Mock client" } }),
          }),
        }),
      }),
      delete: () => ({
        eq: async () => ({ error: null }),
      }),
    }),
  } as any
}

export const supabase = createClient()

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          subscription_tier: string
          subscription_status: string
          subscription_end_date: string | null
          ai_credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          subscription_tier?: string
          subscription_status?: string
          subscription_end_date?: string | null
          ai_credits?: number
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          subscription_tier?: string
          subscription_status?: string
          subscription_end_date?: string | null
          ai_credits?: number
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
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: string
          due_date?: string | null
        }
      }
    }
  }
}
