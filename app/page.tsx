"use client"

import { useState } from "react"
import { Calendar, Brain, Zap, Star, ArrowRight, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/useLanguage"

export default function LandingPage() {
  const { t, mounted } = useLanguage()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">FutureTask</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector variant="button" showFlag={true} showName={false} />
            <a href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
              {t("nav.login")}
            </a>
            <a
              href="/login"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {t("nav.getStarted")}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/50 text-sm">
          <Sparkles className="inline-block h-4 w-4 mr-2" />
          {t("landing.subtitle")}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          {t("landing.title")}
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {t("common.and")} IA
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{t("landing.description")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-lg transition-colors"
          >
            {t("landing.heroButton")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <button className="inline-flex items-center justify-center px-8 py-3 border border-purple-500 text-white hover:bg-purple-500/10 text-lg rounded-lg transition-colors">
            {t("landing.heroSecondary")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
            <div className="text-gray-400">{t("common.user")}s</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">95%</div>
            <div className="text-gray-400">{t("landing.testimonialsSubtitle")}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">2M+</div>
            <div className="text-gray-400">{t("tasks.taskCompleted")}</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">{t("landing.featuresTitle")}</h2>
            <p className="text-gray-400 text-lg">{t("landing.featuresSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t("landing.feature1Title")}</h3>
              <p className="text-gray-400">{t("landing.feature1Description")}</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Calendar className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t("landing.feature2Title")}</h3>
              <p className="text-gray-400">{t("landing.feature2Description")}</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t("landing.feature4Title")}</h3>
              <p className="text-gray-400">{t("landing.feature4Description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">💎 {t("subscription.title")}</h2>
            <p className="text-gray-400 text-lg">{t("landing.pricingSubtitle")}</p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-800/80 p-1 rounded-lg flex gap-1">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 ${
                  billingCycle === "monthly"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                {t("common.monthly")}
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 ${
                  billingCycle === "yearly"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                {t("common.yearly")}
                <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">-17%</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-8 hover:border-gray-500/30 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">{t("subscription.free")}</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-400 mb-2">€0</div>
                <div className="text-gray-400 text-sm">
                  <div className="text-white mt-1">{t("landing.planFreePeriod")}</div>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t("calendar.title")} básico</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t("tasks.title")} ilimitadas</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t("pomodoro.title")}</span>
                </li>
              </ul>
              <a
                href="/login"
                className="block w-full text-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                {t("landing.heroButton")}
              </a>
            </div>

            {/* Premium Plan */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-8 hover:border-purple-500/30 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">{t("subscription.pro")}</h3>
              <div className="mb-6">
                {billingCycle === "monthly" ? (
                  <>
                    <div className="text-5xl font-bold text-purple-400 mb-2">€2.49</div>
                    <div className="text-gray-400 text-sm">
                      <div className="text-white mt-1">{t("landing.planProPeriod")}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-5xl font-bold text-purple-400 mb-2">€24.99</div>
                    <div className="text-gray-400 text-sm">
                      <div className="text-green-400 mt-1">€2.08/mes · Ahorra €5</div>
                    </div>
                  </>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Todo lo de {t("subscription.free")}</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Sincronización en la nube</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Análisis de productividad</span>
                </li>
              </ul>
              <a
                href="/login"
                className="block w-full text-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {t("nav.getStarted")}
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 backdrop-blur-sm rounded-lg p-8 relative hover:border-purple-500 transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold">
                Más Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                {billingCycle === "monthly" ? (
                  <>
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      €4.99
                    </div>
                    <div className="text-gray-300 text-sm">
                      <div className="text-white mt-1">{t("landing.planProPeriod")}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      €49.99
                    </div>
                    <div className="text-gray-300 text-sm">
                      <div className="text-green-400 mt-1">€4.17/mes · Ahorra €10</div>
                    </div>
                  </>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Todo lo de {t("subscription.pro")}</span>
                </li>
                <li className="flex items-start text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>500 créditos IA al mes</span>
                </li>
                <li className="flex items-start text-gray-200">
                  <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{t("ai.title")} avanzado</span>
                </li>
              </ul>
              <a
                href="/login"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors"
              >
                {t("nav.getStarted")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">{t("landing.testimonialsTitle")}</h2>
            <p className="text-gray-400 text-lg">{t("landing.testimonialsSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">{t("landing.testimonial1")}</p>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div className="ml-3 text-left">
                  <div className="text-white font-semibold">{t("landing.testimonial1Author")}</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">{t("landing.testimonial2")}</p>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="ml-3 text-left">
                  <div className="text-white font-semibold">{t("landing.testimonial2Author")}</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">{t("landing.testimonial3")}</p>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  EC
                </div>
                <div className="ml-3 text-left">
                  <div className="text-white font-semibold">{t("landing.testimonial3Author")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("landing.ctaTitle")}</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{t("landing.ctaSubtitle")}</p>
          <a
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-lg transition-colors"
          >
            {t("landing.ctaButton")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">FutureTask</span>
              </div>
              <p className="text-gray-400">{t("footer.description")}</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t("footer.product")}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.features")}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.pricing")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t("footer.company")}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.blog")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t("footer.legal")}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.privacy")}
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.terms")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FutureTask. {t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
