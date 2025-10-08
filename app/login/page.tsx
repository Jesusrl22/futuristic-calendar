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
import { logVersion } from "@/lib/version"
import { Sparkles, Calendar, Brain, TrendingUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerName, setRegisterName] = useState("")

  useEffect(() => {
    logVersion()
    console.log(`📍 Current URL: ${window.location.href}`)
    console.log(`⏰ Page loaded: ${new Date().toISOString()}`)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("🔐 Login attempt initiated:", {
        email: loginEmail,
        timestamp: new Date().toISOString(),
      })

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      console.log("📥 Authentication response:", {
        success: !!data.user,
        error: authError?.message,
        userId: data.user?.id,
        session: !!data.session,
      })

      if (authError) {
        console.error("❌ Authentication failed:", authError.message)

        if (authError.message.includes("Failed to fetch") || authError.message.includes("fetch")) {
          setError("⚠️ Error de conexión. Por favor, verifica tu conexión a internet.")
        } else if (authError.message.includes("Invalid login credentials")) {
          setError("❌ Email o contraseña incorrectos.")
        } else if (authError.message.includes("Email not confirmed")) {
          setError("📧 Por favor, confirma tu email antes de iniciar sesión.")
        } else {
          setError(`Error: ${authError.message}`)
        }
        setIsLoading(false)
        return
      }

      if (data.user && data.session) {
        console.log("✅ Login successful - redirecting:", {
          userId: data.user.id,
          email: data.user.email,
          timestamp: new Date().toISOString(),
        })
        setSuccess("✅ ¡Inicio de sesión exitoso! Redirigiendo...")

        setTimeout(() => {
          try {
            router.push("/app")
            setTimeout(() => {
              if (window.location.pathname !== "/app") {
                window.location.href = "/app"
              }
            }, 500)
          } catch (redirectError) {
            console.error("❌ Redirect error:", redirectError)
            window.location.href = "/app"
          }
        }, 1000)
      } else {
        setError("Error al iniciar sesión. Por favor, intenta de nuevo.")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("💥 Unexpected error occurred:", err)
      setError("Error inesperado. Por favor, intenta de nuevo.")
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("📝 Registration attempt initiated:", {
        email: registerEmail,
        name: registerName,
        timestamp: new Date().toISOString(),
      })

      if (!registerEmail || !registerPassword || !registerName) {
        setError("Por favor, completa todos los campos")
        setIsLoading(false)
        return
      }

      if (registerPassword.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres")
        setIsLoading(false)
        return
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            name: registerName,
          },
          emailRedirectTo: `${window.location.origin}/app`,
        },
      })

      console.log("📥 Registration response:", {
        success: !!data.user,
        error: authError?.message,
        userId: data.user?.id,
      })

      if (authError) {
        console.error("❌ Registration failed:", authError.message)

        if (authError.message.includes("Failed to fetch") || authError.message.includes("fetch")) {
          setError("⚠️ Error de conexión. Por favor, verifica tu conexión a internet.")
        } else if (authError.message.includes("already registered")) {
          setError("❌ Este email ya está registrado. Por favor, inicia sesión.")
        } else {
          setError(`Error: ${authError.message}`)
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        console.log("✅ Registration successful:", {
          userId: data.user.id,
          email: data.user.email,
          timestamp: new Date().toISOString(),
        })
        setSuccess("✅ ¡Registro exitoso! Por favor, verifica tu email.")

        setRegisterEmail("")
        setRegisterPassword("")
        setRegisterName("")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("💥 Unexpected error occurred:", err)
      setError("Error inesperado. Por favor, intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold">FutureTask</h1>
          </div>

          <p className="text-xl text-gray-300">El futuro de la productividad con IA</p>

          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <Calendar className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Calendario Inteligente</h3>
                <p className="text-gray-400">Organiza tus tareas con IA avanzada</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Asistente IA</h3>
                <p className="text-gray-400">Planifica y optimiza tu tiempo automáticamente</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Análisis de Productividad</h3>
                <p className="text-gray-400">Estadísticas y logros para mejorar cada día</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full shadow-2xl border-2 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl">Bienvenido a FutureTask</CardTitle>
            <CardDescription>Inicia sesión o crea tu cuenta para comenzar</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
                    <Label htmlFor="register-name">Nombre</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      "Crear Cuenta"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
