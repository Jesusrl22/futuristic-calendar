"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Sparkles, Rocket, CheckCircle2, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()

  const handleDemo = () => {
    // Store demo user in localStorage
    localStorage.setItem(
      "demoUser",
      JSON.stringify({
        id: "demo-user",
        name: "Usuario Demo",
        email: "demo@futuretask.com",
        subscription_plan: "premium",
        plan: "premium",
        ai_credits: 100,
        theme: "dark",
        isDemo: true,
      }),
    )
    router.push("/app")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl">
              <CalendarDays className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FutureTask
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tu asistente de productividad con IA</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Organiza tus tareas, gestiona tu tiempo y alcanza tus objetivos con la ayuda de inteligencia artificial.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Asistente IA</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Obtén sugerencias inteligentes para tus tareas
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Calendario Inteligente</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Visualiza y organiza todas tus actividades</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <Rocket className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Modo Pomodoro</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mejora tu concentración y productividad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Demo Mode */}
        <div className="space-y-6">
          <Card className="w-full shadow-2xl border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center lg:hidden mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl">
                  <CalendarDays className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Bienvenido a FutureTask</CardTitle>
              <CardDescription className="text-center">
                Explora todas las funcionalidades en modo demostración
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>ℹ️ Entorno de Preview</strong>
                  <p className="mt-2">
                    Estás en el entorno de preview de v0. La autenticación con base de datos está deshabilitada por
                    restricciones de red.
                  </p>
                  <p className="mt-2 font-semibold">
                    👉 Usa el <span className="text-purple-600 dark:text-purple-400">Modo Demo</span> para probar todas
                    las funcionalidades completas de la aplicación.
                  </p>
                </AlertDescription>
              </Alert>

              {/* Demo Features */}
              <div className="space-y-3 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-lg text-center text-purple-900 dark:text-purple-100">
                  ✨ Funcionalidades del Modo Demo
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>Gestión completa de tareas y calendario</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>Asistente IA con 100 créditos gratuitos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>Timer Pomodoro y estadísticas</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>Notas y lista de deseos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>Todas las funcionalidades Premium</span>
                  </div>
                </div>
              </div>

              {/* Demo Mode Button - Extra Prominent */}
              <Button
                onClick={handleDemo}
                className="w-full h-16 text-xl bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                size="lg"
              >
                <Zap className="mr-2 h-6 w-6" />🚀 Entrar al Modo Demo
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                No requiere registro ni configuración. Todos los datos se guardan localmente en tu navegador.
              </p>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>💡 Nota:</strong> Este es un entorno de demostración. Para usar la aplicación con
                  autenticación real y base de datos persistente, necesitarás desplegarla en tu propio servidor.
                </p>
                <p className="text-xs">
                  Puedes descargar el código y desplegarlo en Vercel, Netlify o cualquier otra plataforma compatible con
                  Next.js.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
