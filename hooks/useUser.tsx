"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export interface UserData {
  id: string
  name: string
  email: string
  subscription_plan: "free" | "premium" | "pro"
  subscription_tier: "free" | "premium" | "pro" | "premium-yearly" | "pro-yearly"
  plan: "free" | "premium" | "pro"
  ai_credits: number
  theme: "light" | "dark"
  theme_preference: "light" | "dark"
  subscription_status: string
  subscription_id: string | null
  billing_cycle: "monthly" | "yearly"
  pomodoro_work_duration: number
  pomodoro_break_duration: number
  pomodoro_long_break_duration: number
  pomodoro_sessions_until_long_break: number
  created_at: string
  updated_at: string
}

interface UserContextType {
  user: UserData | null
  authUser: User | null
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  updateUser: (updates: Partial<UserData>) => Promise<UserData | null>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadUser() {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Session error:", sessionError)
        setError(sessionError.message)
        setLoading(false)
        return
      }

      if (!session) {
        console.log("No active session")
        setUser(null)
        setAuthUser(null)
        setLoading(false)
        return
      }

      setAuthUser(session.user)

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle()

      if (userError) {
        console.error("Error loading user data:", userError)
        setError(userError.message)
      }

      if (userData) {
        setUser(userData)
      } else {
        console.log("No user data found, creating new user profile")

        const newUser = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || "Usuario",
          subscription_plan: "free" as const,
          subscription_tier: "free" as const,
          plan: "free" as const,
          ai_credits: 10,
          theme: "dark" as const,
          theme_preference: "dark" as const,
          subscription_status: "active",
          subscription_id: null,
          billing_cycle: "monthly" as const,
          pomodoro_work_duration: 25,
          pomodoro_break_duration: 5,
          pomodoro_long_break_duration: 15,
          pomodoro_sessions_until_long_break: 4,
        }

        const { data: createdUser, error: createError } = await supabase.from("users").insert(newUser).select().single()

        if (createError) {
          console.error("Error creating user:", createError)
          setError(createError.message)
        } else if (createdUser) {
          setUser(createdUser)
        }
      }
    } catch (err: any) {
      console.error("Unexpected error loading user:", err)
      setError(err?.message || "Error loading user")
    } finally {
      setLoading(false)
    }
  }

  async function updateUser(updates: Partial<UserData>): Promise<UserData | null> {
    if (!authUser) {
      throw new Error("No authenticated user")
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authUser.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    if (data) {
      setUser(data)
      return data
    }

    return null
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setAuthUser(null)
  }

  useEffect(() => {
    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)

      if (event === "SIGNED_IN" && session?.user) {
        await loadUser()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setAuthUser(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        authUser,
        loading,
        error,
        updateUser,
        signOut,
        refreshUser: loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
