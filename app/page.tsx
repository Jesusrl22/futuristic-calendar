"use client"

import { useState, useEffect } from "react"
import { Calendar, Brain, Zap, Star, ArrowRight, Check, Sparkles, Shield, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/useLanguage"
import Link from "next/link"

export default function LandingPage() {
  const { t } = useLanguage()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="relative border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Calendar className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold text-white">FutureTask</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSelector variant="button" showFlag={true} showName={false} />
            <Link href="/blog" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all hover:scale-105"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </header>

      <section className="relative container mx-auto px-4 py-20 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/50 text-sm animate-bounce">
            <Sparkles className="inline-block h-4 w-4 mr-2" />
            La aplicación del futuro para tu productividad
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Organiza tu vida
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              con IA
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Gestiona tus tareas, optimiza tu tiempo con Pomodoro y alcanza tus metas con inteligencia artificial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              Comenzar gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-3 border border-purple-500 text-white hover:bg-purple-500/10 text-lg rounded-lg transition-all hover:scale-105">
              Ver demostración
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-purple-400 mr-2" />
                <div className="text-4xl font-bold text-purple-400">50K+</div>
              </div>
              <div className="text-gray-400">Usuarios activos</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-cyan-400 mr-2" />
                <div className="text-4xl font-bold text-cyan-400">95%</div>
              </div>
              <div className="text-gray-400">Satisfacción</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <Check className="h-8 w-8 text-purple-400 mr-2" />
                <div className="text-4xl font-bold text-purple-400">2M+</div>
              </div>
              <div className="text-gray-400">Tareas completadas</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Funciones Poderosas</h2>
            <p className="text-gray-400 text-lg">Todo lo que necesitas para ser más productivo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-600/30 transition-all group-hover:rotate-6">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Asistente IA</h3>
              <p className="text-gray-400">Organiza tus tareas automáticamente con inteligencia artificial</p>
            </div>

            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-cyan-600/30 transition-all group-hover:rotate-6">
                <Calendar className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Calendario Inteligente</h3>
              <p className="text-gray-400">Visualiza y planifica tu tiempo de forma eficiente</p>
            </div>

            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-600/30 transition-all group-hover:rotate-6">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pomodoro Timer</h3>
              <p className="text-gray-400">Mantén el foco con técnicas probadas de productividad</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">💎 Planes y Precios</h2>
            <p className="text-gray-400 text-lg">Elige el plan perfecto para ti</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-slate-800/80 p-1 rounded-lg flex gap-1">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 transition-all ${
                  billingCycle === "monthly"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                Mensual
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 transition-all ${
                  billingCycle === "yearly"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                Anual
                <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full animate-pulse">
                  Ahorra
                </span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-8 hover:border-gray-500/30 transition-all hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Free</h3>
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-400 mb-2">€0</div>
                <div className="text-gray-400 text-sm">
                  <div className="text-white mt-1">Para siempre</div>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Tareas ilimitadas</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Calendario básico</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Pomodoro básico</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Algunos logros</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full text-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all hover:scale-105"
              >
                Comenzar gratis
              </Link>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-8 hover:border-purple-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Premium</h3>
                <Star className="h-6 w-6 text-purple-400" />
              </div>
              <div className="mb-6">
                {billingCycle === "monthly" ? (
                  <>
                    <div className="text-5xl font-bold text-purple-400 mb-2">€2.49</div>
                    <div className="text-gray-400 text-sm">
                      <div className="text-xs">Base: €2.06 + IVA: €0.43</div>
                      <div className="text-white mt-1">/mes (IVA incluido)</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-5xl font-bold text-purple-400 mb-2">€24.99</div>
                    <div className="text-gray-400 text-sm">
                      <div className="text-xs">Base: €20.65 + IVA: €4.34</div>
                      <div className="text-green-400 mt-1">€2.08/mes · Ahorra €4.89/año</div>
                    </div>
                  </>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Todo de Gratis</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Eventos ilimitados</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Notas ilimitadas</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Lista de deseos</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Todos los logros</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Sincronización en la nube</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full text-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all hover:scale-105"
              >
                Comenzar
              </Link>
            </div>

            <div className="bg-gradient-to-b from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 backdrop-blur-sm rounded-lg p-8 relative hover:border-purple-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold animate-pulse">
                Más Popular
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Pro</h3>
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <div className="mb-6">
                {billingCycle === "monthly" ? (
                  <>
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      €4.99
                    </div>
                    <div className="text-gray-300 text-sm">
                      <div className="text-xs">Base: €4.12 + IVA: €0.87</div>
                      <div className="text-white mt-1">/mes (IVA incluido)</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      €49.99
                    </div>
                    <div className="text-gray-300 text-sm">
                      <div className="text-xs">Base: €41.31 + IVA: €8.68</div>
                      <div className="text-green-400 mt-1">€4.17/mes · Ahorra €9.89/año</div>
                    </div>
                  </>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Todo de Premium</span>
                </li>
                <li className="flex items-start text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>500 créditos IA/mes</span>
                </li>
                <li className="flex items-start text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Asistente IA avanzado</span>
                </li>
                <li className="flex items-start text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Análisis completos</span>
                </li>
                <li className="flex items-start text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all hover:scale-105"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-gray-400 text-lg">Miles de personas ya están siendo más productivas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center bg-white/5 p-6 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all hover:scale-105">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Esta app ha transformado completamente mi forma de trabajar. Ahora soy mucho más productiva."
              </p>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div className="ml-3 text-left">
                  <div className="text-white font-semibold">Sarah Martínez</div>
                </div>
              </div>
            </div>

            <div className="text-center bg-white/5 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-all hover:scale-105">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "El asistente IA es increíble. Organiza mis tareas mejor que yo mismo."
              </p>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="ml-3 text-left">
                  <div className="text-white font-semibold">Juan Díaz</div>
                </div>
              </div>
            </div>

            <div className="text-center bg-white/5 p-6 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all hover:scale-105">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Perfecta para mantenerme enfocada. El Pomodoro timer es justo lo que necesitaba."
              </p>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  EC
                </div>
                <div className="ml-3 text-left">
                  <div className="text-white font-semibold">Emma Castro</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">¿Listo para ser más productivo?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están alcanzando sus metas
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            Comenzar gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">FutureTask</span>
              </div>
              <p className="text-gray-400">La mejor app de productividad con IA</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Funciones
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Precios
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FutureTask. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
