"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState, useEffect } from "react"

const translations = {
  en: {
    features: "Features",
    dashboard: "Dashboard",
    pricing: "Pricing",
    about: "About",
    login: "Login",
    signup: "Sign Up",
    hero: "Smart Systems, Collaborate Seamlessly, Succeed Efficiently",
    heroDesc: "Empower your productivity with intelligent task management, AI assistance, and seamless collaboration",
    startNow: "Start now",
    learnMore: "Learn more",
    secure: "Secure & Reliable",
    secureDesc: "Enterprise-grade security for your data",
    growth: "Growth Analytics",
    growthDesc: "Real-time insights and metrics",
    team: "Team Collaboration",
    teamDesc: "Work together seamlessly",
    global: "Global Scale",
    globalDesc: "Deploy anywhere in the world",
    ai: "AI-Powered",
    aiDesc: "Intelligent automation built-in",
    fast: "Lightning Fast",
    fastDesc: "Optimized for performance",
    powerfulDashboard: "Powerful Dashboard",
    dashboardDesc:
      "Monitor your metrics, track performance, and make data-driven decisions with our intuitive interface.",
    tasksCompleted: "Tasks Completed",
    productivity: "Productivity",
    timeSaved: "Time Saved",
    pricingTitle: "Choose Your Plan",
    pricingDesc: "Select the perfect plan for your needs",
    monthly: "Monthly",
    annually: "Annually",
    saveAnnually: "Save 20% with annual billing",
    free: "Free",
    freeDesc: "Perfect for getting started",
    aiCredits: "50 AI credits/month",
    basicTasks: "Basic task management",
    basicNotes: "Notes & wishlist",
    basicPomodoro: "Pomodoro timer",
    pro: "Pro",
    proDesc: "For power users",
    proAiCredits: "500 AI credits/month",
    advancedTasks: "Advanced task analytics",
    proNotes: "Unlimited notes",
    proPomodoro: "Custom pomodoro settings",
    premium: "Premium",
    premiumDesc: "For teams and professionals",
    teamFeatures: "Team collaboration",
    prioritySupport: "Priority support",
    customIntegrations: "Custom integrations",
    chooseFreePlan: "Current Plan",
    chooseProPlan: "Upgrade to Pro",
    choosePremiumPlan: "Upgrade to Premium",
    month: "/month",
    year: "/year",
    blogTitle: "Blog & Resources",
    blogDesc: "Discover tips, strategies, and insights to boost your productivity",
    blogPost1Title: "Master the Pomodoro Technique",
    blogPost1Desc: "Learn how to break your work into focused intervals to maximize productivity and avoid burnout. Discover the science behind this time management method.",
    blogPost1ReadTime: "5 min read",
    blogPost2Title: "Effective Study Methods for Students",
    blogPost2Desc: "Discover proven study techniques including spaced repetition, active recall, and mind mapping to improve retention and ace your exams.",
    blogPost2ReadTime: "7 min read",
    blogPost3Title: "Boost Productivity with AI Assistants",
    blogPost3Desc: "Explore how AI tools can help you automate tasks, generate ideas, and streamline your workflow to achieve more in less time.",
    blogPost3ReadTime: "6 min read",
  },
  es: {
    features: "Características",
    dashboard: "Panel",
    pricing: "Precios",
    about: "Acerca de",
    login: "Iniciar sesión",
    signup: "Registrarse",
    hero: "Sistemas Inteligentes, Colabora Sin Problemas, Triunfa Eficientemente",
    heroDesc: "Potencia tu productividad con gestión inteligente de tareas, asistencia IA y colaboración perfecta",
    startNow: "Comenzar ahora",
    learnMore: "Saber más",
    secure: "Seguro y Confiable",
    secureDesc: "Seguridad de nivel empresarial para tus datos",
    growth: "Analíticas de Crecimiento",
    growthDesc: "Información y métricas en tiempo real",
    team: "Colaboración en Equipo",
    teamDesc: "Trabaja junto sin problemas",
    global: "Escala Global",
    globalDesc: "Despliega en cualquier parte del mundo",
    ai: "Impulsado por IA",
    aiDesc: "Automatización inteligente incorporada",
    fast: "Rapidísimo",
    fastDesc: "Optimizado para rendimiento",
    powerfulDashboard: "Panel Potente",
    dashboardDesc:
      "Monitorea tus métricas, rastrea el rendimiento y toma decisiones basadas en datos con nuestra interfaz intuitiva.",
    tasksCompleted: "Tareas Completadas",
    productivity: "Productividad",
    timeSaved: "Tiempo Ahorrado",
    pricingTitle: "Elige Tu Plan",
    pricingDesc: "Selecciona el plan perfecto para tus necesidades",
    monthly: "Mensual",
    annually: "Anual",
    saveAnnually: "Ahorra 20% con facturación anual",
    free: "Gratis",
    freeDesc: "Perfecto para empezar",
    aiCredits: "50 créditos IA/mes",
    basicTasks: "Gestión básica de tareas",
    basicNotes: "Notas y lista de deseos",
    basicPomodoro: "Temporizador Pomodoro",
    pro: "Pro",
    proDesc: "Para usuarios avanzados",
    proAiCredits: "500 créditos IA/mes",
    advancedTasks: "Analíticas avanzadas de tareas",
    proNotes: "Notas ilimitadas",
    proPomodoro: "Ajustes personalizados de pomodoro",
    premium: "Premium",
    premiumDesc: "Para equipos y profesionales",
    teamFeatures: "Colaboración en equipo",
    prioritySupport: "Soporte prioritario",
    customIntegrations: "Integraciones personalizadas",
    chooseFreePlan: "Plan Actual",
    chooseProPlan: "Actualizar a Pro",
    choosePremiumPlan: "Actualizar a Premium",
    month: "/mes",
    year: "/año",
    blogTitle: "Blog y Recursos",
    blogDesc: "Descubre consejos, estrategias e ideas para impulsar tu productividad",
    blogPost1Title: "Domina la Técnica Pomodoro",
    blogPost1Desc: "Aprende a dividir tu trabajo en intervalos enfocados para maximizar la productividad y evitar el agotamiento. Descubre la ciencia detrás de este método de gestión del tiempo.",
    blogPost1ReadTime: "5 min read",
    blogPost2Title: "Métodos de Estudio Efectivos para Estudiantes",
    blogPost2Desc: "Descubre técnicas de estudio probadas como la repetición espaciada, el recuerdo activo y los mapas mentales para mejorar la retención y destacar en tus exámenes.",
    blogPost2ReadTime: "7 min read",
    blogPost3Title: "Impulsa la Productividad con Asistentes IA",
    blogPost3Desc: "Explora cómo las herramientas de IA pueden ayudarte a automatizar tareas, generar ideas y optimizar tu flujo de trabajo para lograr más en menos tiempo.",
    blogPost3ReadTime: "6 min read",
  },
  fr: {
    features: "Fonctionnalités",
    dashboard: "Tableau de bord",
    pricing: "Tarifs",
    about: "À propos",
    login: "Connexion",
    signup: "S'inscrire",
    hero: "Systèmes Intelligents, Collaborez Sans Effort, Réussissez Efficacement",
    heroDesc:
      "Boostez votre productivité avec une gestion intelligente des tâches, une assistance IA et une collaboration fluide",
    startNow: "Commencer maintenant",
    learnMore: "En savoir plus",
    secure: "Sécurisé et Fiable",
    secureDesc: "Sécurité de niveau entreprise pour vos données",
    growth: "Analyses de Croissance",
    growthDesc: "Informations et métriques en temps réel",
    team: "Collaboration d'Équipe",
    teamDesc: "Travaillez ensemble sans effort",
    global: "Échelle Mondiale",
    globalDesc: "Déployez n'importe où dans le monde",
    ai: "Propulsé par l'IA",
    aiDesc: "Automatisation intelligente intégrée",
    fast: "Ultra Rapide",
    fastDesc: "Optimisé pour les performances",
    powerfulDashboard: "Tableau de Bord Puissant",
    dashboardDesc:
      "Surveillez vos métriques, suivez les performances et prenez des décisions basées sur les données avec notre interface intuitive.",
    tasksCompleted: "Tâches Terminées",
    productivity: "Productivité",
    timeSaved: "Temps Économisé",
    pricingTitle: "Choisissez Votre Plan",
    pricingDesc: "Sélectionnez le plan parfait pour vos besoins",
    monthly: "Mensuel",
    annually: "Annuel",
    saveAnnually: "Économisez 20% avec la facturation annuelle",
    free: "Gratuit",
    freeDesc: "Parfait pour commencer",
    aiCredits: "50 crédits IA/mois",
    basicTasks: "Gestion de tâches basique",
    basicNotes: "Notes et liste de souhaits",
    basicPomodoro: "Minuteur Pomodoro",
    pro: "Pro",
    proDesc: "Pour les utilisateurs avancés",
    proAiCredits: "500 crédits IA/mois",
    advancedTasks: "Analyses avancées des tâches",
    proNotes: "Notes illimitées",
    proPomodoro: "Paramètres Pomodoro personnalisés",
    premium: "Premium",
    premiumDesc: "Pour les équipes et professionnels",
    teamFeatures: "Collaboration d'équipe",
    prioritySupport: "Support prioritaire",
    customIntegrations: "Intégrations personnalisées",
    chooseFreePlan: "Plan Actuel",
    chooseProPlan: "Passer à Pro",
    choosePremiumPlan: "Passer à Premium",
    month: "/mois",
    year: "/an",
    blogTitle: "Blog et Ressources",
    blogDesc: "Découvrez des conseils, stratégies et idées pour booster votre productivité",
    blogPost1Title: "Maîtrisez la Technique Pomodoro",
    blogPost1Desc: "Apprenez à diviser votre travail en intervalles concentrés pour maximiser la productivité et éviter l'épuisement. Découvrez la science derrière cette méthode de gestion du temps.",
    blogPost1ReadTime: "5 min read",
    blogPost2Title: "Méthodes d'Étude Efficaces pour les Étudiants",
    blogPost2Desc: "Découvrez des techniques d'étude éprouvées, notamment la répétition espacée, le rappel actif et les cartes mentales pour améliorer la rétention et réussir vos examens.",
    blogPost2ReadTime: "7 min read",
    blogPost3Title: "Boostez la Productivité avec les Assistants IA",
    blogPost3Desc: "Explorez comment les outils d'IA peuvent vous aider à automatiser les tâches, générer des idées et rationaliser votre flux de travail pour accomplir plus en moins de temps.",
    blogPost3ReadTime: "6 min read",
  },
  de: {
    features: "Funktionen",
    dashboard: "Dashboard",
    pricing: "Preise",
    about: "Über uns",
    login: "Anmelden",
    signup: "Registrieren",
    hero: "Intelligente Systeme, Nahtlos Zusammenarbeiten, Effizient Erfolgreich Sein",
    heroDesc:
      "Steigern Sie Ihre Produktivität mit intelligentem Aufgabenmanagement, KI-Unterstützung und nahtloser Zusammenarbeit",
    startNow: "Jetzt starten",
    learnMore: "Mehr erfahren",
    secure: "Sicher & Zuverlässig",
    secureDesc: "Unternehmenssicherheit für Ihre Daten",
    growth: "Wachstumsanalysen",
    growthDesc: "Echtzeit-Einblicke und Metriken",
    team: "Team-Zusammenarbeit",
    teamDesc: "Arbeiten Sie nahtlos zusammen",
    global: "Globale Reichweite",
    globalDesc: "Überall auf der Welt bereitstellen",
    ai: "KI-Gestützt",
    aiDesc: "Intelligente Automatisierung integriert",
    fast: "Blitzschnell",
    fastDesc: "Für Leistung optimiert",
    powerfulDashboard: "Leistungsstarkes Dashboard",
    dashboardDesc:
      "Überwachen Sie Ihre Metriken, verfolgen Sie die Leistung und treffen Sie datengestützte Entscheidungen mit unserer intuitiven Oberfläche.",
    tasksCompleted: "Erledigte Aufgaben",
    productivity: "Produktivität",
    timeSaved: "Zeit Gespart",
    pricingTitle: "Wählen Sie Ihren Plan",
    pricingDesc: "Wählen Sie den perfekten Plan für Ihre Bedürfnisse",
    monthly: "Monatlich",
    annually: "Jährlich",
    saveAnnually: "Sparen Sie 20% mit jährlicher Abrechnung",
    free: "Kostenlos",
    freeDesc: "Perfekt für den Einstieg",
    aiCredits: "50 KI-Credits/Monat",
    basicTasks: "Basis-Aufgabenverwaltung",
    basicNotes: "Notizen & Wunschliste",
    basicPomodoro: "Pomodoro-Timer",
    pro: "Pro",
    proDesc: "Für Power-User",
    proAiCredits: "500 KI-Credits/Monat",
    advancedTasks: "Erweiterte Aufgabenanalysen",
    proNotes: "Unbegrenzte Notizen",
    proPomodoro: "Benutzerdefinierte Pomodoro-Einstellungen",
    premium: "Premium",
    premiumDesc: "Für Teams und Profis",
    teamFeatures: "Team-Zusammenarbeit",
    prioritySupport: "Prioritäts-Support",
    customIntegrations: "Benutzerdefinierte Integrationen",
    chooseFreePlan: "Aktueller Plan",
    chooseProPlan: "Auf Pro upgraden",
    choosePremiumPlan: "Auf Premium upgraden",
    month: "/Monat",
    year: "/Jahr",
    blogTitle: "Blog & Ressourcen",
    blogDesc: "Entdecken Sie Tipps, Strategien und Erkenntnisse zur Steigerung Ihrer Produktivität",
    blogPost1Title: "Meistern Sie die Pomodoro-Technik",
    blogPost1Desc: "Lernen Sie, Ihre Arbeit in fokussierte Intervalle aufzuteilen, um die Produktivität zu maximieren und Burnout zu vermeiden. Entdecken Sie die Wissenschaft hinter dieser Zeitmanagement-Methode.",
    blogPost1ReadTime: "5 min read",
    blogPost2Title: "Effektive Lernmethoden für Studenten",
    blogPost2Desc: "Entdecken Sie bewährte Lerntechniken wie verteiltes Lernen, aktives Abrufen und Mind Mapping, um die Merkfähigkeit zu verbessern und Ihre Prüfungen zu bestehen.",
    blogPost2ReadTime: "7 min read",
    blogPost3Title: "Steigern Sie die Produktivität mit KI-Assistenten",
    blogPost3Desc: "Erkunden Sie, wie KI-Tools Ihnen helfen können, Aufgaben zu automatisieren, Ideen zu generieren und Ihren Arbeitsablauf zu optimieren, um in kürzerer Zeit mehr zu erreichen.",
    blogPost3ReadTime: "6 min read",
  },
  it: {
    features: "Funzionalità",
    dashboard: "Dashboard",
    pricing: "Prezzi",
    about: "Chi siamo",
    login: "Accedi",
    signup: "Registrati",
    hero: "Sistemi Intelligenti, Collabora Senza Sforzo, Raggiungi il Successo Efficacemente",
    heroDesc:
      "Potenzia la tua produttività con gestione intelligente delle attività, assistenza IA e collaborazione fluida",
    startNow: "Inizia ora",
    learnMore: "Scopri di più",
    secure: "Sicuro e Affidabile",
    secureDesc: "Sicurezza di livello aziendale per i tuoi dati",
    growth: "Analisi di Crescita",
    growthDesc: "Informazioni e metriche in tempo reale",
    team: "Collaborazione di Team",
    teamDesc: "Lavora insieme senza sforzo",
    global: "Scala Globale",
    globalDesc: "Distribuisci ovunque nel mondo",
    ai: "Alimentato da IA",
    aiDesc: "Automazione intelligente integrata",
    fast: "Velocissimo",
    fastDesc: "Ottimizzato per le prestazioni",
    powerfulDashboard: "Dashboard Potente",
    dashboardDesc:
      "Monitora le tue metriche, traccia le prestazioni e prendi decisioni basate sui dati con la nostra interfaccia intuitiva.",
    tasksCompleted: "Attività Completate",
    productivity: "Produttività",
    timeSaved: "Tempo Risparmiato",
    pricingTitle: "Scegli il Tuo Piano",
    pricingDesc: "Seleziona il piano perfetto per le tue esigenze",
    monthly: "Mensile",
    annually: "Annuale",
    saveAnnually: "Risparmia il 20% con fatturazione annuale",
    free: "Gratuito",
    freeDesc: "Perfetto per iniziare",
    aiCredits: "50 crediti IA/mese",
    basicTasks: "Gestione attività base",
    basicNotes: "Note e lista desideri",
    basicPomodoro: "Timer Pomodoro",
    pro: "Pro",
    proDesc: "Per utenti esperti",
    proAiCredits: "500 crediti IA/mese",
    advancedTasks: "Analisi attività avanzate",
    proNotes: "Note illimitate",
    proPomodoro: "Impostazioni Pomodoro personalizzate",
    premium: "Premium",
    premiumDesc: "Per team e professionisti",
    teamFeatures: "Collaborazione di team",
    prioritySupport: "Supporto prioritario",
    customIntegrations: "Integrazioni personalizzate",
    chooseFreePlan: "Piano Attuale",
    chooseProPlan: "Passa a Pro",
    choosePremiumPlan: "Passa a Premium",
    month: "/mese",
    year: "/anno",
    blogTitle: "Blog e Risorse",
    blogDesc: "Scopri consigli, strategie e intuizioni per aumentare la tua produttività",
    blogPost1Title: "Padroneggia la Tecnica Pomodoro",
    blogPost1Desc: "Impara a dividere il tuo lavoro in intervalli concentrati per massimizzare la produttività ed evitare il burnout. Scopri la scienza dietro questo metodo di gestione del tempo.",
    blogPost1ReadTime: "5 min read",
    blogPost2Title: "Metodi di Studio Efficaci per Studenti",
    blogPost2Desc: "Scopri tecniche di studio comprovate tra cui ripetizione spaziata, richiamo attivo e mappe mentali per migliorare la ritenzione e superare gli esami.",
    blogPost2ReadTime: "7 min read",
    blogPost3Title: "Aumenta la Produttività con Assistenti IA",
    blogPost3Desc: "Esplora come gli strumenti di IA possono aiutarti ad automatizzare le attività, generare idee e ottimizzare il tuo flusso di lavoro per ottenere di più in meno tempo.",
    blogPost3ReadTime: "6 min read",
  },
}

type Language = "en" | "es" | "fr" | "de" | "it"

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en")
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly")
  const t = translations[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null
    if (savedLang && translations[savedLang]) {
      setLang(savedLang)
    }
  }, [])

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem("language", newLang)
  }

  const prices = {
    free: { monthly: 0, annually: 0 },
    pro: { monthly: 6.49, annually: 64.9 },
    premium: { monthly: 2.49, annually: 24.99 },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">FT</span>
            </div>
            <span className="text-xl font-bold">Future Task</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-primary transition-colors">
              {t.features}
            </a>
            <a href="#dashboard" className="text-sm hover:text-primary transition-colors">
              {t.dashboard}
            </a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">
              {t.pricing}
            </a>
            <a href="#about" className="text-sm hover:text-primary transition-colors">
              {t.about}
            </a>
            <a href="#blog" className="text-sm hover:text-primary transition-colors">
              {t.blogTitle}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Select value={lang} onValueChange={(v) => handleLanguageChange(v as Language)}>
              <SelectTrigger className="w-[70px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
                <SelectItem value="de">DE</SelectItem>
                <SelectItem value="it">IT</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                {t.login}
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="neon-glow-hover">
                {t.signup}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm mb-4">
            <span className="text-primary">✨ Next Generation Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Smart Systems, <span className="text-primary neon-text">Collaborate</span>
            <br />
            Seamlessly, Succeed Efficiently
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.heroDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="neon-glow-hover group">
                {t.startNow}
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="neon-glow-hover bg-transparent">
                {t.learnMore}
              </Button>
            </Link>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🛡️", title: t.secure, desc: t.secureDesc },
            { icon: "📈", title: t.growth, desc: t.growthDesc },
            { icon: "👥", title: t.team, desc: t.teamDesc },
            { icon: "🌍", title: t.global, desc: t.globalDesc },
            { icon: "✨", title: t.ai, desc: t.aiDesc },
            { icon: "⚡", title: t.fast, desc: t.fastDesc },
          ].map((feature, i) => (
            <Card
              key={i}
              className="glass-card p-6 neon-glow-hover transition-all duration-300 cursor-pointer group h-full"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="container mx-auto px-4 py-20">
        <Card className="glass-card p-8 neon-glow">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">{t.powerfulDashboard}</h2>
              <p className="text-muted-foreground">{t.dashboardDesc}</p>
              <div className="space-y-3 pt-4">
                {[
                  { label: t.tasksCompleted, value: "156", change: "+12.5%" },
                  { label: t.productivity, value: "94%", change: "+8.3%" },
                  { label: t.timeSaved, value: "24h", change: "+15.2%" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{stat.value}</span>
                      <span className="text-xs text-primary">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 flex items-center justify-center">
              <div className="text-8xl opacity-30">📊</div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxODQsMjU1LDc4LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
            </div>
          </div>
        </Card>
      </section>

      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t.pricingTitle}</h2>
          <p className="text-muted-foreground mb-6">{t.pricingDesc}</p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-lg bg-secondary/50 border border-border/50">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setBillingPeriod("annually")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === "annually"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.annually}
            </button>
          </div>
          {billingPeriod === "annually" && <p className="text-sm text-primary mt-3 font-medium">{t.saveAnnually}</p>}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="glass-card p-6 neon-glow-hover transition-all duration-300">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{t.free}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.freeDesc}</p>
                <div className="text-4xl font-bold mb-1">€{prices.free[billingPeriod]}</div>
                <div className="text-sm text-muted-foreground">{billingPeriod === "monthly" ? t.month : t.year}</div>
              </div>
              <ul className="space-y-3 pt-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.aiCredits}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.basicTasks}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.basicNotes}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.basicPomodoro}</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  {t.chooseFreePlan}
                </Button>
              </Link>
            </div>
          </Card>

          {/* Premium Plan */}
          <Card className="glass-card p-6 neon-glow border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{t.premium}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.premiumDesc}</p>
                <div className="text-4xl font-bold mb-1">€{prices.premium[billingPeriod]}</div>
                <div className="text-sm text-muted-foreground">{billingPeriod === "monthly" ? t.month : t.year}</div>
              </div>
              <ul className="space-y-3 pt-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.teamFeatures}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.prioritySupport}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.customIntegrations}</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button className="w-full mt-6 neon-glow-hover">{t.choosePremiumPlan}</Button>
              </Link>
            </div>
          </Card>

          {/* Pro Plan */}
          <Card className="glass-card p-6 neon-glow-hover transition-all duration-300">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{t.pro}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.proDesc}</p>
                <div className="text-4xl font-bold mb-1">€{prices.pro[billingPeriod]}</div>
                <div className="text-sm text-muted-foreground">{billingPeriod === "monthly" ? t.month : t.year}</div>
              </div>
              <ul className="space-y-3 pt-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.proAiCredits}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.advancedTasks}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.proNotes}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{t.proPomodoro}</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  {t.chooseProPlan}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="container mx-auto px-4 py-20 bg-secondary/20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t.blogTitle}</h2>
          <p className="text-muted-foreground">{t.blogDesc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Blog Post 1 - Pomodoro Technique */}
          <Card className="glass-card overflow-hidden neon-glow-hover transition-all duration-300 cursor-pointer group">
            <div className="h-48 bg-gradient-to-br from-primary/30 to-primary/10 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40">🍅</div>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-xs text-primary font-semibold uppercase tracking-wide">
                {lang === 'en' && 'Productivity'}
                {lang === 'es' && 'Productividad'}
                {lang === 'fr' && 'Productivité'}
                {lang === 'de' && 'Produktivität'}
                {lang === 'it' && 'Produttività'}
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {t.blogPost1Title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {t.blogPost1Desc}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">{t.blogPost1ReadTime}</span>
                <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </Card>

          {/* Blog Post 2 - Study Techniques */}
          <Card className="glass-card overflow-hidden neon-glow-hover transition-all duration-300 cursor-pointer group">
            <div className="h-48 bg-gradient-to-br from-blue-500/30 to-blue-500/10 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40">📚</div>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-xs text-blue-400 font-semibold uppercase tracking-wide">
                {lang === 'en' && 'Study Tips'}
                {lang === 'es' && 'Consejos de Estudio'}
                {lang === 'fr' && 'Conseils d\'Étude'}
                {lang === 'de' && 'Lerntipps'}
                {lang === 'it' && 'Consigli di Studio'}
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {t.blogPost2Title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {t.blogPost2Desc}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">{t.blogPost2ReadTime}</span>
                <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </Card>

          {/* Blog Post 3 - AI Productivity */}
          <Card className="glass-card overflow-hidden neon-glow-hover transition-all duration-300 cursor-pointer group">
            <div className="h-48 bg-gradient-to-br from-purple-500/30 to-purple-500/10 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40">🤖</div>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-xs text-purple-400 font-semibold uppercase tracking-wide">
                {lang === 'en' && 'AI & Automation'}
                {lang === 'es' && 'IA y Automatización'}
                {lang === 'fr' && 'IA et Automatisation'}
                {lang === 'de' && 'KI & Automatisierung'}
                {lang === 'it' && 'IA e Automazione'}
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {t.blogPost3Title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {t.blogPost3Desc}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">{t.blogPost3ReadTime}</span>
                <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">FT</span>
              </div>
              <span className="font-semibold">Future Task</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Future Task. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
