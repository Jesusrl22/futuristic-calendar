"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Zap,
  Star,
  CheckSquare,
  BookOpen,
  Heart,
  Trophy,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email/password
      if (formData.email && formData.password) {
        // Store user session
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "user-" + Date.now(),
            email: formData.email,
            name: formData.name || formData.email.split("@")[0],
            plan: "free",
            aiCredits: 50,
          }),
        )

        router.push("/app")
      } else {
        setErrors({ general: "Por favor completa todos los campos" })
      }
    } catch (error) {
      setErrors({ general: "Error al iniciar sesión" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.password) {
        setErrors({ general: "Por favor completa todos los campos" })
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setErrors({ password: "Las contraseñas no coinciden" })
        return
      }

      if (formData.password.length < 6) {
        setErrors({ password: "La contraseña debe tener al menos 6 caracteres" })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user session
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "user-" + Date.now(),
          email: formData.email,
          name: formData.name,
          plan: "free",
          aiCredits: 50,
        }),
      )

      router.push("/app")
    } catch (error) {
      setErrors({ general: "Error al registrarse" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoAccess = () => {
    // Create demo user
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "demo-user",
        email: "demo@futuretask.com",
        name: "Usuario Demo",
        plan: "free",
        aiCredits: 50,
      }),
    )

    router.push("/app")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <ArrowLeft className="h-5 w-5 text-white" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">FutureTask</h1>
                  <p className="text-sm text-slate-400">Calendario Inteligente con IA</p>
                </div>
              </div>
            </Link>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              v2.0 Beta
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Hero */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Organiza tu vida con
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}
                  Inteligencia Artificial
                </span>
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                El calendario del futuro que se adapta a ti. Gestiona tareas, notas y objetivos con la ayuda de IA
                avanzada.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <CheckSquare className="h-5 w-5 text-green-400" />
                <span className="text-sm text-slate-300">Gestión de Tareas</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-slate-300">Notas Inteligentes</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <Heart className="h-5 w-5 text-red-400" />
                <span className="text-sm text-slate-300">Lista de Deseos</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-slate-300">Sistema de Logros</span>
              </div>
            </div>

            {/* Demo Access */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">¿Quieres probar sin registrarte?</h3>
              <p className="text-sm text-blue-200 mb-3">
                Accede con una cuenta demo y explora todas las funcionalidades
              </p>
              <Button
                onClick={handleDemoAccess}
                variant="outline"
                className="bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
              >
                <Star className="h-4 w-4 mr-2" />
                Acceso Demo
              </Button>
            </div>
          </div>

          {/* Right side - Auth Forms */}
          <div className="w-full max-w-md mx-auto">
            <Card className="bg-slate-900/95 border-slate-700/50 shadow-2xl backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Bienvenido</CardTitle>
                <CardDescription className="text-slate-400">
                  Inicia sesión o crea tu cuenta para comenzar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                    <TabsTrigger value="login" className="text-white">
                      Iniciar Sesión
                    </TabsTrigger>
                    <TabsTrigger value="register" className="text-white">
                      Registrarse
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Form */}
                  <TabsContent value="login" className="space-y-4 mt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-slate-300">
                          Email
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-slate-300">
                          Contraseña
                        </Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      {errors.general && <p className="text-sm text-red-400">{errors.general}</p>}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Iniciando sesión...
                          </>
                        ) : (
                          "Iniciar Sesión"
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register" className="space-y-4 mt-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name" className="text-slate-300">
                          Nombre completo
                        </Label>
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Tu nombre"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-slate-300">
                          Email
                        </Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-slate-300">
                          Contraseña
                        </Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm" className="text-slate-300">
                          Confirmar contraseña
                        </Label>
                        <Input
                          id="register-confirm"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
                      {errors.general && <p className="text-sm text-red-400">{errors.general}</p>}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

            {/* Plans Preview */}
            <div className="mt-6 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-3">Planes Disponibles</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Plan Gratuito</span>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-slate-400">50 créditos IA</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Plan Pro</span>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-slate-400">Créditos ilimitados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
