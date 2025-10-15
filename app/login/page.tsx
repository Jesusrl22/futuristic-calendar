"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (session && !error) {
        console.log("✅ Active session found, redirecting...")
        router.push("/app")
      }
    } catch (err) {
      console.error("Error checking session:", err)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateEmail(email)) {
      setError("Por favor, introduce un email válido")
      return
    }

    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      console.log("🔐 Attempting login...")

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      console.log("📥 Authentication response:", {
        success: !signInError,
        error: signInError?.message,
        session: !!data?.session,
      })

      if (signInError) {
        console.error("❌ Authentication failed:", signInError.message)

        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email o contraseña incorrectos")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Por favor, confirma tu email antes de iniciar sesión")
        } else if (signInError.message.includes("Failed to fetch")) {
          setError("Error de conexión. Verifica tu conexión a internet y las credenciales de Supabase.")
        } else {
          setError(signInError.message)
        }
        return
      }

      if (data?.session) {
        console.log("✅ Login successful, session created")
        setSuccess("¡Inicio de sesión exitoso!")

        setTimeout(() => {
          router.push("/app")
        }, 500)
      } else {
        setError("No se pudo crear la sesión. Intenta de nuevo.")
      }
    } catch (err: any) {
      console.error("❌ Login error:", err)
      setError(err?.message || "Error inesperado al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!name.trim()) {
      setError("Por favor, introduce tu nombre")
      return
    }

    if (!validateEmail(email)) {
      setError("Por favor, introduce un email válido")
      return
    }

    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      console.log("📝 Attempting registration...")

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/app`,
        },
      })

      console.log("📥 Registration response:", {
        success: !signUpError,
        error: signUpError?.message,
        user: !!data?.user,
      })

      if (signUpError) {
        console.error("❌ Registration failed:", signUpError.message)

        if (signUpError.message.includes("User already registered")) {
          setError("Este email ya está registrado. Intenta iniciar sesión.")
        } else if (signUpError.message.includes("Failed to fetch")) {
          setError("Error de conexión. Verifica tu conexión a internet y las credenciales de Supabase.")
        } else {
          setError(signUpError.message)
        }
        return
      }

      if (data?.user) {
        console.log("✅ Registration successful")

        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: email.trim(),
          name: name.trim(),
          subscription_plan: "free",
          subscription_tier: "free",
          plan: "free",
          ai_credits: 10,
          theme: "dark",
          theme_preference: "dark",
          subscription_status: "active",
          billing_cycle: "monthly",
          pomodoro_work_duration: 25,
          pomodoro_break_duration: 5,
          pomodoro_long_break_duration: 15,
          pomodoro_sessions_until_long_break: 4,
        })

        if (insertError) {
          console.error("⚠️ Error creating user profile:", insertError)
        }

        setSuccess("¡Registro exitoso! Revisa tu email para confirmar tu cuenta.")
        setEmail("")
        setPassword("")
        setName("")
      }
    } catch (err: any) {
      console.error("❌ Registration error:", err)
      setError(err?.message || "Error inesperado al registrarse")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">FutureTask</CardTitle>
          <CardDescription className="text-center text-gray-300">Tu asistente de productividad con IA</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/10">
              <TabsTrigger value="login" className="data-[state=active]:bg-white/20">
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-white/20">
                Registrarse
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-500/20 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-500/20 border-green-500/50">
                <AlertDescription className="text-green-100">{success}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-white">
                    Contraseña
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-gray-300">
            <p>¿Problemas de conexión?</p>
            <p className="text-xs mt-2">Verifica las credenciales de Supabase en .env.local</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
