import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase credentials not found")
    return createMockClient()
  }

  try {
    const client = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
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
      onAuthStateChange: () => {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      signInWithPassword: async () => ({ data: { session: null, user: null }, error: { message: "Not configured" } }),
      signUp: async () => ({ data: { session: null, user: null }, error: { message: "Not configured" } }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      upsert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
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
          ai_credits: number
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

export default supabase
