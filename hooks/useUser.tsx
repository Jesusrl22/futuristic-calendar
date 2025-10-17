"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface UserContextType {
  user: User | null
  loading: boolean
  dbUser: any | null
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  dbUser: null,
  refreshUser: async () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async (authUser: User) => {
    try {
      const { data: existingUser } = await supabase.from("users").select("*").eq("id", authUser.id).maybeSingle()

      if (!existingUser) {
        const { data: newUser } = await supabase
          .from("users")
          .upsert({
            id: authUser.id,
            email: authUser.email || "",
            name: authUser.user_metadata?.name || null,
            subscription_tier: "free",
            subscription_status: "active",
            ai_credits: 10,
          })
          .select()
          .single()

        setDbUser(newUser)
      } else {
        setDbUser(existingUser)
      }
    } catch (error) {
      console.error("Error loading user:", error)
    }
  }

  const refreshUser = async () => {
    if (!user) return
    await loadUser(user)
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          await loadUser(session.user)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUser(session.user)
      } else {
        setDbUser(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <UserContext.Provider value={{ user, loading, dbUser, refreshUser }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
