"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock, Sparkles, Target, Zap, Globe, ChevronDown, Menu, X, LogIn } from "lucide-react"

type Language = "es" | "en" | "fr" | "de" | "it" | "pt"

export default function LandingPage() {
  const [language, setLanguage] = useState<Language>("es")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)

  const languageNames = {
    es: "Español",
    en: "English",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    pt: "Português",
  }

  const content = {
    es: {
      login: "Iniciar Sesión",
      register: "Registrarse",
      features: "Características",
      pricing: "Precios",
      blog: "Blog",
      contact: "Contacto",
      heroTitle: "Organiza tu vida con inteligencia artificial",
      heroSubtitle: "La plataforma definitiva para gestionar tareas, notas y objetivos con el poder de la IA",
      heroCta: "Comenzar Gratis",
      heroCtaSecondary: "Ver Funcionalidades",
      featuresTitle: "Características Poderosas",
      featuresSubtitle: "Todo lo que necesitas para maximizar tu productividad",
      aiAssistantTitle: "Asistente IA",
      aiAssistantDesc: "Organiza tus tareas automáticamente con inteligencia artificial avanzada",
      smartCalendarTitle: "Calendario Inteligente",
      smartCalendarDesc: "Visualiza y planifica tu tiempo de manera eficiente con recordatorios inteligentes",
      pomodoroTitle: "Técnica Pomodoro",
      pomodoroDesc: "Mejora tu concentración con sesiones de trabajo cronometradas",
      notesTitle: "Notas Inteligentes",
      notesDesc: "Captura ideas rápidamente con organización automática",
      achievementsTitle: "Sistema de Logros",
      achievementsDesc: "Mantén tu motivación con insignias y estadísticas de progreso",
      multiplatformTitle: "Multiplataforma",
      multiplatformDesc: "Accede desde cualquier dispositivo con sincronización en tiempo real",
      pricingTitle: "Planes para cada necesidad",
      pricingSubtitle: "Elige el plan perfecto para ti",
      freeName: "Gratis",
      freePrice: "0",
      freeDesc: "Perfecto para comenzar",
      freeCta: "Comenzar Gratis",
      premiumName: "Premium",
      premiumPrice: "9.99",
      premiumDesc: "Para usuarios avanzados",
      premiumCta: "Comenzar Premium",
      proName: "Pro",
      proPrice: "19.99",
      proDesc: "Para equipos y empresas",
      proCta: "Comenzar Pro",
      ctaTitle: "¿Listo para aumentar tu productividad?",
      ctaSubtitle: "Únete a miles de usuarios que ya optimizan su tiempo con FutureTask",
      ctaButton: "Comenzar Ahora - Es Gratis",
      footerProduct: "Producto",
      footerFeatures: "Características",
      footerPricing: "Precios",
      footerBlog: "Blog",
      footerCompany: "Empresa",
      footerAbout: "Sobre nosotros",
      footerContact: "Contacto",
      footerLegal: "Legal",
      footerPrivacy: "Privacidad",
      footerTerms: "Términos",
      footerCookies: "Cookies",
      footerSupport: "Soporte",
      footerDocs: "Documentación",
      footerHelp: "Centro de Ayuda",
      footerCopyright: "© 2025 FutureTask. Todos los derechos reservados.",
      footerDescription: "La plataforma definitiva para gestionar tu productividad con IA",
      freeFeatures: ["50 tareas por mes", "10 notas", "Calendario básico", "Pomodoro timer", "Soporte por email"],
      premiumFeatures: [
        "Tareas ilimitadas",
        "Notas ilimitadas",
        "Asistente IA avanzado",
        "100 créditos IA/mes",
        "Calendario inteligente",
        "Sistema de logros",
        "Soporte prioritario",
      ],
      proFeatures: [
        "Todo de Premium",
        "500 créditos IA/mes",
        "Colaboración en equipo",
        "Integraciones avanzadas",
        "API access",
        "Soporte 24/7",
        "Informes personalizados",
      ],
    },
    en: {
      login: "Login",
      register: "Sign Up",
      features: "Features",
      pricing: "Pricing",
      blog: "Blog",
      contact: "Contact",
      heroTitle: "Organize your life with artificial intelligence",
      heroSubtitle: "The ultimate platform to manage tasks, notes and goals with the power of AI",
      heroCta: "Start Free",
      heroCtaSecondary: "View Features",
      featuresTitle: "Powerful Features",
      featuresSubtitle: "Everything you need to maximize your productivity",
      aiAssistantTitle: "AI Assistant",
      aiAssistantDesc: "Organize your tasks automatically with advanced artificial intelligence",
      smartCalendarTitle: "Smart Calendar",
      smartCalendarDesc: "Visualize and plan your time efficiently with smart reminders",
      pomodoroTitle: "Pomodoro Technique",
      pomodoroDesc: "Improve your focus with timed work sessions",
      notesTitle: "Smart Notes",
      notesDesc: "Capture ideas quickly with automatic organization",
      achievementsTitle: "Achievement System",
      achievementsDesc: "Stay motivated with badges and progress statistics",
      multiplatformTitle: "Multiplatform",
      multiplatformDesc: "Access from any device with real-time sync",
      pricingTitle: "Plans for every need",
      pricingSubtitle: "Choose the perfect plan for you",
      freeName: "Free",
      freePrice: "0",
      freeDesc: "Perfect to get started",
      freeCta: "Start Free",
      premiumName: "Premium",
      premiumPrice: "9.99",
      premiumDesc: "For advanced users",
      premiumCta: "Start Premium",
      proName: "Pro",
      proPrice: "19.99",
      proDesc: "For teams and businesses",
      proCta: "Start Pro",
      ctaTitle: "Ready to boost your productivity?",
      ctaSubtitle: "Join thousands of users already optimizing their time with FutureTask",
      ctaButton: "Start Now - It's Free",
      footerProduct: "Product",
      footerFeatures: "Features",
      footerPricing: "Pricing",
      footerBlog: "Blog",
      footerCompany: "Company",
      footerAbout: "About",
      footerContact: "Contact",
      footerLegal: "Legal",
      footerPrivacy: "Privacy",
      footerTerms: "Terms",
      footerCookies: "Cookies",
      footerSupport: "Support",
      footerDocs: "Documentation",
      footerHelp: "Help Center",
      footerCopyright: "© 2025 FutureTask. All rights reserved.",
      footerDescription: "The ultimate platform to manage your productivity with AI",
      freeFeatures: ["50 tasks per month", "10 notes", "Basic calendar", "Pomodoro timer", "Email support"],
      premiumFeatures: [
        "Unlimited tasks",
        "Unlimited notes",
        "Advanced AI assistant",
        "100 AI credits/month",
        "Smart calendar",
        "Achievement system",
        "Priority support",
      ],
      proFeatures: [
        "Everything in Premium",
        "500 AI credits/month",
        "Team collaboration",
        "Advanced integrations",
        "API access",
        "24/7 support",
        "Custom reports",
      ],
    },
    fr: {
      login: "Connexion",
      register: "S'inscrire",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      blog: "Blog",
      contact: "Contact",
      heroTitle: "Organisez votre vie avec l'intelligence artificielle",
      heroSubtitle: "La plateforme ultime pour gérer les tâches, les notes et les objectifs avec la puissance de l'IA",
      heroCta: "Commencer Gratuitement",
      heroCtaSecondary: "Voir les Fonctionnalités",
      featuresTitle: "Fonctionnalités Puissantes",
      featuresSubtitle: "Tout ce dont vous avez besoin pour maximiser votre productivité",
      aiAssistantTitle: "Assistant IA",
      aiAssistantDesc: "Organisez vos tâches automatiquement avec l'intelligence artificielle avancée",
      smartCalendarTitle: "Calendrier Intelligent",
      smartCalendarDesc: "Visualisez et planifiez votre temps efficacement avec des rappels intelligents",
      pomodoroTitle: "Technique Pomodoro",
      pomodoroDesc: "Améliorez votre concentration avec des sessions de travail chronométrées",
      notesTitle: "Notes Intelligentes",
      notesDesc: "Capturez rapidement des idées avec une organisation automatique",
      achievementsTitle: "Système de Réalisations",
      achievementsDesc: "Restez motivé avec des badges et des statistiques de progression",
      multiplatformTitle: "Multiplateforme",
      multiplatformDesc: "Accédez depuis n'importe quel appareil avec synchronisation en temps réel",
      pricingTitle: "Des plans pour tous les besoins",
      pricingSubtitle: "Choisissez le plan parfait pour vous",
      freeName: "Gratuit",
      freePrice: "0",
      freeDesc: "Parfait pour commencer",
      freeCta: "Commencer Gratuitement",
      premiumName: "Premium",
      premiumPrice: "9.99",
      premiumDesc: "Pour les utilisateurs avancés",
      premiumCta: "Commencer Premium",
      proName: "Pro",
      proPrice: "19.99",
      proDesc: "Pour les équipes et les entreprises",
      proCta: "Commencer Pro",
      ctaTitle: "Prêt à booster votre productivité?",
      ctaSubtitle: "Rejoignez des milliers d'utilisateurs qui optimisent déjà leur temps avec FutureTask",
      ctaButton: "Commencer Maintenant - C'est Gratuit",
      footerProduct: "Produit",
      footerFeatures: "Fonctionnalités",
      footerPricing: "Tarifs",
      footerBlog: "Blog",
      footerCompany: "Entreprise",
      footerAbout: "À propos",
      footerContact: "Contact",
      footerLegal: "Légal",
      footerPrivacy: "Confidentialité",
      footerTerms: "Conditions",
      footerCookies: "Cookies",
      footerSupport: "Support",
      footerDocs: "Documentation",
      footerHelp: "Centre d'Aide",
      footerCopyright: "© 2025 FutureTask. Tous droits réservés.",
      footerDescription: "La plateforme ultime pour gérer votre productivité avec l'IA",
      freeFeatures: ["50 tâches par mois", "10 notes", "Calendrier de base", "Minuteur Pomodoro", "Support par e-mail"],
      premiumFeatures: [
        "Tâches illimitées",
        "Notes illimitées",
        "Assistant IA avancé",
        "100 crédits IA/mois",
        "Calendrier intelligent",
        "Système de réalisations",
        "Support prioritaire",
      ],
      proFeatures: [
        "Tout de Premium",
        "500 crédits IA/mois",
        "Collaboration d'équipe",
        "Intégrations avancées",
        "Accès API",
        "Support 24/7",
        "Rapports personnalisés",
      ],
    },
    de: {
      login: "Anmelden",
      register: "Registrieren",
      features: "Funktionen",
      pricing: "Preise",
      blog: "Blog",
      contact: "Kontakt",
      heroTitle: "Organisieren Sie Ihr Leben mit künstlicher Intelligenz",
      heroSubtitle: "Die ultimative Plattform zur Verwaltung von Aufgaben, Notizen und Zielen mit der Kraft der KI",
      heroCta: "Kostenlos Starten",
      heroCtaSecondary: "Funktionen Ansehen",
      featuresTitle: "Leistungsstarke Funktionen",
      featuresSubtitle: "Alles, was Sie brauchen, um Ihre Produktivität zu maximieren",
      aiAssistantTitle: "KI-Assistent",
      aiAssistantDesc: "Organisieren Sie Ihre Aufgaben automatisch mit fortschrittlicher künstlicher Intelligenz",
      smartCalendarTitle: "Intelligenter Kalender",
      smartCalendarDesc: "Visualisieren und planen Sie Ihre Zeit effizient mit intelligenten Erinnerungen",
      pomodoroTitle: "Pomodoro-Technik",
      pomodoroDesc: "Verbessern Sie Ihre Konzentration mit zeitgesteuerten Arbeitssitzungen",
      notesTitle: "Intelligente Notizen",
      notesDesc: "Erfassen Sie Ideen schnell mit automatischer Organisation",
      achievementsTitle: "Erfolgssystem",
      achievementsDesc: "Bleiben Sie motiviert mit Abzeichen und Fortschrittsstatistiken",
      multiplatformTitle: "Multiplattform",
      multiplatformDesc: "Zugriff von jedem Gerät mit Echtzeit-Synchronisation",
      pricingTitle: "Pläne für jeden Bedarf",
      pricingSubtitle: "Wählen Sie den perfekten Plan für Sie",
      freeName: "Kostenlos",
      freePrice: "0",
      freeDesc: "Perfekt zum Einstieg",
      freeCta: "Kostenlos Starten",
      premiumName: "Premium",
      premiumPrice: "9.99",
      premiumDesc: "Für fortgeschrittene Benutzer",
      premiumCta: "Premium Starten",
      proName: "Pro",
      proPrice: "19.99",
      proDesc: "Für Teams und Unternehmen",
      proCta: "Pro Starten",
      ctaTitle: "Bereit, Ihre Produktivität zu steigern?",
      ctaSubtitle: "Schließen Sie sich Tausenden von Benutzern an, die ihre Zeit bereits mit FutureTask optimieren",
      ctaButton: "Jetzt Starten - Es ist Kostenlos",
      footerProduct: "Produkt",
      footerFeatures: "Funktionen",
      footerPricing: "Preise",
      footerBlog: "Blog",
      footerCompany: "Unternehmen",
      footerAbout: "Über uns",
      footerContact: "Kontakt",
      footerLegal: "Rechtliches",
      footerPrivacy: "Datenschutz",
      footerTerms: "Bedingungen",
      footerCookies: "Cookies",
      footerSupport: "Support",
      footerDocs: "Dokumentation",
      footerHelp: "Hilfecenter",
      footerCopyright: "© 2025 FutureTask. Alle Rechte vorbehalten.",
      footerDescription: "Die ultimative Plattform zur Verwaltung Ihrer Produktivität mit KI",
      freeFeatures: ["50 Aufgaben pro Monat", "10 Notizen", "Basis-Kalender", "Pomodoro-Timer", "E-Mail-Support"],
      premiumFeatures: [
        "Unbegrenzte Aufgaben",
        "Unbegrenzte Notizen",
        "Erweiterter KI-Assistent",
        "100 KI-Credits/Monat",
        "Intelligenter Kalender",
        "Erfolgssystem",
        "Prioritäts-Support",
      ],
      proFeatures: [
        "Alles von Premium",
        "500 KI-Credits/Monat",
        "Team-Zusammenarbeit",
        "Erweiterte Integrationen",
        "API-Zugang",
        "24/7 Support",
        "Benutzerdefinierte Berichte",
      ],
    },
    it: {
      login: "Accedi",
      register: "Registrati",
      features: "Funzionalità",
      pricing: "Prezzi",
      blog: "Blog",
      contact: "Contatto",
      heroTitle: "Organizza la tua vita con l'intelligenza artificiale",
      heroSubtitle: "La piattaforma definitiva per gestire attività, note e obiettivi con il potere dell'IA",
      heroCta: "Inizia Gratis",
      heroCtaSecondary: "Vedi Funzionalità",
      featuresTitle: "Funzionalità Potenti",
      featuresSubtitle: "Tutto ciò di cui hai bisogno per massimizzare la tua produttività",
      aiAssistantTitle: "Assistente IA",
      aiAssistantDesc: "Organizza le tue attività automaticamente con intelligenza artificiale avanzata",
      smartCalendarTitle: "Calendario Intelligente",
      smartCalendarDesc: "Visualizza e pianifica il tuo tempo in modo efficiente con promemoria intelligenti",
      pomodoroTitle: "Tecnica Pomodoro",
      pomodoroDesc: "Migliora la tua concentrazione con sessioni di lavoro temporizzate",
      notesTitle: "Note Intelligenti",
      notesDesc: "Cattura rapidamente le idee con organizzazione automatica",
      achievementsTitle: "Sistema di Risultati",
      achievementsDesc: "Rimani motivato con badge e statistiche di progresso",
      multiplatformTitle: "Multipiattaforma",
      multiplatformDesc: "Accedi da qualsiasi dispositivo con sincronizzazione in tempo reale",
      pricingTitle: "Piani per ogni esigenza",
      pricingSubtitle: "Scegli il piano perfetto per te",
      freeName: "Gratuito",
      freePrice: "0",
      freeDesc: "Perfetto per iniziare",
      freeCta: "Inizia Gratis",
      premiumName: "Premium",
      premiumPrice: "9.99",
      premiumDesc: "Per utenti avanzati",
      premiumCta: "Inizia Premium",
      proName: "Pro",
      proPrice: "19.99",
      proDesc: "Per team e aziende",
      proCta: "Inizia Pro",
      ctaTitle: "Pronto a migliorare la tua produttività?",
      ctaSubtitle: "Unisciti a migliaia di utenti che stanno già ottimizzando il loro tempo con FutureTask",
      ctaButton: "Inizia Ora - È Gratis",
      footerProduct: "Prodotto",
      footerFeatures: "Funzionalità",
      footerPricing: "Prezzi",
      footerBlog: "Blog",
      footerCompany: "Azienda",
      footerAbout: "Chi siamo",
      footerContact: "Contatto",
      footerLegal: "Legale",
      footerPrivacy: "Privacy",
      footerTerms: "Termini",
      footerCookies: "Cookie",
      footerSupport: "Supporto",
      footerDocs: "Documentazione",
      footerHelp: "Centro Assistenza",
      footerCopyright: "© 2025 FutureTask. Tutti i diritti riservati.",
      footerDescription: "La piattaforma definitiva per gestire la tua produttività con l'IA",
      freeFeatures: ["50 attività al mese", "10 note", "Calendario base", "Timer Pomodoro", "Supporto email"],
      premiumFeatures: [
        "Attività illimitate",
        "Note illimitate",
        "Assistente IA avanzato",
        "100 crediti IA/mese",
        "Calendario intelligente",
        "Sistema di risultati",
        "Supporto prioritario",
      ],
      proFeatures: [
        "Tutto di Premium",
        "500 crediti IA/mese",
        "Collaborazione team",
        "Integrazioni avanzate",
        "Accesso API",
        "Supporto 24/7",
        "Report personalizzati",
      ],
    },
    pt: {
      login: "Entrar",
      register: "Registrar",
      features: "Funcionalidades",
      pricing: "Preços",
      blog: "Blog",
      contact: "Contato",
      heroTitle: "Organize sua vida com inteligência artificial",
      heroSubtitle: "A plataforma definitiva para gerenciar tarefas, notas e objetivos com o poder da IA",
      heroCta: "Começar Grátis",
      heroCtaSecondary: "Ver Funcionalidades",
      featuresTitle: "Funcionalidades Poderosas",
      featuresSubtitle: "Tudo o que você precisa para maximizar sua produtividade",
      aiAssistantTitle: "Assistente IA",
      aiAssistantDesc: "Organize suas tarefas automaticamente com inteligência artificial avançada",
      smartCalendarTitle: "Calendário Inteligente",
      smartCalendarDesc: "Visualize e planeje seu tempo de forma eficiente com lembretes inteligentes",
      pomodoroTitle: "Técnica Pomodoro",
      pomodoroDesc: "Melhore seu foco com sessões de trabalho cronometradas",
      notesTitle: "Notas Inteligentes",
      notesDesc: "Capture ideias rapidamente com organização automática",
      achievementsTitle: "Sistema de Conquistas",
      achievementsDesc: "Mantenha-se motivado com emblemas e estatísticas de progresso",
      multiplatformTitle: "Multiplataforma",
      multiplatformDesc: "Acesse de qualquer dispositivo com sincronização em tempo real",
      pricingTitle: "Planos para cada necessidade",
      pricingSubtitle: "Escolha o plano perfeito para você",
      freeName: "Grátis",
      freePrice: "0",
      freeDesc: "Perfeito para começar",
      freeCta: "Começar Grátis",
      premiumName: "Premium",
      premiumPrice: "9.99",
      premiumDesc: "Para usuários avançados",
      premiumCta: "Começar Premium",
      proName: "Pro",
      proPrice: "19.99",
      proDesc: "Para equipes e empresas",
      proCta: "Começar Pro",
      ctaTitle: "Pronto para aumentar sua produtividade?",
      ctaSubtitle: "Junte-se a milhares de usuários que já estão otimizando seu tempo com FutureTask",
      ctaButton: "Começar Agora - É Grátis",
      footerProduct: "Produto",
      footerFeatures: "Funcionalidades",
      footerPricing: "Preços",
      footerBlog: "Blog",
      footerCompany: "Empresa",
      footerAbout: "Sobre",
      footerContact: "Contato",
      footerLegal: "Legal",
      footerPrivacy: "Privacidade",
      footerTerms: "Termos",
      footerCookies: "Cookies",
      footerSupport: "Suporte",
      footerDocs: "Documentação",
      footerHelp: "Centro de Ajuda",
      footerCopyright: "© 2025 FutureTask. Todos os direitos reservados.",
      footerDescription: "A plataforma definitiva para gerenciar sua produtividade com IA",
      freeFeatures: ["50 tarefas por mês", "10 notas", "Calendário básico", "Timer Pomodoro", "Suporte por email"],
      premiumFeatures: [
        "Tarefas ilimitadas",
        "Notas ilimitadas",
        "Assistente IA avançado",
        "100 créditos IA/mês",
        "Calendário inteligente",
        "Sistema de conquistas",
        "Suporte prioritário",
      ],
      proFeatures: [
        "Tudo do Premium",
        "500 créditos IA/mês",
        "Colaboração em equipe",
        "Integrações avançadas",
        "Acesso API",
        "Suporte 24/7",
        "Relatórios personalizados",
      ],
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                FutureTask
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                {t.features}
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                {t.pricing}
              </a>
              <Link href="/blog" className="text-slate-300 hover:text-white transition-colors">
                {t.blog}
              </Link>
              <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                {t.contact}
              </Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <Globe className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{language.toUpperCase()}</span>
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>

                {languageMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-slate-800 rounded-lg border border-purple-500/20 shadow-xl z-50">
                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang)
                          setLanguageMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          language === lang ? "bg-slate-700 text-purple-400" : "text-white"
                        }`}
                      >
                        {languageNames[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/login">
                <Button variant="ghost" className="text-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  {t.login}
                </Button>
              </Link>

              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                  {t.register}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-purple-500/20">
              <a
                href="#features"
                className="block text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.features}
              </a>
              <a
                href="#pricing"
                className="block text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.pricing}
              </a>
              <Link
                href="/blog"
                className="block text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.blog}
              </Link>
              <Link
                href="/contact"
                className="block text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.contact}
              </Link>
              <div className="pt-4 border-t border-purple-500/20 space-y-2">
                <div className="space-y-2">
                  {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang)
                        setMobileMenuOpen(false)
                      }}
                      className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-colors ${
                        language === lang ? "bg-slate-700 text-purple-400" : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>{languageNames[lang]}</span>
                    </button>
                  ))}
                </div>
                <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-white justify-start">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t.login}
                  </Button>
                </Link>
                <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">{t.register}</Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Potenciado por IA
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            {t.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-3xl mx-auto">{t.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-6"
              >
                {t.heroCta}
              </Button>
            </Link>
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/50 text-white hover:bg-purple-500/10 text-lg px-8 py-6 bg-transparent"
              >
                {t.heroCtaSecondary}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">{t.featuresTitle}</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">{t.featuresSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20 hover:border-purple-500/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{t.aiAssistantTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{t.aiAssistantDesc}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20 hover:border-purple-500/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{t.smartCalendarTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{t.smartCalendarDesc}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20 hover:border-purple-500/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{t.pomodoroTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{t.pomodoroDesc}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20 hover:border-purple-500/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{t.notesTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{t.notesDesc}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20 hover:border-purple-500/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{t.achievementsTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{t.achievementsDesc}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20 hover:border-purple-500/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{t.multiplatformTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{t.multiplatformDesc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">{t.pricingTitle}</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">{t.pricingSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">{t.freeName}</CardTitle>
                <CardDescription className="text-slate-400">{t.freeDesc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">${t.freePrice}</span>
                  <span className="text-slate-400">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {t.freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button className="w-full bg-slate-700 hover:bg-slate-600">{t.freeCta}</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/50 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600">Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-white">{t.premiumName}</CardTitle>
                <CardDescription className="text-slate-400">{t.premiumDesc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">${t.premiumPrice}</span>
                  <span className="text-slate-400">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {t.premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                    {t.premiumCta}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">{t.proName}</CardTitle>
                <CardDescription className="text-slate-400">{t.proDesc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">${t.proPrice}</span>
                  <span className="text-slate-400">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {t.proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button className="w-full bg-slate-700 hover:bg-slate-600">{t.proCta}</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="bg-slate-800/50 backdrop-blur border-purple-500/20 text-center">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl font-bold text-white mb-4">{t.ctaTitle}</CardTitle>
              <CardDescription className="text-lg text-slate-300 max-w-2xl mx-auto">{t.ctaSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-6"
                >
                  {t.ctaButton}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  FutureTask
                </span>
              </Link>
              <p className="text-slate-400 text-sm mb-4">{t.footerDescription}</p>
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{languageNames[language]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {languageMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-40 bg-slate-800 rounded-lg border border-purple-500/20 shadow-xl z-50">
                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang)
                          setLanguageMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          language === lang ? "bg-slate-700 text-purple-400" : "text-white"
                        }`}
                      >
                        {languageNames[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-white mb-4">{t.footerProduct}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerFeatures}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerPricing}
                  </a>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerBlog}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-4">{t.footerCompany}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerAbout}
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerContact}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-white mb-4">{t.footerLegal}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerPrivacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerTerms}
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerCookies}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-4">{t.footerSupport}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#docs" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerDocs}
                  </a>
                </li>
                <li>
                  <a href="#help" className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t.footerHelp}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-purple-500/20 text-center">
            <p className="text-slate-400 text-sm">{t.footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
