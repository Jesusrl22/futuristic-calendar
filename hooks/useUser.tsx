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
  subscription_plan?: string
  is_premium?: boolean
  is_pro?: boolean
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      try {
        console.log("🔍 Getting current user...")

        // Check if demo user first
        const isDemoUser = localStorage.getItem("isDemoUser")
        if (isDemoUser === "true") {
          const storedUser = localStorage.getItem("currentUser")
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser)
              setUser({
                id: user.id,
                email: user.email,
                name: user.name || user.email,
                plan: user.plan || user.subscription_plan || "free",
                ai_credits: user.ai_credits || 0,
                subscription_status: user.subscription_status || "inactive",
                subscription_id: user.subscription_id,
                is_premium: user.is_premium || false,
                is_pro: user.is_pro || false,
              })
              console.log("✅ Demo user loaded:", user.name)
              setLoading(false)
              return
            } catch (error) {
              console.error("❌ Error parsing demo user:", error)
              localStorage.removeItem("isDemoUser")
              localStorage.removeItem("currentUser")
            }
          }
        }

        // Get authenticated user
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          console.error("❌ Auth error:", authError)
          setUser(null)
          setLoading(false)
          return
        }

        if (!authUser) {
          console.log("❌ No authenticated user found")
          setUser(null)
          setLoading(false)
          return
        }

        console.log("✅ Authenticated user found:", authUser.email)

        // Fetch user data from database using maybeSingle to avoid errors
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle()

        if (userError) {
          console.error("❌ Error fetching user data:", userError)
          // Create a basic user object from auth data if database fetch fails
          setUser({
            id: authUser.id,
            email: authUser.email || "",
            name: authUser.email || "User",
            plan: "free",
            ai_credits: 0,
            subscription_status: "inactive",
          })
          setLoading(false)
          return
        }

        if (!userData) {
          console.log("⚠️ No user data found in database, user may need to complete registration")
          // Create a basic user object from auth data
          setUser({
            id: authUser.id,
            email: authUser.email || "",
            name: authUser.email || "User",
            plan: "free",
            ai_credits: 0,
            subscription_status: "inactive",
          })
          setLoading(false)
          return
        }

        console.log("✅ User data loaded:", userData.name)
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.email,
          plan: userData.plan || userData.subscription_plan || "free",
          ai_credits: userData.ai_credits || 0,
          subscription_status: userData.subscription_status || "inactive",
          subscription_id: userData.subscription_id,
          is_premium: userData.is_premium || false,
          is_pro: userData.is_pro || false,
        })
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
        setLoading(true)
        getUser()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, setUser }
}
