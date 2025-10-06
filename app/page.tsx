"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Sparkles, Brain, CheckCircle, ArrowRight, Zap, Target, TrendingUp, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/hooks/useLanguage"
import { LanguageSelector } from "@/components/language-selector"
import { getVersionString } from "@/lib/version"
import { useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    console.log("🏠 Landing Page v762 loaded")
    console.log(`📦 Version: ${getVersionString()}`)
    console.log(`⏰ ${new Date().toISOString()}`)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      {/* Version Badge */}
      <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50 animate-pulse">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4" />
          {getVersionString()}
        </div>
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold">FutureTask</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Button variant="ghost" className="text-white hover:text-purple-200" onClick={() => router.push("/login")}>
            {t("login")}
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={() => router.push("/login")}
          >
            {t("getStarted")}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block">
            <span className="bg-purple-500/20 text-purple-200 px-4 py-2 rounded-full text-sm font-semibold">
              🚀 {t("aiPowered")}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            {t("heroTitle")}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              {t("heroHighlight")}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t("heroSubtitle")}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
              onClick={() => router.push("/login")}
            >
              {t("startFree")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 text-lg px-8 bg-transparent"
              onClick={() => router.push("/blog")}
            >
              {t("learnMore")}
            </Button>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl opacity-20"></div>
          <Image
            src="/futuristic-dashboard.png"
            alt="FutureTask Dashboard"
            width={1200}
            height={800}
            className="rounded-lg shadow-2xl border border-purple-500/20 relative"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">{t("features")}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">{t("smartCalendar")}</h3>
              <p className="text-gray-400">{t("smartCalendarDesc")}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">{t("aiAssistant")}</h3>
              <p className="text-gray-400">{t("aiAssistantDesc")}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">{t("analytics")}</h3>
              <p className="text-gray-400">{t("analyticsDesc")}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">{t("pomodoro")}</h3>
              <p className="text-gray-400">{t("pomodoroDesc")}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">{t("goals")}</h3>
              <p className="text-gray-400">{t("goalsDesc")}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">{t("achievements")}</h3>
              <p className="text-gray-400">{t("achievementsDesc")}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">{t("readyToStart")}</h2>
          <p className="text-xl text-purple-100 mb-8">{t("joinThousands")}</p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8"
            onClick={() => router.push("/login")}
          >
            {t("startNow")}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">FutureTask {getVersionString()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              {t("terms")}
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              {t("contact")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
