"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  name: string
  email: string
  subscription_plan: string
  subscription_tier: string
  plan: string
  ai_credits: number
  theme: string
  theme_preference: string
  subscription_status: string
  subscription_id: string | null
  billing_cycle: string
  pomodoro_work_duration: number
  pomodoro_break_duration: number
  pomodoro_long_break_duration: number
  pomodoro_sessions_until_long_break: number
  created_at: string
  updated_at: string
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

      if (!session?.user) {
        setUser(null)
        setLoading(false)
        return
      }

      const { data: userData, error } = await supabase.from("users").select("*").eq("id", session.user.id).maybeSingle()

      if (error) {
        console.error("Error loading user:", error)
        setUser(null)
        setLoading(false)
        return
      }

      if (!userData) {
        const newUser = {
          id: session.user.id,
          name: session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
          subscription_plan: "free",
          subscription_tier: "free",
          plan: "free",
          ai_credits: 10,
          theme: "dark",
          theme_preference: "dark",
          subscription_status: "active",
          subscription_id: null,
          billing_cycle: "monthly",
          pomodoro_work_duration: 25,
          pomodoro_break_duration: 5,
          pomodoro_long_break_duration: 15,
          pomodoro_sessions_until_long_break: 4,
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
