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
    cancel: "Cancelar",
    savePreferences: "Guardar Preferencias",

    // Hero section
    heroTitle: "El Futuro de la",
    heroTitleHighlight: "Productividad",
    heroSubtitle: "🚀 Potenciado por IA",
    heroDescription:
      "Transforma tu forma de trabajar con inteligencia artificial avanzada. Gestiona tareas, optimiza tu tiempo y alcanza tus objetivos como nunca antes.",
    startFree: "Comenzar Gratis",
    watchDemo: "Ver Demo",

    // Features
    featuresTitle: "Características Revolucionarias",
    featuresDescription:
      "Descubre cómo FutureTask está redefiniendo la productividad personal con tecnología de vanguardia.",
    aiAssistant: "Asistente IA Inteligente",
    aiAssistantDesc: "Tu asistente personal que aprende de tus hábitos y optimiza tu flujo de trabajo automáticamente.",
    smartCalendar: "Calendario Inteligente",
    smartCalendarDesc:
      "Planificación automática que se adapta a tu energía y prioridades para maximizar tu productividad.",
    taskManagement: "Seguimiento de Objetivos",
    taskManagementDesc: "Convierte tus sueños en realidad con seguimiento inteligente y recordatorios personalizados.",
    analytics: "Análisis Avanzado",
    analyticsDesc:
      "Insights profundos sobre tu productividad con gráficas interactivas y recomendaciones personalizadas.",
    pomodoro: "Pomodoro Inteligente",
    pomodoroDesc: "Técnica Pomodoro adaptativa que se ajusta a tu ritmo y tipo de trabajo para máximo enfoque.",
    achievements: "Sistema de Logros",
    achievementsDesc:
      "Gamificación inteligente que te motiva a alcanzar tus metas con recompensas y desafíos personalizados.",

    // Pricing
    pricingTitle: "Planes Diseñados para Ti",
    pricingDescription:
      "Elige el plan perfecto para tu nivel de productividad. Todos incluyen acceso completo a nuestras características principales.",
    free: "Gratuito",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensual",
    yearly: "Anual",
    mostPopular: "Más Popular",
    bestValue: "Mejor Valor",
    freeDescription: "Perfecto para comenzar tu viaje de productividad",
    premiumDescription: "Para usuarios que buscan mayor productividad",
    proDescription: "Para profesionales que necesitan el máximo rendimiento",
    chooseFree: "Comenzar Gratis",
    choosePremium: "Elegir Premium",
    choosePro: "Elegir Pro",
    guarantee: "Garantía de devolución de 30 días. Cancela en cualquier momento.",

    // Blog
    blogTitle: "Blog de Productividad",
    blogDescription:
      "Descubre las últimas tendencias, consejos y estrategias para maximizar tu productividad personal y profesional.",
    readMore: "Leer más",
    viewAllArticles: "Ver Todos los Artículos",
    relatedPosts: "Artículos relacionados",
    shareArticle: "Compartir artículo",
    backToBlog: "Volver al blog",

    // Newsletter
    newsletterTitle: "Mantente al Día",
    newsletterDescription:
      "Recibe consejos semanales de productividad, actualizaciones de funciones y contenido exclusivo directamente en tu bandeja de entrada.",
    newsletterPlaceholder: "tu@email.com",
    newsletterCta: "Suscribirse",
    newsletterPrivacy: "No spam. Cancela tu suscripción en cualquier momento.",

    // Contact
    contactTitle: "Contáctanos",
    contactDescription:
      "¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para ayudarte a maximizar tu productividad.",
    contactInfo: "Información de Contacto",
    contactForm: "Envíanos un Mensaje",
    contactName: "Nombre",
    contactEmail: "Email",
    contactSubject: "Asunto",
    contactMessage: "Mensaje",
    contactSend: "Enviar Mensaje",
    followUs: "Síguenos",

    // Footer
    footerDescription: "Transformando la productividad personal con inteligencia artificial avanzada.",
    footerProduct: "Producto",
    footerResources: "Recursos",
    footerCompany: "Empresa",
    footerApp: "Aplicación",
    footerUpdates: "Actualizaciones",
    footerHelp: "Centro de Ayuda",
    footerCommunity: "Comunidad",
    footerApi: "API",
    footerAbout: "Acerca de",
    footerPrivacy: "Privacidad",
    footerTerms: "Términos",
    footerRights: "Todos los derechos reservados.",
    footerMadeWith: "Hecho con",
    footerInSpain: "en España",

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
    dashboard: "Panel",
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
    cancel: "Cancel",
    savePreferences: "Save Preferences",

    // Hero section
    heroTitle: "The Future of",
    heroTitleHighlight: "Productivity",
    heroSubtitle: "🚀 AI-Powered",
    heroDescription:
      "Transform the way you work with advanced artificial intelligence. Manage tasks, optimize your time, and achieve your goals like never before.",
    startFree: "Start Free",
    watchDemo: "Watch Demo",

    // Features
    featuresTitle: "Revolutionary Features",
    featuresDescription: "Discover how FutureTask is redefining personal productivity with cutting-edge technology.",
    aiAssistant: "Intelligent AI Assistant",
    aiAssistantDesc: "Your personal assistant that learns from your habits and automatically optimizes your workflow.",
    smartCalendar: "Smart Calendar",
    smartCalendarDesc: "Automatic planning that adapts to your energy and priorities to maximize your productivity.",
    taskManagement: "Goal Tracking",
    taskManagementDesc: "Turn your dreams into reality with intelligent tracking and personalized reminders.",
    analytics: "Advanced Analytics",
    analyticsDesc: "Deep insights into your productivity with interactive charts and personalized recommendations.",
    pomodoro: "Smart Pomodoro",
    pomodoroDesc: "Adaptive Pomodoro technique that adjusts to your rhythm and type of work for maximum focus.",
    achievements: "Achievement System",
    achievementsDesc:
      "Intelligent gamification that motivates you to reach your goals with rewards and personalized challenges.",

    // Pricing
    pricingTitle: "Plans Designed for You",
    pricingDescription:
      "Choose the perfect plan for your productivity level. All include full access to our core features.",
    free: "Free",
    premium: "Premium",
    pro: "Pro",
    monthly: "Monthly",
    yearly: "Yearly",
    mostPopular: "Most Popular",
    bestValue: "Best Value",
    freeDescription: "Perfect to start your productivity journey",
    premiumDescription: "For users seeking greater productivity",
    proDescription: "For professionals who need maximum performance",
    chooseFree: "Start Free",
    choosePremium: "Choose Premium",
    choosePro: "Choose Pro",
    guarantee: "30-day money-back guarantee. Cancel anytime.",

    // Blog
    blogTitle: "Productivity Blog",
    blogDescription:
      "Discover the latest trends, tips and strategies to maximize your personal and professional productivity.",
    readMore: "Read more",
    viewAllArticles: "View All Articles",
    relatedPosts: "Related articles",
    shareArticle: "Share article",
    backToBlog: "Back to blog",

    // Newsletter
    newsletterTitle: "Stay Updated",
    newsletterDescription:
      "Receive weekly productivity tips, feature updates and exclusive content directly in your inbox.",
    newsletterPlaceholder: "your@email.com",
    newsletterCta: "Subscribe",
    newsletterPrivacy: "No spam. Unsubscribe anytime.",

    // Contact
    contactTitle: "Contact Us",
    contactDescription: "Have questions, suggestions or need help? We're here to help you maximize your productivity.",
    contactInfo: "Contact Information",
    contactForm: "Send us a Message",
    contactName: "Name",
    contactEmail: "Email",
    contactSubject: "Subject",
    contactMessage: "Message",
    contactSend: "Send Message",
    followUs: "Follow Us",

    // Footer
    footerDescription: "Transforming personal productivity with advanced artificial intelligence.",
    footerProduct: "Product",
    footerResources: "Resources",
    footerCompany: "Company",
    footerApp: "Application",
    footerUpdates: "Updates",
    footerHelp: "Help Center",
    footerCommunity: "Community",
    footerApi: "API",
    footerAbout: "About",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerRights: "All rights reserved.",
    footerMadeWith: "Made with",
    footerInSpain: "in Spain",

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
    dashboard: "Dashboard",
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
    cancel: "Annuler",
    savePreferences: "Sauvegarder les Préférences",

    // Hero section
    heroTitle: "L'Avenir de la",
    heroTitleHighlight: "Productivité",
    heroSubtitle: "🚀 Alimenté par l'IA",
    heroDescription:
      "Transformez votre façon de travailler avec l'intelligence artificielle avancée. Gérez les tâches, optimisez votre temps et atteignez vos objectifs comme jamais auparavant.",
    startFree: "Commencer Gratuitement",
    watchDemo: "Voir la Démo",

    // Features
    featuresTitle: "Fonctionnalités Révolutionnaires",
    featuresDescription:
      "Découvrez comment FutureTask redéfinit la productivité personnelle avec une technologie de pointe.",
    aiAssistant: "Assistant IA Intelligent",
    aiAssistantDesc:
      "Votre assistant personnel qui apprend de vos habitudes et optimise automatiquement votre flux de travail.",
    smartCalendar: "Calendrier Intelligent",
    smartCalendarDesc:
      "Planification automatique qui s'adapte à votre énergie et priorités pour maximiser votre productivité.",
    taskManagement: "Suivi des Objectifs",
    taskManagementDesc: "Transformez vos rêves en réalité avec un suivi intelligent et des rappels personnalisés.",
    analytics: "Analyses Avancées",
    analyticsDesc:
      "Insights profonds sur votre productivité avec des graphiques interactifs et des recommandations personnalisées.",
    pomodoro: "Pomodoro Intelligent",
    pomodoroDesc: "Technique Pomodoro adaptative qui s'ajuste à votre rythme et type de travail pour un focus maximum.",
    achievements: "Système de Réalisations",
    achievementsDesc:
      "Gamification intelligente qui vous motive à atteindre vos objectifs avec des récompenses et défis personnalisés.",

    // Pricing
    pricingTitle: "Plans Conçus pour Vous",
    pricingDescription:
      "Choisissez le plan parfait pour votre niveau de productivité. Tous incluent un accès complet à nos fonctionnalités principales.",
    free: "Gratuit",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensuel",
    yearly: "Annuel",
    mostPopular: "Le Plus Populaire",
    bestValue: "Meilleure Valeur",
    freeDescription: "Parfait pour commencer votre voyage de productivité",
    premiumDescription: "Pour les utilisateurs recherchant une plus grande productivité",
    proDescription: "Pour les professionnels qui ont besoin de performances maximales",
    chooseFree: "Commencer Gratuitement",
    choosePremium: "Choisir Premium",
    choosePro: "Choisir Pro",
    guarantee: "Garantie de remboursement de 30 jours. Annulez à tout moment.",

    // Blog
    blogTitle: "Blog de Productivité",
    blogDescription:
      "Découvrez les dernières tendances, conseils et stratégies pour maximiser votre productivité personnelle et professionnelle.",
    readMore: "Lire la suite",
    viewAllArticles: "Voir Tous les Articles",
    relatedPosts: "Articles connexes",
    shareArticle: "Partager l'article",
    backToBlog: "Retour au blog",

    // Newsletter
    newsletterTitle: "Restez Informé",
    newsletterDescription:
      "Recevez des conseils hebdomadaires de productivité, des mises à jour de fonctionnalités et du contenu exclusif directement dans votre boîte de réception.",
    newsletterPlaceholder: "votre@email.com",
    newsletterCta: "S'abonner",
    newsletterPrivacy: "Pas de spam. Désabonnez-vous à tout moment.",

    // Contact
    contactTitle: "Contactez-nous",
    contactDescription:
      "Avez-vous des questions, suggestions ou besoin d'aide ? Nous sommes là pour vous aider à maximiser votre productivité.",
    contactInfo: "Informations de Contact",
    contactForm: "Envoyez-nous un Message",
    contactName: "Nom",
    contactEmail: "Email",
    contactSubject: "Sujet",
    contactMessage: "Message",
    contactSend: "Envoyer le Message",
    followUs: "Suivez-nous",

    // Footer
    footerDescription: "Transformer la productivité personnelle avec l'intelligence artificielle avancée.",
    footerProduct: "Produit",
    footerResources: "Ressources",
    footerCompany: "Entreprise",
    footerApp: "Application",
    footerUpdates: "Mises à jour",
    footerHelp: "Centre d'Aide",
    footerCommunity: "Communauté",
    footerApi: "API",
    footerAbout: "À propos",
    footerPrivacy: "Confidentialité",
    footerTerms: "Conditions",
    footerRights: "Tous droits réservés.",
    footerMadeWith: "Fait avec",
    footerInSpain: "en Espagne",

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
    dashboard: "Tableau de Bord",
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
    cancel: "Abbrechen",
    savePreferences: "Einstellungen Speichern",

    // Hero section
    heroTitle: "Die Zukunft der",
    heroTitleHighlight: "Produktivität",
    heroSubtitle: "🚀 KI-Powered",
    heroDescription:
      "Transformieren Sie Ihre Arbeitsweise mit fortschrittlicher künstlicher Intelligenz. Verwalten Sie Aufgaben, optimieren Sie Ihre Zeit und erreichen Sie Ihre Ziele wie nie zuvor.",
    startFree: "Kostenlos Starten",
    watchDemo: "Demo Ansehen",

    // Features
    featuresTitle: "Revolutionäre Funktionen",
    featuresDescription:
      "Entdecken Sie, wie FutureTask die persönliche Produktivität mit modernster Technologie neu definiert.",
    aiAssistant: "Intelligenter KI-Assistent",
    aiAssistantDesc:
      "Ihr persönlicher Assistent, der aus Ihren Gewohnheiten lernt und automatisch Ihren Arbeitsablauf optimiert.",
    smartCalendar: "Intelligenter Kalender",
    smartCalendarDesc:
      "Automatische Planung, die sich an Ihre Energie und Prioritäten anpasst, um Ihre Produktivität zu maximieren.",
    taskManagement: "Zielverfolgung",
    taskManagementDesc:
      "Verwandeln Sie Ihre Träume in Realität mit intelligenter Verfolgung und personalisierten Erinnerungen.",
    analytics: "Erweiterte Analysen",
    analyticsDesc:
      "Tiefe Einblicke in Ihre Produktivität mit interaktiven Diagrammen und personalisierten Empfehlungen.",
    pomodoro: "Intelligenter Pomodoro",
    pomodoroDesc: "Adaptive Pomodoro-Technik, die sich an Ihren Rhythmus und Arbeitstyp anpasst für maximalen Fokus.",
    achievements: "Erfolgs-System",
    achievementsDesc:
      "Intelligente Gamification, die Sie motiviert, Ihre Ziele mit Belohnungen und personalisierten Herausforderungen zu erreichen.",

    // Pricing
    pricingTitle: "Pläne für Sie Entwickelt",
    pricingDescription:
      "Wählen Sie den perfekten Plan für Ihr Produktivitätsniveau. Alle beinhalten vollen Zugang zu unseren Kernfunktionen.",
    free: "Kostenlos",
    premium: "Premium",
    pro: "Pro",
    monthly: "Monatlich",
    yearly: "Jährlich",
    mostPopular: "Am Beliebtesten",
    bestValue: "Bester Wert",
    freeDescription: "Perfekt, um Ihre Produktivitätsreise zu beginnen",
    premiumDescription: "Für Benutzer, die größere Produktivität suchen",
    proDescription: "Für Profis, die maximale Leistung benötigen",
    chooseFree: "Kostenlos Starten",
    choosePremium: "Premium Wählen",
    choosePro: "Pro Wählen",
    guarantee: "30-Tage Geld-zurück-Garantie. Jederzeit kündbar.",

    // Blog
    blogTitle: "Produktivitäts-Blog",
    blogDescription:
      "Entdecken Sie die neuesten Trends, Tipps und Strategien zur Maximierung Ihrer persönlichen und beruflichen Produktivität.",
    readMore: "Weiterlesen",
    viewAllArticles: "Alle Artikel Anzeigen",
    relatedPosts: "Verwandte Artikel",
    shareArticle: "Artikel teilen",
    backToBlog: "Zurück zum Blog",

    // Newsletter
    newsletterTitle: "Bleiben Sie Informiert",
    newsletterDescription:
      "Erhalten Sie wöchentliche Produktivitätstipps, Feature-Updates und exklusive Inhalte direkt in Ihren Posteingang.",
    newsletterPlaceholder: "ihre@email.com",
    newsletterCta: "Abonnieren",
    newsletterPrivacy: "Kein Spam. Jederzeit abmelden.",

    // Contact
    contactTitle: "Kontaktieren Sie Uns",
    contactDescription:
      "Haben Sie Fragen, Vorschläge oder benötigen Hilfe? Wir sind hier, um Ihnen zu helfen, Ihre Produktivität zu maximieren.",
    contactInfo: "Kontaktinformationen",
    contactForm: "Senden Sie uns eine Nachricht",
    contactName: "Name",
    contactEmail: "Email",
    contactSubject: "Betreff",
    contactMessage: "Nachricht",
    contactSend: "Nachricht Senden",
    followUs: "Folgen Sie uns",

    // Footer
    footerDescription: "Persönliche Produktivität mit fortschrittlicher künstlicher Intelligenz transformieren.",
    footerProduct: "Produkt",
    footerResources: "Ressourcen",
    footerCompany: "Unternehmen",
    footerApp: "Anwendung",
    footerUpdates: "Updates",
    footerHelp: "Hilfe-Center",
    footerCommunity: "Gemeinschaft",
    footerApi: "API",
    footerAbout: "Über uns",
    footerPrivacy: "Datenschutz",
    footerTerms: "Bedingungen",
    footerRights: "Alle Rechte vorbehalten.",
    footerMadeWith: "Gemacht mit",
    footerInSpain: "in Spanien",

    // Authentication
    signIn: "Anmelden",
    signUp: "Registrieren",
    signInToAccount: "Melden Sie sich in Ihrem Konto an",
    createFreeAccount: "Erstellen Sie Ihr kostenloses Konto",
    name: "Name",
    email: "Email",
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
    dashboard: "Dashboard",
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
    cancel: "Annulla",
    savePreferences: "Salva Preferenze",

    // Hero section
    heroTitle: "Il Futuro della",
    heroTitleHighlight: "Produttività",
    heroSubtitle: "🚀 Alimentato dall'IA",
    heroDescription:
      "Trasforma il tuo modo di lavorare con l'intelligenza artificiale avanzata. Gestisci attività, ottimizza il tuo tempo e raggiungi i tuoi obiettivi come mai prima d'ora.",
    startFree: "Inizia Gratis",
    watchDemo: "Guarda Demo",

    // Features
    featuresTitle: "Caratteristiche Rivoluzionarie",
    featuresDescription:
      "Scopri come FutureTask sta ridefinendo la produttività personale con tecnologia all'avanguardia.",
    aiAssistant: "Assistente IA Intelligente",
    aiAssistantDesc:
      "Il tuo assistente personale che impara dalle tue abitudini e ottimizza automaticamente il tuo flusso di lavoro.",
    smartCalendar: "Calendario Intelligente",
    smartCalendarDesc:
      "Pianificazione automatica che si adatta alla tua energia e priorità per massimizzare la tua produttività.",
    taskManagement: "Tracciamento Obiettivi",
    taskManagementDesc: "Trasforma i tuoi sogni in realtà con tracciamento intelligente e promemoria personalizzati.",
    analytics: "Analisi Avanzate",
    analyticsDesc: "Approfondimenti sulla tua produttività con grafici interattivi e raccomandazioni personalizzate.",
    pomodoro: "Pomodoro Intelligente",
    pomodoroDesc: "Tecnica Pomodoro adattiva che si adatta al tuo ritmo e tipo di lavoro per il massimo focus.",
    achievements: "Sistema di Risultati",
    achievementsDesc:
      "Gamification intelligente che ti motiva a raggiungere i tuoi obiettivi con ricompense e sfide personalizzate.",

    // Pricing
    pricingTitle: "Piani Progettati per Te",
    pricingDescription:
      "Scegli il piano perfetto per il tuo livello di produttività. Tutti includono accesso completo alle nostre funzionalità principali.",
    free: "Gratuito",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensile",
    yearly: "Annuale",
    mostPopular: "Più Popolare",
    bestValue: "Miglior Valore",
    freeDescription: "Perfetto per iniziare il tuo viaggio di produttività",
    premiumDescription: "Per utenti che cercano maggiore produttività",
    proDescription: "Per professionisti che hanno bisogno di prestazioni massime",
    chooseFree: "Inizia Gratis",
    choosePremium: "Scegli Premium",
    choosePro: "Scegli Pro",
    guarantee: "Garanzia di rimborso di 30 giorni. Annulla in qualsiasi momento.",

    // Blog
    blogTitle: "Blog di Produttività",
    blogDescription:
      "Scopri le ultime tendenze, consigli e strategie per massimizzare la tua produttività personale e professionale.",
    readMore: "Leggi di più",
    viewAllArticles: "Visualizza Tutti gli Articoli",
    relatedPosts: "Articoli correlati",
    shareArticle: "Condividi articolo",
    backToBlog: "Torna al blog",

    // Newsletter
    newsletterTitle: "Rimani Aggiornato",
    newsletterDescription:
      "Ricevi consigli settimanali di produttività, aggiornamenti delle funzionalità e contenuti esclusivi direttamente nella tua casella di posta.",
    newsletterPlaceholder: "tua@email.com",
    newsletterCta: "Iscriviti",
    newsletterPrivacy: "Niente spam. Annulla l'iscrizione in qualsiasi momento.",

    // Contact
    contactTitle: "Contattaci",
    contactDescription:
      "Hai domande, suggerimenti o hai bisogno di aiuto? Siamo qui per aiutarti a massimizzare la tua produttività.",
    contactInfo: "Informazioni di Contatto",
    contactForm: "Inviaci un Messaggio",
    contactName: "Nome",
    contactEmail: "Email",
    contactSubject: "Oggetto",
    contactMessage: "Messaggio",
    contactSend: "Invia Messaggio",
    followUs: "Seguici",

    // Footer
    footerDescription: "Trasformare la produttività personale con intelligenza artificiale avanzata.",
    footerProduct: "Prodotto",
    footerResources: "Risorse",
    footerCompany: "Azienda",
    footerApp: "Applicazione",
    footerUpdates: "Aggiornamenti",
    footerHelp: "Centro Assistenza",
    footerCommunity: "Comunità",
    footerApi: "API",
    footerAbout: "Chi siamo",
    footerPrivacy: "Privacy",
    footerTerms: "Termini",
    footerRights: "Tutti i diritti riservati.",
    footerMadeWith: "Fatto con",
    footerInSpain: "in Spagna",

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
    dashboard: "Dashboard",
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
    cancel: "Cancelar",
    savePreferences: "Salvar Preferências",

    // Hero section
    heroTitle: "O Futuro da",
    heroTitleHighlight: "Produtividade",
    heroSubtitle: "🚀 Alimentado por IA",
    heroDescription:
      "Transforme sua forma de trabalhar com inteligência artificial avançada. Gerencie tarefas, otimize seu tempo e alcance seus objetivos como nunca antes.",
    startFree: "Começar Grátis",
    watchDemo: "Ver Demo",

    // Features
    featuresTitle: "Recursos Revolucionários",
    featuresDescription: "Descubra como o FutureTask está redefinindo a produtividade pessoal com tecnologia de ponta.",
    aiAssistant: "Assistente IA Inteligente",
    aiAssistantDesc:
      "Seu assistente pessoal que aprende com seus hábitos e otimiza automaticamente seu fluxo de trabalho.",
    smartCalendar: "Calendário Inteligente",
    smartCalendarDesc:
      "Planejamento automático que se adapta à sua energia e prioridades para maximizar sua produtividade.",
    taskManagement: "Rastreamento de Objetivos",
    taskManagementDesc: "Transforme seus sonhos em realidade com rastreamento inteligente e lembretes personalizados.",
    analytics: "Análises Avançadas",
    analyticsDesc:
      "Insights profundos sobre sua produtividade com gráficos interativos e recomendações personalizadas.",
    pomodoro: "Pomodoro Inteligente",
    pomodoroDesc: "Técnica Pomodoro adaptativa que se ajusta ao seu ritmo e tipo de trabalho para foco máximo.",
    achievements: "Sistema de Conquistas",
    achievementsDesc:
      "Gamificação inteligente que te motiva a alcançar seus objetivos com recompensas e desafios personalizados.",

    // Pricing
    pricingTitle: "Planos Projetados para Você",
    pricingDescription:
      "Escolha o plano perfeito para seu nível de produtividade. Todos incluem acesso completo aos nossos recursos principais.",
    free: "Gratuito",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensal",
    yearly: "Anual",
    mostPopular: "Mais Popular",
    bestValue: "Melhor Valor",
    freeDescription: "Perfeito para começar sua jornada de produtividade",
    premiumDescription: "Para usuários que buscam maior produtividade",
    proDescription: "Para profissionais que precisam de desempenho máximo",
    chooseFree: "Começar Grátis",
    choosePremium: "Escolher Premium",
    choosePro: "Escolher Pro",
    guarantee: "Garantia de reembolso de 30 dias. Cancele a qualquer momento.",

    // Blog
    blogTitle: "Blog de Produtividade",
    blogDescription:
      "Descubra as últimas tendências, dicas e estratégias para maximizar sua produtividade pessoal e profissional.",
    readMore: "Leia mais",
    viewAllArticles: "Ver Todos os Artigos",
    relatedPosts: "Artigos relacionados",
    shareArticle: "Compartilhar artigo",
    backToBlog: "Voltar ao blog",

    // Newsletter
    newsletterTitle: "Mantenha-se Atualizado",
    newsletterDescription:
      "Receba dicas semanais de produtividade, atualizações de recursos e conteúdo exclusivo diretamente em sua caixa de entrada.",
    newsletterPlaceholder: "seu@email.com",
    newsletterCta: "Inscrever-se",
    newsletterPrivacy: "Sem spam. Cancele a inscrição a qualquer momento.",

    // Contact
    contactTitle: "Entre em Contato",
    contactDescription:
      "Tem perguntas, sugestões ou precisa de ajuda? Estamos aqui para ajudá-lo a maximizar sua produtividade.",
    contactInfo: "Informações de Contato",
    contactForm: "Envie-nos uma Mensagem",
    contactName: "Nome",
    contactEmail: "Email",
    contactSubject: "Assunto",
    contactMessage: "Mensagem",
    contactSend: "Enviar Mensagem",
    followUs: "Siga-nos",

    // Footer
    footerDescription: "Transformando a produtividade pessoal com inteligência artificial avançada.",
    footerProduct: "Produto",
    footerResources: "Recursos",
    footerCompany: "Empresa",
    footerApp: "Aplicativo",
    footerUpdates: "Atualizações",
    footerHelp: "Central de Ajuda",
    footerCommunity: "Comunidade",
    footerApi: "API",
    footerAbout: "Sobre",
    footerPrivacy: "Privacidade",
    footerTerms: "Termos",
    footerRights: "Todos os direitos reservados.",
    footerMadeWith: "Feito com",
    footerInSpain: "na Espanha",

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
    dashboard: "Painel",
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
      // Force page reload to apply language changes
      window.location.reload()
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
