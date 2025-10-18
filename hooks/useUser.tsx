"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface DbUser {
  id: string
  email: string
  name: string | null
  language: string
  theme: string
  subscription_tier: "free" | "premium" | "pro"
  subscription_status: string | null
  ai_credits: number
  ai_credits_used: number
  is_lifetime: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

interface UserContextType {
  user: SupabaseUser | null
  dbUser: DbUser | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  dbUser: null,
  loading: true,
  refreshUser: async () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        setUser(authUser)

        // Fetch user data from database
        const { data: userData, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (error) {
          console.error("Error fetching user data:", error)
        } else if (userData) {
          setDbUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            language: userData.language || "es",
            theme: userData.theme || "light",
            subscription_tier: userData.subscription_tier || "free",
            subscription_status: userData.subscription_status,
            ai_credits: userData.ai_credits || 0,
            ai_credits_used: userData.ai_credits_used || 0,
            is_lifetime: userData.is_lifetime || false,
            email_verified: userData.email_verified || false,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
          })
        }
      } else {
        setUser(null)
        setDbUser(null)
      }
    } catch (error) {
      console.error("Error in loadUser:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser()
      } else {
        setUser(null)
        setDbUser(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, dbUser, loading, refreshUser: loadUser }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
