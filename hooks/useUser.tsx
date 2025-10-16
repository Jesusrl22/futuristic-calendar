"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  name: string
  email: string
  language: string
  theme: string
  is_premium: boolean
  is_pro: boolean
  premium_expiry: string | null
  onboarding_completed: boolean
  pomodoro_sessions: number
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  sessions_until_long_break: number
  email_verified: boolean
  subscription_status: string
  plan: string
  ai_credits: number
  ai_credits_used: number
}

interface UserContextType {
  user: User | null
  loading: boolean
  updateUser: (updates: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      console.log("Auth state changed:", session ? "SIGNED_IN" : "INITIAL_SESSION")

      if (!session?.user) {
        console.log("No active session")
        setUser(null)
        setLoading(false)
        return
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .maybeSingle()

      if (error) {
        console.error("Error loading user:", error)
        setUser(null)
        setLoading(false)
        return
      }

      if (!userData) {
        const newUser = {
          name: session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
          language: "es",
          theme: "default",
          is_premium: false,
          is_pro: false,
          premium_expiry: null,
          onboarding_completed: false,
          pomodoro_sessions: 0,
          work_duration: 25,
          short_break_duration: 5,
          long_break_duration: 15,
          sessions_until_long_break: 4,
          email_verified: true,
          subscription_status: "inactive",
          plan: "free",
          ai_credits: 10,
          ai_credits_used: 0,
        }

        const { data: createdUser, error: createError } = await supabase
          .from("users")
          .insert([newUser])
          .select()
          .single()

        if (createError) {
          console.error("Error creating user:", createError)
          setUser(null)
        } else {
          setUser(createdUser)
        }
      } else {
        setUser(userData)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return

    const { error } = await supabase.from("users").update(updates).eq("id", user.id)

    if (!error) {
      setUser({ ...user, ...updates })
    }
  }

  const refreshUser = async () => {
    await loadUser()
  }

  return <UserContext.Provider value={{ user, loading, updateUser, refreshUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
