"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

interface User {
  id: string
  email: string
  name: string
  plan: "free" | "premium" | "pro"
  ai_credits: number
  subscription_status: string
  subscription_id?: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      try {
        console.log("🔍 Getting current user...")

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser) {
          console.log("✅ Auth user found:", authUser.email)

          const { data: userData, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

          if (error) {
            console.error("❌ Error fetching user data:", error)
            setUser(null)
          } else {
            console.log("✅ User data loaded:", userData.name)
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name || userData.email,
              plan: userData.plan || userData.subscription_plan || "free",
              ai_credits: userData.ai_credits || 0,
              subscription_status: userData.subscription_status || "inactive",
              subscription_id: userData.subscription_id,
            })
          }
        } else {
          console.log("❌ No auth user found")
          setUser(null)
        }
      } catch (error) {
        console.error("❌ Error in useUser:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state changed:", event)

      if (event === "SIGNED_OUT" || !session) {
        console.log("👋 User signed out")
        setUser(null)
        setLoading(false)
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        console.log("🔐 User signed in, refreshing data")
        getUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, setUser }
}
