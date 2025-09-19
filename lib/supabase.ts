import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          subscription_plan: string
          subscription_status: string
          ai_credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          subscription_plan?: string
          subscription_status?: string
          ai_credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          subscription_plan?: string
          subscription_status?: string
          ai_credits?: number
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
          priority: string
          due_date: string | null
          category: string | null
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
          category?: string | null
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
          category?: string | null
          created_at?: string
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

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables with fallbacks
const supabaseUrl = isBrowser ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined
const supabaseAnonKey = isBrowser ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined

// Simple validation function
const isValidSupabaseConfig = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.includes("supabase") && supabaseUrl.startsWith("http"))
}

// Export configuration status
export const isSupabaseConfigured = isValidSupabaseConfig()

// Create a simple mock client for demo mode
const createMockClient = () => ({
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: { message: "Demo mode" } }),
        limit: (count: number) => ({ data: [], error: { message: "Demo mode" } }),
      }),
      order: (column: string, options?: any) => ({ data: [], error: { message: "Demo mode" } }),
      limit: (count: number) => ({ data: [], error: { message: "Demo mode" } }),
    }),
    insert: (values: any) => ({
      select: (columns?: string) => ({
        single: async () => ({ data: null, error: { message: "Demo mode" } }),
      }),
    }),
    update: (values: any) => ({
      eq: (column: string, value: any) => ({
        select: (columns?: string) => ({
          single: async () => ({ data: null, error: { message: "Demo mode" } }),
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({ error: { message: "Demo mode" } }),
    }),
    upsert: async (values: any) => ({ data: null, error: { message: "Demo mode" } }),
  }),
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async (credentials: any) => ({
      data: { user: null, session: null },
      error: { message: "Demo mode" },
    }),
    signUp: async (credentials: any) => ({
      data: { user: null, session: null },
      error: { message: "Demo mode" },
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  rpc: async (fn: string, params?: any) => ({ data: null, error: { message: "Demo mode" } }),
})

// Create the client
export const supabase =
  isSupabaseConfigured && isBrowser ? createSupabaseClient(supabaseUrl!, supabaseAnonKey!) : createMockClient()

// Export createClient for compatibility
export const createClient = () => supabase

// Default export
export default supabase
