"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Calendar,
  Clock,
  Brain,
  Zap,
  Trophy,
  Globe,
  ChevronDown,
  Menu,
  X,
  Target,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

type Language = "es" | "en" | "fr" | "de" | "it" | "pt"

const translations = {
  es: {
    nav: {
      features: "Características",
      pricing: "Precios",
      blog: "Blog",
      contact: "Contacto",
      login: "Iniciar Sesión",
    },
    hero: {
      badge: "Lanzamiento 2025",
      title: "Tu Calendario Inteligente con IA",
      subtitle:
        "Organiza tu vida, alcanza tus metas y maximiza tu productividad con asistencia de inteligencia artificial",
      cta: "Comenzar Gratis",
      demo: "Ver Demo",
    },
    features: {
      title: "Características Potentes",
      subtitle: "Todo lo que necesitas para ser más productivo",
      calendar: {
        title: "Calendario Inteligente",
        description: "Organiza tus tareas y eventos con un calendario visual e intuitivo",
      },
      pomodoro: {
        title: "Temporizador Pomodoro",
        description: "Técnica de gestión del tiempo para maximizar tu concentración",
      },
      ai: {
        title: "Asistente IA",
        description: "Obtén sugerencias personalizadas y optimiza tu planificación",
      },
      notes: {
        title: "Notas Rápidas",
        description: "Captura ideas y pensamientos importantes al instante",
      },
      goals: {
        title: "Seguimiento de Metas",
        description: "Define y alcanza tus objetivos con recordatorios inteligentes",
      },
      achievements: {
        title: "Logros y Gamificación",
        description: "Mantén tu motivación con badges y recompensas",
      },
    },
    pricing: {
      title: "Planes para Todos",
      subtitle: "Elige el plan que mejor se adapte a tus necesidades",
      monthly: "Mensual",
      yearly: "Anual",
      free: {
        name: "Gratis",
        price: "0",
        period: "/mes",
        description: "Perfecto para comenzar",
        cta: "Comenzar Gratis",
        features: [
          "Calendario básico",
          "Temporizador Pomodoro",
          "Hasta 50 tareas",
          "Notas ilimitadas",
          "Sincronización básica",
        ],
      },
      premium: {
        name: "Premium",
        price: "4.99",
        period: "/mes",
        description: "Para usuarios avanzados",
        cta: "Empezar Premium",
        popular: "Más Popular",
        features: [
          "Todo en Gratis, más:",
          "Tareas ilimitadas",
          "Asistente IA básico",
          "Temas personalizados",
          "Exportar datos",
          "Soporte prioritario",
        ],
      },
      pro: {
        name: "Pro",
        price: "9.99",
        period: "/mes",
        description: "Para profesionales exigentes",
        cta: "Empezar Pro",
        features: [
          "Todo en Premium, más:",
          "IA avanzada ilimitada",
          "Análisis de productividad",
          "Integraciones avanzadas",
          "API personalizada",
          "Soporte 24/7",
        ],
      },
    },
    cta: {
      title: "¿Listo para ser más productivo?",
      subtitle: "Únete a miles de usuarios que ya están optimizando su tiempo",
      button: "Comenzar Ahora Gratis",
    },
    footer: {
      product: "Producto",
      features: "Características",
      pricing: "Precios",
      blog: "Blog",
      legal: "Legal",
      privacy: "Privacidad",
      terms: "Términos",
      cookies: "Cookies",
      support: "Soporte",
      contact: "Contacto",
      docs: "Documentación",
      rights: "© 2025 Calendario IA. Todos los derechos reservados.",
      language: "Idioma",
    },
  },
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      blog: "Blog",
      contact: "Contact",
      login: "Log In",
    },
    hero: {
      badge: "2025 Launch",
      title: "Your Smart AI Calendar",
      subtitle: "Organize your life, achieve your goals, and maximize productivity with AI assistance",
      cta: "Start Free",
      demo: "Watch Demo",
    },
    features: {
      title: "Powerful Features",
      subtitle: "Everything you need to be more productive",
      calendar: {
        title: "Smart Calendar",
        description: "Organize your tasks and events with a visual and intuitive calendar",
      },
      pomodoro: {
        title: "Pomodoro Timer",
        description: "Time management technique to maximize your focus",
      },
      ai: {
        title: "AI Assistant",
        description: "Get personalized suggestions and optimize your planning",
      },
      notes: {
        title: "Quick Notes",
        description: "Capture important ideas and thoughts instantly",
      },
      goals: {
        title: "Goal Tracking",
        description: "Set and achieve your objectives with smart reminders",
      },
      achievements: {
        title: "Achievements & Gamification",
        description: "Stay motivated with badges and rewards",
      },
    },
    pricing: {
      title: "Plans for Everyone",
      subtitle: "Choose the plan that best fits your needs",
      monthly: "Monthly",
      yearly: "Yearly",
      free: {
        name: "Free",
        price: "0",
        period: "/month",
        description: "Perfect to get started",
        cta: "Start Free",
        features: ["Basic calendar", "Pomodoro Timer", "Up to 50 tasks", "Unlimited notes", "Basic sync"],
      },
      premium: {
        name: "Premium",
        price: "4.99",
        period: "/month",
        description: "For advanced users",
        cta: "Start Premium",
        popular: "Most Popular",
        features: [
          "Everything in Free, plus:",
          "Unlimited tasks",
          "Basic AI assistant",
          "Custom themes",
          "Export data",
          "Priority support",
        ],
      },
      pro: {
        name: "Pro",
        price: "9.99",
        period: "/month",
        description: "For demanding professionals",
        cta: "Start Pro",
        features: [
          "Everything in Premium, plus:",
          "Unlimited advanced AI",
          "Productivity analytics",
          "Advanced integrations",
          "Custom API",
          "24/7 support",
        ],
      },
    },
    cta: {
      title: "Ready to be more productive?",
      subtitle: "Join thousands of users already optimizing their time",
      button: "Start Now Free",
    },
    footer: {
      product: "Product",
      features: "Features",
      pricing: "Pricing",
      blog: "Blog",
      legal: "Legal",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      support: "Support",
      contact: "Contact",
      docs: "Documentation",
      rights: "© 2025 AI Calendar. All rights reserved.",
      language: "Language",
    },
  },
  fr: {
    nav: {
      features: "Fonctionnalités",
      pricing: "Tarifs",
      blog: "Blog",
      contact: "Contact",
      login: "Connexion",
    },
    hero: {
      badge: "Lancement 2025",
      title: "Votre Calendrier Intelligent avec IA",
      subtitle:
        "Organisez votre vie, atteignez vos objectifs et maximisez votre productivité avec l'assistance de l'IA",
      cta: "Commencer Gratuitement",
      demo: "Voir la Démo",
    },
    features: {
      title: "Fonctionnalités Puissantes",
      subtitle: "Tout ce dont vous avez besoin pour être plus productif",
      calendar: {
        title: "Calendrier Intelligent",
        description: "Organisez vos tâches et événements avec un calendrier visuel et intuitif",
      },
      pomodoro: {
        title: "Minuteur Pomodoro",
        description: "Technique de gestion du temps pour maximiser votre concentration",
      },
      ai: {
        title: "Assistant IA",
        description: "Obtenez des suggestions personnalisées et optimisez votre planification",
      },
      notes: {
        title: "Notes Rapides",
        description: "Capturez instantanément des idées et pensées importantes",
      },
      goals: {
        title: "Suivi des Objectifs",
        description: "Définissez et atteignez vos objectifs avec des rappels intelligents",
      },
      achievements: {
        title: "Succès et Gamification",
        description: "Restez motivé avec des badges et récompenses",
      },
    },
    pricing: {
      title: "Plans pour Tous",
      subtitle: "Choisissez le plan qui correspond le mieux à vos besoins",
      monthly: "Mensuel",
      yearly: "Annuel",
      free: {
        name: "Gratuit",
        price: "0",
        period: "/mois",
        description: "Parfait pour commencer",
        cta: "Commencer Gratuitement",
        features: [
          "Calendrier de base",
          "Minuteur Pomodoro",
          "Jusqu'à 50 tâches",
          "Notes illimitées",
          "Synchronisation de base",
        ],
      },
      premium: {
        name: "Premium",
        price: "4.99",
        period: "/mois",
        description: "Pour utilisateurs avancés",
        cta: "Commencer Premium",
        popular: "Plus Populaire",
        features: [
          "Tout dans Gratuit, plus:",
          "Tâches illimitées",
          "Assistant IA de base",
          "Thèmes personnalisés",
          "Exporter les données",
          "Support prioritaire",
        ],
      },
      pro: {
        name: "Pro",
        price: "9.99",
        period: "/mois",
        description: "Pour professionnels exigeants",
        cta: "Commencer Pro",
        features: [
          "Tout dans Premium, plus:",
          "IA avancée illimitée",
          "Analyses de productivité",
          "Intégrations avancées",
          "API personnalisée",
          "Support 24/7",
        ],
      },
    },
    cta: {
      title: "Prêt à être plus productif?",
      subtitle: "Rejoignez des milliers d'utilisateurs qui optimisent déjà leur temps",
      button: "Commencer Maintenant Gratuitement",
    },
    footer: {
      product: "Produit",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      blog: "Blog",
      legal: "Légal",
      privacy: "Confidentialité",
      terms: "Conditions",
      cookies: "Cookies",
      support: "Support",
      contact: "Contact",
      docs: "Documentation",
      rights: "© 2025 Calendrier IA. Tous droits réservés.",
      language: "Langue",
    },
  },
  de: {
    nav: {
      features: "Funktionen",
      pricing: "Preise",
      blog: "Blog",
      contact: "Kontakt",
      login: "Anmelden",
    },
    hero: {
      badge: "Start 2025",
      title: "Ihr Intelligenter KI-Kalender",
      subtitle:
        "Organisieren Sie Ihr Leben, erreichen Sie Ihre Ziele und maximieren Sie Ihre Produktivität mit KI-Unterstützung",
      cta: "Kostenlos Starten",
      demo: "Demo Ansehen",
    },
    features: {
      title: "Leistungsstarke Funktionen",
      subtitle: "Alles, was Sie brauchen, um produktiver zu sein",
      calendar: {
        title: "Intelligenter Kalender",
        description: "Organisieren Sie Ihre Aufgaben und Termine mit einem visuellen und intuitiven Kalender",
      },
      pomodoro: {
        title: "Pomodoro-Timer",
        description: "Zeitmanagement-Technik zur Maximierung Ihrer Konzentration",
      },
      ai: {
        title: "KI-Assistent",
        description: "Erhalten Sie personalisierte Vorschläge und optimieren Sie Ihre Planung",
      },
      notes: {
        title: "Schnellnotizen",
        description: "Erfassen Sie wichtige Ideen und Gedanken sofort",
      },
      goals: {
        title: "Zielverfolgung",
        description: "Setzen und erreichen Sie Ihre Ziele mit intelligenten Erinnerungen",
      },
      achievements: {
        title: "Erfolge & Gamification",
        description: "Bleiben Sie motiviert mit Abzeichen und Belohnungen",
      },
    },
    pricing: {
      title: "Pläne für Jeden",
      subtitle: "Wählen Sie den Plan, der am besten zu Ihren Bedürfnissen passt",
      monthly: "Monatlich",
      yearly: "Jährlich",
      free: {
        name: "Kostenlos",
        price: "0",
        period: "/Monat",
        description: "Perfekt zum Einstieg",
        cta: "Kostenlos Starten",
        features: [
          "Basis-Kalender",
          "Pomodoro-Timer",
          "Bis zu 50 Aufgaben",
          "Unbegrenzte Notizen",
          "Basis-Synchronisation",
        ],
      },
      premium: {
        name: "Premium",
        price: "4.99",
        period: "/Monat",
        description: "Für fortgeschrittene Benutzer",
        cta: "Premium Starten",
        popular: "Am Beliebtesten",
        features: [
          "Alles in Kostenlos, plus:",
          "Unbegrenzte Aufgaben",
          "Basis-KI-Assistent",
          "Benutzerdefinierte Themes",
          "Daten exportieren",
          "Prioritäts-Support",
        ],
      },
      pro: {
        name: "Pro",
        price: "9.99",
        period: "/Monat",
        description: "Für anspruchsvolle Profis",
        cta: "Pro Starten",
        features: [
          "Alles in Premium, plus:",
          "Unbegrenzte erweiterte KI",
          "Produktivitätsanalysen",
          "Erweiterte Integrationen",
          "Benutzerdefinierte API",
          "24/7 Support",
        ],
      },
    },
    cta: {
      title: "Bereit, produktiver zu sein?",
      subtitle: "Schließen Sie sich Tausenden von Benutzern an, die ihre Zeit bereits optimieren",
      button: "Jetzt Kostenlos Starten",
    },
    footer: {
      product: "Produkt",
      features: "Funktionen",
      pricing: "Preise",
      blog: "Blog",
      legal: "Rechtliches",
      privacy: "Datenschutz",
      terms: "Bedingungen",
      cookies: "Cookies",
      support: "Support",
      contact: "Kontakt",
      docs: "Dokumentation",
      rights: "© 2025 KI-Kalender. Alle Rechte vorbehalten.",
      language: "Sprache",
    },
  },
  it: {
    nav: {
      features: "Funzionalità",
      pricing: "Prezzi",
      blog: "Blog",
      contact: "Contatto",
      login: "Accedi",
    },
    hero: {
      badge: "Lancio 2025",
      title: "Il Tuo Calendario Intelligente con IA",
      subtitle:
        "Organizza la tua vita, raggiungi i tuoi obiettivi e massimizza la produttività con l'assistenza dell'IA",
      cta: "Inizia Gratis",
      demo: "Guarda la Demo",
    },
    features: {
      title: "Funzionalità Potenti",
      subtitle: "Tutto ciò di cui hai bisogno per essere più produttivo",
      calendar: {
        title: "Calendario Intelligente",
        description: "Organizza i tuoi compiti ed eventi con un calendario visivo e intuitivo",
      },
      pomodoro: {
        title: "Timer Pomodoro",
        description: "Tecnica di gestione del tempo per massimizzare la concentrazione",
      },
      ai: {
        title: "Assistente IA",
        description: "Ottieni suggerimenti personalizzati e ottimizza la tua pianificazione",
      },
      notes: {
        title: "Note Rapide",
        description: "Cattura idee e pensieri importanti all'istante",
      },
      goals: {
        title: "Monitoraggio Obiettivi",
        description: "Definisci e raggiungi i tuoi obiettivi con promemoria intelligenti",
      },
      achievements: {
        title: "Successi e Gamification",
        description: "Mantieni la motivazione con badge e ricompense",
      },
    },
    pricing: {
      title: "Piani per Tutti",
      subtitle: "Scegli il piano più adatto alle tue esigenze",
      monthly: "Mensile",
      yearly: "Annuale",
      free: {
        name: "Gratuito",
        price: "0",
        period: "/mese",
        description: "Perfetto per iniziare",
        cta: "Inizia Gratis",
        features: [
          "Calendario base",
          "Timer Pomodoro",
          "Fino a 50 attività",
          "Note illimitate",
          "Sincronizzazione base",
        ],
      },
      premium: {
        name: "Premium",
        price: "4.99",
        period: "/mese",
        description: "Per utenti avanzati",
        cta: "Inizia Premium",
        popular: "Più Popolare",
        features: [
          "Tutto in Gratuito, più:",
          "Attività illimitate",
          "Assistente IA base",
          "Temi personalizzati",
          "Esporta dati",
          "Supporto prioritario",
        ],
      },
      pro: {
        name: "Pro",
        price: "9.99",
        period: "/mese",
        description: "Per professionisti esigenti",
        cta: "Inizia Pro",
        features: [
          "Tutto in Premium, più:",
          "IA avanzata illimitata",
          "Analisi produttività",
          "Integrazioni avanzate",
          "API personalizzata",
          "Supporto 24/7",
        ],
      },
    },
    cta: {
      title: "Pronto per essere più produttivo?",
      subtitle: "Unisciti a migliaia di utenti che stanno già ottimizzando il loro tempo",
      button: "Inizia Ora Gratis",
    },
    footer: {
      product: "Prodotto",
      features: "Funzionalità",
      pricing: "Prezzi",
      blog: "Blog",
      legal: "Legale",
      privacy: "Privacy",
      terms: "Termini",
      cookies: "Cookie",
      support: "Supporto",
      contact: "Contatto",
      docs: "Documentazione",
      rights: "© 2025 Calendario IA. Tutti i diritti riservati.",
      language: "Lingua",
    },
  },
  pt: {
    nav: {
      features: "Recursos",
      pricing: "Preços",
      blog: "Blog",
      contact: "Contato",
      login: "Entrar",
    },
    hero: {
      badge: "Lançamento 2025",
      title: "Seu Calendário Inteligente com IA",
      subtitle: "Organize sua vida, alcance seus objetivos e maximize sua produtividade com assistência de IA",
      cta: "Começar Grátis",
      demo: "Ver Demo",
    },
    features: {
      title: "Recursos Poderosos",
      subtitle: "Tudo o que você precisa para ser mais produtivo",
      calendar: {
        title: "Calendário Inteligente",
        description: "Organize suas tarefas e eventos com um calendário visual e intuitivo",
      },
      pomodoro: {
        title: "Timer Pomodoro",
        description: "Técnica de gestão de tempo para maximizar sua concentração",
      },
      ai: {
        title: "Assistente IA",
        description: "Obtenha sugestões personalizadas e otimize seu planejamento",
      },
      notes: {
        title: "Notas Rápidas",
        description: "Capture ideias e pensamentos importantes instantaneamente",
      },
      goals: {
        title: "Acompanhamento de Metas",
        description: "Defina e alcance seus objetivos com lembretes inteligentes",
      },
      achievements: {
        title: "Conquistas e Gamificação",
        description: "Mantenha sua motivação com badges e recompensas",
      },
    },
    pricing: {
      title: "Planos para Todos",
      subtitle: "Escolha o plano que melhor se adapta às suas necessidades",
      monthly: "Mensal",
      yearly: "Anual",
      free: {
        name: "Grátis",
        price: "0",
        period: "/mês",
        description: "Perfeito para começar",
        cta: "Começar Grátis",
        features: ["Calendário básico", "Timer Pomodoro", "Até 50 tarefas", "Notas ilimitadas", "Sincronização básica"],
      },
      premium: {
        name: "Premium",
        price: "4.99",
        period: "/mês",
        description: "Para usuários avançados",
        cta: "Começar Premium",
        popular: "Mais Popular",
        features: [
          "Tudo no Grátis, mais:",
          "Tarefas ilimitadas",
          "Assistente IA básico",
          "Temas personalizados",
          "Exportar dados",
          "Suporte prioritário",
        ],
      },
      pro: {
        name: "Pro",
        price: "9.99",
        period: "/mês",
        description: "Para profissionais exigentes",
        cta: "Começar Pro",
        features: [
          "Tudo no Premium, mais:",
          "IA avançada ilimitada",
          "Análise de produtividade",
          "Integrações avançadas",
          "API personalizada",
          "Suporte 24/7",
        ],
      },
    },
    cta: {
      title: "Pronto para ser mais produtivo?",
      subtitle: "Junte-se a milhares de usuários que já estão otimizando seu tempo",
      button: "Começar Agora Grátis",
    },
    footer: {
      product: "Produto",
      features: "Recursos",
      pricing: "Preços",
      blog: "Blog",
      legal: "Legal",
      privacy: "Privacidade",
      terms: "Termos",
      cookies: "Cookies",
      support: "Suporte",
      contact: "Contato",
      docs: "Documentação",
      rights: "© 2025 Calendário IA. Todos os direitos reservados.",
      language: "Idioma",
    },
  },
}

const languages = [
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "en" as Language, name: "English", flag: "🇬🇧" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
  { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
  { code: "pt" as Language, name: "Português", flag: "🇵🇹" },
]

export default function LandingPage() {
  const [language, setLanguage] = useState<Language>("es")
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Calendario IA</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t.nav.features}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t.nav.pricing}
              </a>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t.nav.blog}
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t.nav.contact}
              </Link>

              {/* Language Selector Desktop */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">{currentLang.flag}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setLangMenuOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 ${
                          language === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/login">
                <Button variant="outline">{t.nav.login}</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t.nav.features}
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t.nav.pricing}
                </a>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t.nav.blog}
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {t.nav.contact}
                </Link>

                {/* Language Selection Mobile */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-500 mb-2">{t.footer.language}</div>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setMobileMenuOpen(false)
                        }}
                        className={`w-full px-4 py-2 rounded-lg text-left flex items-center space-x-2 ${
                          language === lang.code ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Link href="/login" className="pt-2">
                  <Button className="w-full">{t.nav.login}</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Sparkles className="h-4 w-4 mr-2 inline" />
            {t.hero.badge}
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6">
                {t.hero.cta}
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
            <Image
              src="/futuristic-dashboard.png"
              alt="Dashboard Preview"
              width={1200}
              height={600}
              className="rounded-2xl shadow-2xl border border-gray-200"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.features.title}</h2>
            <p className="text-xl text-gray-600">{t.features.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>{t.features.calendar.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.calendar.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>{t.features.pomodoro.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.pomodoro.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <Brain className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>{t.features.ai.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.ai.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>{t.features.notes.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.notes.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <Target className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>{t.features.goals.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.goals.description}</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <Trophy className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>{t.features.achievements.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.features.achievements.description}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.pricing.title}</h2>
            <p className="text-xl text-gray-600">{t.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">{t.pricing.free.name}</CardTitle>
                <CardDescription>{t.pricing.free.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€{t.pricing.free.price}</span>
                  <span className="text-gray-500">{t.pricing.free.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    {t.pricing.free.cta}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {t.pricing.free.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-blue-500 hover:shadow-xl transition-all relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                {t.pricing.premium.popular}
              </Badge>
              <CardHeader>
                <CardTitle className="text-2xl">{t.pricing.premium.name}</CardTitle>
                <CardDescription>{t.pricing.premium.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€{t.pricing.premium.price}</span>
                  <span className="text-gray-500">{t.pricing.premium.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/login" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">{t.pricing.premium.cta}</Button>
                </Link>
                <ul className="space-y-3">
                  {t.pricing.premium.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">{t.pricing.pro.name}</CardTitle>
                <CardDescription>{t.pricing.pro.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€{t.pricing.pro.price}</span>
                  <span className="text-gray-500">{t.pricing.pro.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    {t.pricing.pro.cta}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {t.pricing.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{t.cta.title}</h2>
          <p className="text-xl text-blue-100 mb-8">{t.cta.subtitle}</p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              {t.cta.button}
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-white">Calendario IA</span>
              </div>
              <p className="text-sm text-gray-400">{t.hero.subtitle}</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">{t.footer.product}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    {t.footer.features}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    {t.footer.pricing}
                  </a>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    {t.footer.blog}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">{t.footer.legal}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    {t.footer.cookies}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">{t.footer.support}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    {t.footer.contact}
                  </Link>
                </li>
              </ul>

              {/* Language selector in footer */}
              <div className="mt-6">
                <h4 className="text-white font-semibold mb-2">{t.footer.language}</h4>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`px-2 py-1 rounded text-sm ${
                        language === lang.code ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"
                      }`}
                      title={lang.name}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>{t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
