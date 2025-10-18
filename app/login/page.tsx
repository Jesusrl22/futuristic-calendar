"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Loader2, Mail, Lock, User } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Clear any existing sessions when component mounts
  useEffect(() => {
    const clearExistingSessions = async () => {
      try {
        await supabase.auth.signOut()
        localStorage.clear()
        sessionStorage.clear()
        console.log("🧹 Cleared existing sessions")
      } catch (err) {
        console.error("Error clearing sessions:", err)
      }
    }
    clearExistingSessions()
  }, [])

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          console.log("✅ Active session found, redirecting...")
          router.push("/app")
        }
      } catch (err) {
        console.error("Error checking auth:", err)
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!email || !password) {
      setError("Por favor, introduce tu email y contraseña")
      return
    }

    if (password.length < 6) {
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

      if (signInError) {
        console.error("❌ Login error:", signInError)
        setError("Credenciales incorrectas")
        setLoading(false)
        return
      }

      if (!data?.session?.user) {
        console.error("❌ No session returned")
        setError("No se pudo iniciar sesión")
        setLoading(false)
        return
      }

      console.log("✅ Login successful:", data.session.user.email)

      // Verify the user exists in the database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.session.user.id)
        .single()

      if (userError && userError.code !== "PGRST116") {
        console.error("Error checking user:", userError)
      }

      // If user doesn't exist in DB, create them
      if (!userData) {
        console.log("📝 Creating user in database...")
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.session.user.id,
            email: data.session.user.email,
            full_name:
              data.session.user.user_metadata?.full_name || data.session.user.email?.split("@")[0] || "Usuario",
            subscription_tier: "free",
            ai_credits: 0,
            theme_preference: "dark",
          },
        ])

        if (insertError) {
          console.error("Error creating user:", insertError)
        }
      }

      // Verify session is valid before redirecting
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        console.log("✅ Session verified, redirecting to app...")
        router.push("/app")
      } else {
        console.error("❌ Session validation failed")
        setError("Error al verificar la sesión")
        setLoading(false)
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err)
      setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.")
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!email || !password || !name) {
      setError("Por favor, completa todos los campos")
      return
    }

    if (password.length < 6) {
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
            full_name: name.trim(),
            name: name.trim(),
          },
        },
      })

      if (signUpError) {
        console.error("❌ Registration error:", signUpError)
        setError(signUpError.message || "Error al registrarse")
        setLoading(false)
        return
      }

      if (!data?.user) {
        console.error("❌ No user returned")
        setError("Error al crear la cuenta")
        setLoading(false)
        return
      }

      console.log("✅ Registration successful:", data.user.email)

      // Create user in database
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: name.trim(),
          subscription_tier: "free",
          ai_credits: 0,
          theme_preference: "dark",
        },
      ])

      if (insertError) {
        console.error("Error creating user in DB:", insertError)
      }

      // Check if email confirmation is required
      if (data.session) {
        console.log("✅ Auto-confirmed, redirecting...")
        router.push("/app")
      } else {
        setError("Registro exitoso. Por favor, verifica tu email antes de iniciar sesión.")
        setIsLogin(true)
      }

      setLoading(false)
    } catch (err) {
      console.error("❌ Unexpected error:", err)
      setError("Error al registrarse. Por favor, inténtalo de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">FutureTask</h1>
            <p className="text-gray-300 text-center">
              {isLogin ? "Inicia sesión en tu cuenta" : "Crea tu cuenta gratuita"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">
                  Nombre completo *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Contraseña *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</p>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password || (!isLogin && !name)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : isLogin ? (
                "Iniciar Sesión"
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
                setEmail("")
                setPassword("")
                setName("")
              }}
              className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/?demo=true")}
              className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
            >
              O prueba el <span className="text-yellow-400 font-semibold">Modo Demo</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <a href="/privacy" className="hover:text-gray-300 transition-colors">
            Privacidad
          </a>
          {" · "}
          <a href="/terms" className="hover:text-gray-300 transition-colors">
            Términos
          </a>
        </div>
      </div>
    </div>
  )
}
