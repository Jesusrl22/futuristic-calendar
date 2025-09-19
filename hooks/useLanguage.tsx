"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Language types
export type Language = "es" | "en" | "fr" | "de" | "it" | "pt"

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  mounted: boolean
}

// Translations object
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navigation and general
    home: "Inicio",
    features: "Características",
    pricing: "Precios",
    blog: "Blog",
    contact: "Contacto",
    login: "Iniciar Sesión",
    signup: "Registrarse",
    getStarted: "Comenzar",
    learnMore: "Saber Más",
    back: "Volver",
    loading: "Cargando...",
    loadingApp: "Cargando aplicación...",

    // Hero section
    heroTitle: "Organiza tu vida con IA",
    heroSubtitle: "La aplicación de productividad más avanzada con inteligencia artificial integrada",
    heroDescription:
      "Gestiona tareas, calendario, notas y más con la ayuda de nuestro asistente IA. Aumenta tu productividad hasta un 300%.",

    // Features
    aiAssistant: "Asistente IA",
    aiAssistantDesc: "Tu compañero inteligente para maximizar la productividad",
    smartCalendar: "Calendario Inteligente",
    smartCalendarDesc: "Planificación automática y sugerencias personalizadas",
    taskManagement: "Gestión de Tareas",
    taskManagementDesc: "Organiza y prioriza con algoritmos avanzados",

    // Pricing
    free: "Gratuito",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensual",
    yearly: "Anual",
    mostPopular: "Más Popular",
    bestValue: "Mejor Valor",

    // Authentication
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    signInToAccount: "Inicia sesión en tu cuenta",
    createFreeAccount: "Crea tu cuenta gratuita",
    name: "Nombre",
    email: "Email",
    password: "Contraseña",
    invalidCredentials: "Credenciales inválidas",
    loginError: "Error al iniciar sesión",
    createAccountError: "Error al crear cuenta",
    registrationError: "Error en el registro",
    noAccountQuestion: "¿No tienes cuenta? Regístrate",
    hasAccountQuestion: "¿Ya tienes cuenta? Inicia sesión",
    demoUsersLabel: "Usuarios de demostración:",

    // App interface
    tasks: "Tareas",
    calendar: "Calendario",
    notes: "Notas",
    wishlist: "Lista de Deseos",
    ai: "IA",
    plan: "Plan",
    settings: "Configuración",
    achievements: "Logros",

    // Dashboard
    dashboard: "Panel",
    yourCurrentPlan: "Tu Plan Actual",
    manageSubscription: "Gestiona tu suscripción",
    basicFeatures: "Características básicas",
    advancedFeatures: "Características avanzadas",
    allFeatures: "Todas las características",
    active: "Activo",
    inactive: "Inactivo",
    upgradeToPremium: "Actualizar a Premium",
    upgradeToPro: "Actualizar a Pro",
    buyAICredits: "Comprar Créditos IA",

    // Blog
    readMore: "Leer más",
    relatedPosts: "Artículos relacionados",
    shareArticle: "Compartir artículo",
    backToBlog: "Volver al blog",

    // Footer
    aboutUs: "Sobre Nosotros",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    support: "Soporte",
    followUs: "Síguenos",
    allRightsReserved: "Todos los derechos reservados",

    // Cookie banner
    cookieMessage:
      "Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestro uso de cookies.",
    acceptCookies: "Aceptar Cookies",
    cookieSettings: "Configurar Cookies",
  },
  en: {
    // Navigation and general
    home: "Home",
    features: "Features",
    pricing: "Pricing",
    blog: "Blog",
    contact: "Contact",
    login: "Login",
    signup: "Sign Up",
    getStarted: "Get Started",
    learnMore: "Learn More",
    back: "Back",
    loading: "Loading...",
    loadingApp: "Loading app...",

    // Hero section
    heroTitle: "Organize your life with AI",
    heroSubtitle: "The most advanced productivity app with integrated artificial intelligence",
    heroDescription:
      "Manage tasks, calendar, notes and more with the help of our AI assistant. Increase your productivity by up to 300%.",

    // Features
    aiAssistant: "AI Assistant",
    aiAssistantDesc: "Your intelligent companion to maximize productivity",
    smartCalendar: "Smart Calendar",
    smartCalendarDesc: "Automatic planning and personalized suggestions",
    taskManagement: "Task Management",
    taskManagementDesc: "Organize and prioritize with advanced algorithms",

    // Pricing
    free: "Free",
    premium: "Premium",
    pro: "Pro",
    monthly: "Monthly",
    yearly: "Yearly",
    mostPopular: "Most Popular",
    bestValue: "Best Value",

    // Authentication
    signIn: "Sign In",
    signUp: "Sign Up",
    signInToAccount: "Sign in to your account",
    createFreeAccount: "Create your free account",
    name: "Name",
    email: "Email",
    password: "Password",
    invalidCredentials: "Invalid credentials",
    loginError: "Login error",
    createAccountError: "Error creating account",
    registrationError: "Registration error",
    noAccountQuestion: "Don't have an account? Sign up",
    hasAccountQuestion: "Already have an account? Sign in",
    demoUsersLabel: "Demo users:",

    // App interface
    tasks: "Tasks",
    calendar: "Calendar",
    notes: "Notes",
    wishlist: "Wishlist",
    ai: "AI",
    plan: "Plan",
    settings: "Settings",
    achievements: "Achievements",

    // Dashboard
    dashboard: "Dashboard",
    yourCurrentPlan: "Your Current Plan",
    manageSubscription: "Manage your subscription",
    basicFeatures: "Basic features",
    advancedFeatures: "Advanced features",
    allFeatures: "All features",
    active: "Active",
    inactive: "Inactive",
    upgradeToPremium: "Upgrade to Premium",
    upgradeToPro: "Upgrade to Pro",
    buyAICredits: "Buy AI Credits",

    // Blog
    readMore: "Read more",
    relatedPosts: "Related articles",
    shareArticle: "Share article",
    backToBlog: "Back to blog",

    // Footer
    aboutUs: "About Us",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    support: "Support",
    followUs: "Follow Us",
    allRightsReserved: "All rights reserved",

    // Cookie banner
    cookieMessage: "We use cookies to improve your experience. By continuing to browse, you accept our use of cookies.",
    acceptCookies: "Accept Cookies",
    cookieSettings: "Cookie Settings",
  },
  fr: {
    // Navigation and general
    home: "Accueil",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    blog: "Blog",
    contact: "Contact",
    login: "Connexion",
    signup: "S'inscrire",
    getStarted: "Commencer",
    learnMore: "En savoir plus",
    back: "Retour",
    loading: "Chargement...",
    loadingApp: "Chargement de l'application...",

    // Hero section
    heroTitle: "Organisez votre vie avec l'IA",
    heroSubtitle: "L'application de productivité la plus avancée avec intelligence artificielle intégrée",
    heroDescription:
      "Gérez les tâches, le calendrier, les notes et plus encore avec l'aide de notre assistant IA. Augmentez votre productivité jusqu'à 300%.",

    // Features
    aiAssistant: "Assistant IA",
    aiAssistantDesc: "Votre compagnon intelligent pour maximiser la productivité",
    smartCalendar: "Calendrier Intelligent",
    smartCalendarDesc: "Planification automatique et suggestions personnalisées",
    taskManagement: "Gestion des Tâches",
    taskManagementDesc: "Organisez et priorisez avec des algorithmes avancés",

    // Pricing
    free: "Gratuit",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensuel",
    yearly: "Annuel",
    mostPopular: "Le Plus Populaire",
    bestValue: "Meilleure Valeur",

    // Authentication
    signIn: "Se Connecter",
    signUp: "S'inscrire",
    signInToAccount: "Connectez-vous à votre compte",
    createFreeAccount: "Créez votre compte gratuit",
    name: "Nom",
    email: "Email",
    password: "Mot de passe",
    invalidCredentials: "Identifiants invalides",
    loginError: "Erreur de connexion",
    createAccountError: "Erreur lors de la création du compte",
    registrationError: "Erreur d'inscription",
    noAccountQuestion: "Pas de compte ? Inscrivez-vous",
    hasAccountQuestion: "Déjà un compte ? Connectez-vous",
    demoUsersLabel: "Utilisateurs de démonstration :",

    // App interface
    tasks: "Tâches",
    calendar: "Calendrier",
    notes: "Notes",
    wishlist: "Liste de Souhaits",
    ai: "IA",
    plan: "Plan",
    settings: "Paramètres",
    achievements: "Réalisations",

    // Dashboard
    dashboard: "Tableau de Bord",
    yourCurrentPlan: "Votre Plan Actuel",
    manageSubscription: "Gérez votre abonnement",
    basicFeatures: "Fonctionnalités de base",
    advancedFeatures: "Fonctionnalités avancées",
    allFeatures: "Toutes les fonctionnalités",
    active: "Actif",
    inactive: "Inactif",
    upgradeToPremium: "Passer à Premium",
    upgradeToPro: "Passer à Pro",
    buyAICredits: "Acheter des Crédits IA",

    // Blog
    readMore: "Lire la suite",
    relatedPosts: "Articles connexes",
    shareArticle: "Partager l'article",
    backToBlog: "Retour au blog",

    // Footer
    aboutUs: "À Propos",
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'Utilisation",
    support: "Support",
    followUs: "Suivez-nous",
    allRightsReserved: "Tous droits réservés",

    // Cookie banner
    cookieMessage:
      "Nous utilisons des cookies pour améliorer votre expérience. En continuant à naviguer, vous acceptez notre utilisation des cookies.",
    acceptCookies: "Accepter les Cookies",
    cookieSettings: "Paramètres des Cookies",
  },
  de: {
    // Navigation and general
    home: "Startseite",
    features: "Funktionen",
    pricing: "Preise",
    blog: "Blog",
    contact: "Kontakt",
    login: "Anmelden",
    signup: "Registrieren",
    getStarted: "Loslegen",
    learnMore: "Mehr erfahren",
    back: "Zurück",
    loading: "Laden...",
    loadingApp: "App wird geladen...",

    // Hero section
    heroTitle: "Organisieren Sie Ihr Leben mit KI",
    heroSubtitle: "Die fortschrittlichste Produktivitäts-App mit integrierter künstlicher Intelligenz",
    heroDescription:
      "Verwalten Sie Aufgaben, Kalender, Notizen und mehr mit Hilfe unseres KI-Assistenten. Steigern Sie Ihre Produktivität um bis zu 300%.",

    // Features
    aiAssistant: "KI-Assistent",
    aiAssistantDesc: "Ihr intelligenter Begleiter zur Maximierung der Produktivität",
    smartCalendar: "Intelligenter Kalender",
    smartCalendarDesc: "Automatische Planung und personalisierte Vorschläge",
    taskManagement: "Aufgabenverwaltung",
    taskManagementDesc: "Organisieren und priorisieren Sie mit fortschrittlichen Algorithmen",

    // Pricing
    free: "Kostenlos",
    premium: "Premium",
    pro: "Pro",
    monthly: "Monatlich",
    yearly: "Jährlich",
    mostPopular: "Am Beliebtesten",
    bestValue: "Bester Wert",

    // Authentication
    signIn: "Anmelden",
    signUp: "Registrieren",
    signInToAccount: "Melden Sie sich in Ihrem Konto an",
    createFreeAccount: "Erstellen Sie Ihr kostenloses Konto",
    name: "Name",
    email: "E-Mail",
    password: "Passwort",
    invalidCredentials: "Ungültige Anmeldedaten",
    loginError: "Anmeldefehler",
    createAccountError: "Fehler beim Erstellen des Kontos",
    registrationError: "Registrierungsfehler",
    noAccountQuestion: "Kein Konto? Registrieren Sie sich",
    hasAccountQuestion: "Bereits ein Konto? Anmelden",
    demoUsersLabel: "Demo-Benutzer:",

    // App interface
    tasks: "Aufgaben",
    calendar: "Kalender",
    notes: "Notizen",
    wishlist: "Wunschliste",
    ai: "KI",
    plan: "Plan",
    settings: "Einstellungen",
    achievements: "Erfolge",

    // Dashboard
    dashboard: "Dashboard",
    yourCurrentPlan: "Ihr Aktueller Plan",
    manageSubscription: "Verwalten Sie Ihr Abonnement",
    basicFeatures: "Grundfunktionen",
    advancedFeatures: "Erweiterte Funktionen",
    allFeatures: "Alle Funktionen",
    active: "Aktiv",
    inactive: "Inaktiv",
    upgradeToPremium: "Auf Premium upgraden",
    upgradeToPro: "Auf Pro upgraden",
    buyAICredits: "KI-Credits kaufen",

    // Blog
    readMore: "Weiterlesen",
    relatedPosts: "Verwandte Artikel",
    shareArticle: "Artikel teilen",
    backToBlog: "Zurück zum Blog",

    // Footer
    aboutUs: "Über Uns",
    privacyPolicy: "Datenschutzrichtlinie",
    termsOfService: "Nutzungsbedingungen",
    support: "Support",
    followUs: "Folgen Sie uns",
    allRightsReserved: "Alle Rechte vorbehalten",

    // Cookie banner
    cookieMessage:
      "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Durch die weitere Nutzung akzeptieren Sie unsere Verwendung von Cookies.",
    acceptCookies: "Cookies Akzeptieren",
    cookieSettings: "Cookie-Einstellungen",
  },
  it: {
    // Navigation and general
    home: "Home",
    features: "Caratteristiche",
    pricing: "Prezzi",
    blog: "Blog",
    contact: "Contatto",
    login: "Accedi",
    signup: "Registrati",
    getStarted: "Inizia",
    learnMore: "Scopri di più",
    back: "Indietro",
    loading: "Caricamento...",
    loadingApp: "Caricamento app...",

    // Hero section
    heroTitle: "Organizza la tua vita con l'IA",
    heroSubtitle: "L'app di produttività più avanzata con intelligenza artificiale integrata",
    heroDescription:
      "Gestisci attività, calendario, note e altro con l'aiuto del nostro assistente IA. Aumenta la tua produttività fino al 300%.",

    // Features
    aiAssistant: "Assistente IA",
    aiAssistantDesc: "Il tuo compagno intelligente per massimizzare la produttività",
    smartCalendar: "Calendario Intelligente",
    smartCalendarDesc: "Pianificazione automatica e suggerimenti personalizzati",
    taskManagement: "Gestione Attività",
    taskManagementDesc: "Organizza e prioritizza con algoritmi avanzati",

    // Pricing
    free: "Gratuito",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensile",
    yearly: "Annuale",
    mostPopular: "Più Popolare",
    bestValue: "Miglior Valore",

    // Authentication
    signIn: "Accedi",
    signUp: "Registrati",
    signInToAccount: "Accedi al tuo account",
    createFreeAccount: "Crea il tuo account gratuito",
    name: "Nome",
    email: "Email",
    password: "Password",
    invalidCredentials: "Credenziali non valide",
    loginError: "Errore di accesso",
    createAccountError: "Errore nella creazione dell'account",
    registrationError: "Errore di registrazione",
    noAccountQuestion: "Non hai un account? Registrati",
    hasAccountQuestion: "Hai già un account? Accedi",
    demoUsersLabel: "Utenti demo:",

    // App interface
    tasks: "Attività",
    calendar: "Calendario",
    notes: "Note",
    wishlist: "Lista Desideri",
    ai: "IA",
    plan: "Piano",
    settings: "Impostazioni",
    achievements: "Risultati",

    // Dashboard
    dashboard: "Dashboard",
    yourCurrentPlan: "Il Tuo Piano Attuale",
    manageSubscription: "Gestisci il tuo abbonamento",
    basicFeatures: "Caratteristiche di base",
    advancedFeatures: "Caratteristiche avanzate",
    allFeatures: "Tutte le caratteristiche",
    active: "Attivo",
    inactive: "Inattivo",
    upgradeToPremium: "Aggiorna a Premium",
    upgradeToPro: "Aggiorna a Pro",
    buyAICredits: "Acquista Crediti IA",

    // Blog
    readMore: "Leggi di più",
    relatedPosts: "Articoli correlati",
    shareArticle: "Condividi articolo",
    backToBlog: "Torna al blog",

    // Footer
    aboutUs: "Chi Siamo",
    privacyPolicy: "Politica sulla Privacy",
    termsOfService: "Termini di Servizio",
    support: "Supporto",
    followUs: "Seguici",
    allRightsReserved: "Tutti i diritti riservati",

    // Cookie banner
    cookieMessage:
      "Utilizziamo i cookie per migliorare la tua esperienza. Continuando a navigare, accetti il nostro uso dei cookie.",
    acceptCookies: "Accetta Cookie",
    cookieSettings: "Impostazioni Cookie",
  },
  pt: {
    // Navigation and general
    home: "Início",
    features: "Recursos",
    pricing: "Preços",
    blog: "Blog",
    contact: "Contato",
    login: "Entrar",
    signup: "Cadastrar",
    getStarted: "Começar",
    learnMore: "Saiba Mais",
    back: "Voltar",
    loading: "Carregando...",
    loadingApp: "Carregando aplicativo...",

    // Hero section
    heroTitle: "Organize sua vida com IA",
    heroSubtitle: "O aplicativo de produtividade mais avançado com inteligência artificial integrada",
    heroDescription:
      "Gerencie tarefas, calendário, notas e mais com a ajuda do nosso assistente IA. Aumente sua produtividade em até 300%.",

    // Features
    aiAssistant: "Assistente IA",
    aiAssistantDesc: "Seu companheiro inteligente para maximizar a produtividade",
    smartCalendar: "Calendário Inteligente",
    smartCalendarDesc: "Planejamento automático e sugestões personalizadas",
    taskManagement: "Gerenciamento de Tarefas",
    taskManagementDesc: "Organize e priorize com algoritmos avançados",

    // Pricing
    free: "Gratuito",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensal",
    yearly: "Anual",
    mostPopular: "Mais Popular",
    bestValue: "Melhor Valor",

    // Authentication
    signIn: "Entrar",
    signUp: "Cadastrar",
    signInToAccount: "Entre na sua conta",
    createFreeAccount: "Crie sua conta gratuita",
    name: "Nome",
    email: "Email",
    password: "Senha",
    invalidCredentials: "Credenciais inválidas",
    loginError: "Erro de login",
    createAccountError: "Erro ao criar conta",
    registrationError: "Erro de cadastro",
    noAccountQuestion: "Não tem conta? Cadastre-se",
    hasAccountQuestion: "Já tem conta? Entre",
    demoUsersLabel: "Usuários de demonstração:",

    // App interface
    tasks: "Tarefas",
    calendar: "Calendário",
    notes: "Notas",
    wishlist: "Lista de Desejos",
    ai: "IA",
    plan: "Plano",
    settings: "Configurações",
    achievements: "Conquistas",

    // Dashboard
    dashboard: "Painel",
    yourCurrentPlan: "Seu Plano Atual",
    manageSubscription: "Gerencie sua assinatura",
    basicFeatures: "Recursos básicos",
    advancedFeatures: "Recursos avançados",
    allFeatures: "Todos os recursos",
    active: "Ativo",
    inactive: "Inativo",
    upgradeToPremium: "Atualizar para Premium",
    upgradeToPro: "Atualizar para Pro",
    buyAICredits: "Comprar Créditos IA",

    // Blog
    readMore: "Leia mais",
    relatedPosts: "Artigos relacionados",
    shareArticle: "Compartilhar artigo",
    backToBlog: "Voltar ao blog",

    // Footer
    aboutUs: "Sobre Nós",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    support: "Suporte",
    followUs: "Siga-nos",
    allRightsReserved: "Todos os direitos reservados",

    // Cookie banner
    cookieMessage:
      "Usamos cookies para melhorar sua experiência. Ao continuar navegando, você aceita nosso uso de cookies.",
    acceptCookies: "Aceitar Cookies",
    cookieSettings: "Configurações de Cookies",
  },
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load saved language from localStorage
    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        setLanguage(savedLanguage)
      } else {
        // Detect browser language
        const browserLang = navigator.language.split("-")[0] as Language
        if (Object.keys(translations).includes(browserLang)) {
          setLanguage(browserLang)
        }
      }
    } catch (error) {
      console.warn("Error loading language from localStorage:", error)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    try {
      localStorage.setItem("language", lang)
    } catch (error) {
      console.warn("Error saving language to localStorage:", error)
    }
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.es[key] || key
  }

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    mounted,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Hook to use language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
