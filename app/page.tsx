"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage"
import { LanguageSelector } from "@/components/language-selector"
import { CookieBanner } from "@/components/cookie-banner"
import {
  Calendar,
  CheckSquare,
  FileText,
  Brain,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  Play,
  Zap,
  Sparkles,
  Clock,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"

function LandingPageContent() {
  const { language, t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const router = useRouter()

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observe all animation elements
    const animatedElements = document.querySelectorAll(
      ".fade-in-on-scroll, .slide-in-left-on-scroll, .slide-in-right-on-scroll, .scale-in-on-scroll",
    )

    animatedElements.forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const features = [
    {
      icon: CheckSquare,
      title: t("taskManagement"),
      description: t("taskManagementDesc"),
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Calendar,
      title: t("smartCalendar"),
      description: t("smartCalendarDesc"),
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Brain,
      title: t("aiAssistant"),
      description: t("aiAssistantDesc"),
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: FileText,
      title: t("notesTaking"),
      description: t("notesTakingDesc"),
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: BarChart3,
      title: t("analytics"),
      description: t("analyticsDesc"),
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: Users,
      title: t("collaboration"),
      description: t("collaborationDesc"),
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ]

  const pricingPlans = [
    {
      name: t("free"),
      price: t("freePrice"),
      period: t("perMonth"),
      features: t("freeFeatures"),
      popular: false,
      color: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
    },
    {
      name: t("premium"),
      price: t("premiumPrice"),
      period: t("perMonth"),
      features: t("premiumFeatures"),
      popular: true,
      color: "border-blue-500 ring-2 ring-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: t("pro"),
      price: t("proPrice"),
      period: t("perMonth"),
      features: t("proFeatures"),
      popular: false,
      color: "border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ]

  const testimonials = [
    {
      content: t("testimonial1"),
      author: t("testimonial1Author"),
      role: t("testimonial1Role"),
      avatar: "/professional-woman-diverse.png",
      rating: 5,
    },
    {
      content: t("testimonial2"),
      author: t("testimonial2Author"),
      role: t("testimonial2Role"),
      avatar: "/professional-man.png",
      rating: 5,
    },
    {
      content: t("testimonial3"),
      author: t("testimonial3Author"),
      role: t("testimonial3Role"),
      avatar: "/confident-business-woman.png",
      rating: 5,
    },
  ]

  const blogPosts = [
    {
      slug: "maximiza-productividad-2025",
      title: t("blogPost1Title"),
      excerpt: t("blogPost1Excerpt"),
      image: "/productivity-workspace.png",
      date: "15 Ene 2025",
      readTime: "5 min",
      category: "Productividad",
    },
    {
      slug: "futuro-trabajo-remoto-ia",
      title: t("blogPost2Title"),
      excerpt: t("blogPost2Excerpt"),
      image: "/remote-work-setup.png",
      date: "12 Ene 2025",
      readTime: "7 min",
      category: "Tecnología",
    },
    {
      slug: "organizacion-personal-digital",
      title: t("blogPost3Title"),
      excerpt: t("blogPost3Excerpt"),
      image: "/productivity-workspace.png",
      date: "10 Ene 2025",
      readTime: "6 min",
      category: "Trabajo Remoto",
    },
  ]

  const handleBlogClick = (slug: string) => {
    router.push(`/blog/${slug}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .fade-in-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }

        .fade-in-on-scroll.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-in-left-on-scroll {
          opacity: 0;
          transform: translateX(-30px);
          transition: all 0.6s ease-out;
        }

        .slide-in-left-on-scroll.animate {
          opacity: 1;
          transform: translateX(0);
        }

        .slide-in-right-on-scroll {
          opacity: 0;
          transform: translateX(30px);
          transition: all 0.6s ease-out;
        }

        .slide-in-right-on-scroll.animate {
          opacity: 1;
          transform: translateX(0);
        }

        .scale-in-on-scroll {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.6s ease-out;
        }

        .scale-in-on-scroll.animate {
          opacity: 1;
          transform: scale(1);
        }

        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }

        .float {
          animation: float 6s ease-in-out infinite;
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .glow:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
        }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 fade-in-on-scroll">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FutureTask
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t("features")}
              </a>
              <a
                href="#pricing"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t("pricing")}
              </a>
              <a
                href="#testimonials"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t("about")}
              </a>
              <a
                href="#blog"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t("blog")}
              </a>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSelector />
              <Button variant="ghost" asChild>
                <a href="/app">{t("login")}</a>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <a href="/app">{t("getStarted")}</a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSelector variant="compact" />
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-top duration-200">
              <div className="flex flex-col gap-4 pt-4">
                <a
                  href="#features"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("features")}
                </a>
                <a
                  href="#pricing"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("pricing")}
                </a>
                <a
                  href="#testimonials"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("about")}
                </a>
                <a
                  href="#blog"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("blog")}
                </a>
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="ghost" asChild className="justify-start">
                    <a href="/app">{t("login")}</a>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <a href="/app">{t("getStarted")}</a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="fade-in-on-scroll">
              <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/50 dark:to-purple-900/50 dark:text-blue-200 border-0">
                <Sparkles className="h-3 w-3 mr-1" />✨ Nuevo 2025
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 fade-in-on-scroll stagger-1">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Organiza tu vida
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">con IA</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed fade-in-on-scroll stagger-2">
              La plataforma de productividad más avanzada del 2025. Gestiona tareas, calendario y notas con inteligencia
              artificial.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-on-scroll stagger-3">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg hover-lift glow"
              >
                <a href="/app" className="flex items-center gap-2">
                  Comenzar Gratis
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover-lift bg-transparent">
                <Play className="h-5 w-5 mr-2" />
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-on-scroll">
              <span className="bg-gradient-to-r from-slate-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                {t("featuresTitle")}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto fade-in-on-scroll stagger-1">
              {t("featuresSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`hover-lift scale-in-on-scroll border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm stagger-${index + 1}`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-on-scroll">
              <span className="bg-gradient-to-r from-slate-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
                {t("pricingTitle")}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto fade-in-on-scroll stagger-1">
              {t("pricingSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative hover-lift scale-in-on-scroll ${plan.color} bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm stagger-${index + 1}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      {t("mostPopular")}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-slate-900 dark:text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-slate-600 dark:text-slate-300">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300 text-center">{plan.features}</p>

                  <Button className={`w-full ${plan.buttonColor} text-white hover-lift`} asChild>
                    <a href="/app">{t("choosePlan")}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-on-scroll">
              <span className="bg-gradient-to-r from-slate-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                {t("testimonialsTitle")}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto fade-in-on-scroll stagger-1">
              {t("testimonialsSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover-lift slide-in-left-on-scroll bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>

                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-on-scroll">
              <span className="bg-gradient-to-r from-slate-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
                {t("blogTitle")}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto fade-in-on-scroll stagger-1">
              {t("blogSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card
                key={index}
                className="hover-lift slide-in-right-on-scroll bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleBlogClick(post.slug)}
              >
                <div className="relative">
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white">{post.category}</Badge>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{post.excerpt}</p>

                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t("readMore")}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 fade-in-on-scroll">
              ¿Listo para revolucionar tu productividad?
            </h2>
            <p className="text-xl text-blue-100 mb-8 fade-in-on-scroll stagger-1">
              Únete a miles de usuarios que ya han transformado su forma de trabajar con FutureTask.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-on-scroll stagger-2">
              <Button
                size="lg"
                asChild
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg hover-lift"
              >
                <a href="/app" className="flex items-center gap-2">
                  Comenzar Gratis
                  <Zap className="h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg hover-lift bg-transparent"
              >
                Saber Más
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="fade-in-on-scroll">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">FutureTask</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                La plataforma de productividad más avanzada, diseñada para el futuro del trabajo.
              </p>
            </div>

            {/* Product Links */}
            <div className="fade-in-on-scroll stagger-1">
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integraciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="fade-in-on-scroll stagger-2">
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carreras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Prensa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="fade-in-on-scroll stagger-3">
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center fade-in-on-scroll">
            <p className="text-slate-400 text-sm">© 2025 FutureTask. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  )
}

export default function LandingPage() {
  return (
    <LanguageProvider>
      <LandingPageContent />
    </LanguageProvider>
  )
}
