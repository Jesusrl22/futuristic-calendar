"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Loader2, AlertCircle, CheckCircle2, Sparkles, Mail, Lock, User, Info } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/useLanguage"
import { Alert, AlertDescription } from "@/components/ui/alert"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

  useEffect(() => {
    const verified = searchParams?.get("verified")
    if (verified === "true") {
      setSuccess("¡Email verificado! Ya puedes iniciar sesión.")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout - Please use Demo Mode")), 5000),
      )

      const loginPromise = supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      const result = await Promise.race([loginPromise, timeout])
      const { data, error: signInError } = result as any

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email o contraseña incorrectos")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Por favor, confirma tu email antes de iniciar sesión")
        } else if (signInError.message.includes("Demo mode")) {
          setError("⚠️ La base de datos no está configurada. Por favor, usa el Modo Demo para explorar la aplicación.")
        } else {
          setError(signInError.message)
        }
        setIsLoading(false)
        return
      }

      if (data?.user) {
        setSuccess("¡Inicio de sesión exitoso! Redirigiendo...")
        setTimeout(() => {
          router.push("/app")
        }, 1000)
      }
    } catch (err: any) {
      console.error("❌ Login error:", err)
      if (err.message === "Failed to fetch" || err.message.includes("Connection timeout")) {
        setError(
          "⚠️ No se puede conectar a la base de datos. Esto es normal en el entorno de preview. Por favor, usa el Modo Demo para probar la aplicación.",
        )
      } else {
        setError("Error al conectar. Por favor, usa el Modo Demo.")
      }
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (registerPassword !== registerConfirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (registerPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout - Please use Demo Mode")), 5000),
      )

      const registerPromise = supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: registerName,
            name: registerName,
          },
          emailRedirectTo: `${window.location.origin}/app`,
        },
      })

      const result = await Promise.race([registerPromise, timeout])
      const { data, error: signUpError } = result as any

      if (signUpError) {
        if (signUpError.message.includes("Demo mode")) {
          setError("⚠️ La base de datos no está configurada. Por favor, usa el Modo Demo para explorar la aplicación.")
        } else {
          setError(signUpError.message)
        }
        setIsLoading(false)
        return
      }

      if (data?.user) {
        if (data.user.identities?.length === 0) {
          setError("Este email ya está registrado. Por favor, inicia sesión.")
        } else {
          setSuccess(
            "¡Registro exitoso! Hemos enviado un email de verificación. Por favor, revisa tu bandeja de entrada.",
          )
          setRegisterEmail("")
          setRegisterPassword("")
          setRegisterName("")
          setRegisterConfirmPassword("")
        }
      }
    } catch (err: any) {
      console.error("❌ Register error:", err)
      if (err.message === "Failed to fetch" || err.message.includes("Connection timeout")) {
        setError(
          "⚠️ No se puede conectar a la base de datos. Esto es normal en el entorno de preview. Por favor, usa el Modo Demo para probar la aplicación.",
        )
      } else {
        setError("Error al conectar. Por favor, usa el Modo Demo.")
      }
      setIsLoading(false)
    }
  }

  const handleDemoMode = () => {
    console.log("🎯 Entering demo mode")
    router.push("/app?demo=true")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <Calendar className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FutureTask</h1>
          <p className="text-gray-600 dark:text-gray-400">Tu asistente de productividad con IA</p>
        </div>

        {/* Important Info Alert */}
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
            <strong>💡 Nota importante:</strong> En este entorno de preview, la base de datos puede no estar disponible.{" "}
            <strong>Usa el Modo Demo</strong> para explorar todas las funcionalidades de la aplicación sin necesidad de
            registro.
          </AlertDescription>
        </Alert>

        {/* Demo Mode Button - Highlighted */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-300 dark:border-purple-700">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-900 dark:text-purple-100">
              <Sparkles className="h-5 w-5 mr-2" />
              Modo Demo - Recomendado
            </CardTitle>
            <CardDescription className="text-purple-700 dark:text-purple-300">
              Explora todas las funcionalidades sin necesidad de registro o base de datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDemoMode}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />🚀 Probar Modo Demo Ahora
            </Button>
          </CardContent>
        </Card>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-500 dark:text-gray-400">
              O inicia sesión (requiere base de datos)
            </span>
          </div>
        </div>

        {/* Auth Tabs */}
        <Card className="shadow-xl">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* Error/Success Messages */}
            {error && (
              <div className="mx-6 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="mx-6 mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
              </div>
            )}

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Tu nombre"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      "Crear Cuenta"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Al continuar, aceptas nuestros{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
