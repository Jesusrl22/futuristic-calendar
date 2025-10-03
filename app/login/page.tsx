"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Rocket, Database, Globe } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDatabaseAvailable, setIsDatabaseAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    console.log("🚀 [v758] Login Page Mounted")
    console.log("🌐 Current URL:", window.location.href)
    console.log("📦 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)

    checkDatabaseConnection()
  }, [])

  const checkDatabaseConnection = async () => {
    try {
      console.log("🔍 [v758] Testing database connection...")
      const { data, error } = await supabase.from("users").select("count").limit(1)

      if (error) {
        console.error("❌ [v758] Database connection failed:", error.message)
        setIsDatabaseAvailable(false)
      } else {
        console.log("✅ [v758] Database connection successful")
        setIsDatabaseAvailable(true)
      }
    } catch (err) {
      console.error("❌ [v758] Database check error:", err)
      setIsDatabaseAvailable(false)
    }
  }

  const handleDemoLogin = () => {
    console.log("🎮 [v758] Demo Mode activated")
    const demoUser = {
      id: "demo-user-" + Date.now(),
      email: "demo@future-task.com",
      name: "Demo User",
      isPremium: false,
      isDemoMode: true,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("user", JSON.stringify(demoUser))
    console.log("✅ [v758] Demo user saved to localStorage")
    router.push("/app")
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("🔐 [v758] Login attempt:", { email })

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("❌ [v758] Login error:", signInError.message)

        if (signInError.message.includes("fetch")) {
          setError(
            "⚠️ Cannot connect to database. The preview environment blocks external requests. Please use Demo Mode or deploy to production.",
          )
        } else {
          setError(signInError.message)
        }
        return
      }

      console.log("✅ [v758] Login successful")
      router.push("/app")
    } catch (err) {
      console.error("❌ [v758] Unexpected login error:", err)
      setError("An unexpected error occurred. Please try Demo Mode.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("📝 [v758] Registration attempt:", { email })

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        console.error("❌ [v758] Registration error:", signUpError.message)

        if (signUpError.message.includes("fetch")) {
          setError(
            "⚠️ Cannot connect to database. The preview environment blocks external requests. Please use Demo Mode or deploy to production.",
          )
        } else {
          setError(signUpError.message)
        }
        return
      }

      console.log("✅ [v758] Registration successful")
      alert("✅ Registration successful! Please check your email to verify your account.")
    } catch (err) {
      console.error("❌ [v758] Unexpected registration error:", err)
      setError("An unexpected error occurred. Please try Demo Mode.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="h-12 w-12 text-cyan-400" />
          </div>
          <CardTitle className="text-2xl text-center text-white">FutureTask</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Your AI-powered productivity companion
          </CardDescription>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
            <Globe className="h-3 w-3" />
            <span>v758 • Build: 2025-01-03</span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Database Status Alert */}
          {isDatabaseAvailable === false && (
            <Alert className="mb-4 bg-yellow-900/20 border-yellow-600">
              <Database className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-200">
                🔒 Preview environment detected. Database connections are blocked.
                <br />
                <strong>Use Demo Mode</strong> to test the app, or deploy to production.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Demo Mode Button - Prominent */}
          <Button
            onClick={handleDemoLogin}
            className="w-full mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6"
            size="lg"
          >
            <Rocket className="mr-2 h-5 w-5" />🎮 Try Demo Mode (No Login Required)
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="login" className="data-[state=active]:bg-gray-700">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-gray-700">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="demo@future-task.com"
                    required
                    disabled={isLoading || isDatabaseAvailable === false}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    disabled={isLoading || isDatabaseAvailable === false}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gray-700 hover:bg-gray-600"
                  disabled={isLoading || isDatabaseAvailable === false}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading || isDatabaseAvailable === false}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    required
                    disabled={isLoading || isDatabaseAvailable === false}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gray-700 hover:bg-gray-600"
                  disabled={isLoading || isDatabaseAvailable === false}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
