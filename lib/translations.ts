export type Language = "es" | "en" | "fr" | "de" | "it" | "pt"

export interface Translations {
  // Navigation and General
  home: string
  features: string
  pricing: string
  blog: string
  contact: string
  signIn: string
  signUp: string
  getStarted: string
  learnMore: string
  readMore: string
  back: string
  loading: string
  loadingApp: string

  // Hero Section
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  startFree: string
  watchDemo: string

  // Features
  featuresTitle: string
  featuresSubtitle: string
  taskManagement: string
  taskManagementDesc: string
  aiAssistant: string
  aiAssistantDesc: string
  smartCalendar: string
  smartCalendarDesc: string
  teamCollaboration: string
  teamCollaborationDesc: string
  analytics: string
  analyticsDesc: string
  integrations: string
  integrationsDesc: string

  // Pricing
  pricingTitle: string
  pricingSubtitle: string
  free: string
  premium: string
  pro: string
  monthly: string
  yearly: string
  mostPopular: string
  choosePlan: string

  // Plan Features
  basicFeatures: string
  advancedFeatures: string
  allFeatures: string
  unlimitedTasks: string
  basicSupport: string
  aiAssistance: string
  prioritySupport: string
  advancedAnalytics: string
  teamFeatures: string
  customIntegrations: string

  // Testimonials
  testimonialsTitle: string
  testimonialsSubtitle: string

  // Blog
  blogTitle: string
  blogSubtitle: string
  latestPosts: string

  // Footer
  footerDescription: string
  quickLinks: string
  support: string
  legal: string
  followUs: string
  allRightsReserved: string

  // Authentication
  signInToAccount: string
  createFreeAccount: string
  name: string
  email: string
  password: string
  confirmPassword: string
  forgotPassword: string
  noAccountQuestion: string
  hasAccountQuestion: string
  createAccount: string

  // Demo Users
  demoUsersLabel: string

  // App Interface
  dashboard: string
  tasks: string
  calendar: string
  notes: string
  wishlist: string
  ai: string
  plan: string
  settings: string
  profile: string
  logout: string

  // User Plans
  yourCurrentPlan: string
  manageSubscription: string
  active: string
  inactive: string
  upgradeToPremium: string
  upgradeToPro: string

  // AI Credits
  aiCredits: string
  buyAICredits: string
  creditsRemaining: string

  // Errors
  invalidCredentials: string
  loginError: string
  createAccountError: string
  registrationError: string

  // Success Messages
  welcomeBack: string
  accountCreated: string

  // Common Actions
  save: string
  cancel: string
  delete: string
  edit: string
  add: string
  remove: string
  update: string
  confirm: string

  // Time and Dates
  today: string
  tomorrow: string
  yesterday: string
  thisWeek: string
  nextWeek: string
  thisMonth: string
  nextMonth: string
}

export const translations: Record<Language, Translations> = {
  es: {
    // Navigation and General
    home: "Inicio",
    features: "Características",
    pricing: "Precios",
    blog: "Blog",
    contact: "Contacto",
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    getStarted: "Comenzar",
    learnMore: "Saber Más",
    readMore: "Leer Más",
    back: "Volver",
    loading: "Cargando...",
    loadingApp: "Cargando aplicación...",

    // Hero Section
    heroTitle: "Organiza tu vida con IA",
    heroSubtitle: "La plataforma de productividad más avanzada",
    heroDescription:
      "Gestiona tareas, calendario y notas con inteligencia artificial. Aumenta tu productividad con herramientas inteligentes.",
    startFree: "Comenzar Gratis",
    watchDemo: "Ver Demo",

    // Features
    featuresTitle: "Características Poderosas",
    featuresSubtitle: "Todo lo que necesitas para ser más productivo",
    taskManagement: "Gestión de Tareas",
    taskManagementDesc: "Organiza y prioriza tus tareas con facilidad",
    aiAssistant: "Asistente IA",
    aiAssistantDesc: "Obtén ayuda inteligente para tus proyectos",
    smartCalendar: "Calendario Inteligente",
    smartCalendarDesc: "Planifica tu tiempo de manera eficiente",
    teamCollaboration: "Colaboración en Equipo",
    teamCollaborationDesc: "Trabaja mejor con tu equipo",
    analytics: "Análisis Avanzado",
    analyticsDesc: "Insights sobre tu productividad",
    integrations: "Integraciones",
    integrationsDesc: "Conecta con tus herramientas favoritas",

    // Pricing
    pricingTitle: "Planes Simples y Transparentes",
    pricingSubtitle: "Elige el plan perfecto para ti",
    free: "Gratis",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensual",
    yearly: "Anual",
    mostPopular: "Más Popular",
    choosePlan: "Elegir Plan",

    // Plan Features
    basicFeatures: "Características básicas para empezar",
    advancedFeatures: "Características avanzadas para profesionales",
    allFeatures: "Todas las características + IA avanzada",
    unlimitedTasks: "Tareas ilimitadas",
    basicSupport: "Soporte básico",
    aiAssistance: "Asistencia IA",
    prioritySupport: "Soporte prioritario",
    advancedAnalytics: "Análisis avanzado",
    teamFeatures: "Características de equipo",
    customIntegrations: "Integraciones personalizadas",

    // Testimonials
    testimonialsTitle: "Lo que dicen nuestros usuarios",
    testimonialsSubtitle: "Miles de profesionales confían en FutureTask",

    // Blog
    blogTitle: "Blog y Recursos",
    blogSubtitle: "Consejos y estrategias para mejorar tu productividad",
    latestPosts: "Últimas Publicaciones",

    // Footer
    footerDescription: "La plataforma de productividad más avanzada del mundo.",
    quickLinks: "Enlaces Rápidos",
    support: "Soporte",
    legal: "Legal",
    followUs: "Síguenos",
    allRightsReserved: "Todos los derechos reservados.",

    // Authentication
    signInToAccount: "Inicia sesión en tu cuenta",
    createFreeAccount: "Crea tu cuenta gratuita",
    name: "Nombre",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    noAccountQuestion: "¿No tienes cuenta? Regístrate",
    hasAccountQuestion: "¿Ya tienes cuenta? Inicia sesión",
    createAccount: "Crear Cuenta",

    // Demo Users
    demoUsersLabel: "Usuarios de demostración:",

    // App Interface
    dashboard: "Panel",
    tasks: "Tareas",
    calendar: "Calendario",
    notes: "Notas",
    wishlist: "Lista de Deseos",
    ai: "IA",
    plan: "Plan",
    settings: "Configuración",
    profile: "Perfil",
    logout: "Cerrar Sesión",

    // User Plans
    yourCurrentPlan: "Tu Plan Actual",
    manageSubscription: "Gestiona tu suscripción y características",
    active: "Activo",
    inactive: "Inactivo",
    upgradeToPremium: "Actualizar a Premium",
    upgradeToPro: "Actualizar a Pro",

    // AI Credits
    aiCredits: "Créditos IA",
    buyAICredits: "Comprar Créditos IA",
    creditsRemaining: "créditos restantes",

    // Errors
    invalidCredentials: "Credenciales inválidas",
    loginError: "Error al iniciar sesión",
    createAccountError: "Error al crear la cuenta",
    registrationError: "Error en el registro",

    // Success Messages
    welcomeBack: "¡Bienvenido de vuelta!",
    accountCreated: "Cuenta creada exitosamente",

    // Common Actions
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Agregar",
    remove: "Quitar",
    update: "Actualizar",
    confirm: "Confirmar",

    // Time and Dates
    today: "Hoy",
    tomorrow: "Mañana",
    yesterday: "Ayer",
    thisWeek: "Esta semana",
    nextWeek: "Próxima semana",
    thisMonth: "Este mes",
    nextMonth: "Próximo mes",
  },

  en: {
    // Navigation and General
    home: "Home",
    features: "Features",
    pricing: "Pricing",
    blog: "Blog",
    contact: "Contact",
    signIn: "Sign In",
    signUp: "Sign Up",
    getStarted: "Get Started",
    learnMore: "Learn More",
    readMore: "Read More",
    back: "Back",
    loading: "Loading...",
    loadingApp: "Loading app...",

    // Hero Section
    heroTitle: "Organize your life with AI",
    heroSubtitle: "The most advanced productivity platform",
    heroDescription:
      "Manage tasks, calendar, and notes with artificial intelligence. Boost your productivity with smart tools.",
    startFree: "Start Free",
    watchDemo: "Watch Demo",

    // Features
    featuresTitle: "Powerful Features",
    featuresSubtitle: "Everything you need to be more productive",
    taskManagement: "Task Management",
    taskManagementDesc: "Organize and prioritize your tasks with ease",
    aiAssistant: "AI Assistant",
    aiAssistantDesc: "Get intelligent help for your projects",
    smartCalendar: "Smart Calendar",
    smartCalendarDesc: "Plan your time efficiently",
    teamCollaboration: "Team Collaboration",
    teamCollaborationDesc: "Work better with your team",
    analytics: "Advanced Analytics",
    analyticsDesc: "Insights about your productivity",
    integrations: "Integrations",
    integrationsDesc: "Connect with your favorite tools",

    // Pricing
    pricingTitle: "Simple and Transparent Pricing",
    pricingSubtitle: "Choose the perfect plan for you",
    free: "Free",
    premium: "Premium",
    pro: "Pro",
    monthly: "Monthly",
    yearly: "Yearly",
    mostPopular: "Most Popular",
    choosePlan: "Choose Plan",

    // Plan Features
    basicFeatures: "Basic features to get started",
    advancedFeatures: "Advanced features for professionals",
    allFeatures: "All features + advanced AI",
    unlimitedTasks: "Unlimited tasks",
    basicSupport: "Basic support",
    aiAssistance: "AI assistance",
    prioritySupport: "Priority support",
    advancedAnalytics: "Advanced analytics",
    teamFeatures: "Team features",
    customIntegrations: "Custom integrations",

    // Testimonials
    testimonialsTitle: "What our users say",
    testimonialsSubtitle: "Thousands of professionals trust FutureTask",

    // Blog
    blogTitle: "Blog & Resources",
    blogSubtitle: "Tips and strategies to improve your productivity",
    latestPosts: "Latest Posts",

    // Footer
    footerDescription: "The world's most advanced productivity platform.",
    quickLinks: "Quick Links",
    support: "Support",
    legal: "Legal",
    followUs: "Follow Us",
    allRightsReserved: "All rights reserved.",

    // Authentication
    signInToAccount: "Sign in to your account",
    createFreeAccount: "Create your free account",
    name: "Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    forgotPassword: "Forgot your password?",
    noAccountQuestion: "Don't have an account? Sign up",
    hasAccountQuestion: "Already have an account? Sign in",
    createAccount: "Create Account",

    // Demo Users
    demoUsersLabel: "Demo users:",

    // App Interface
    dashboard: "Dashboard",
    tasks: "Tasks",
    calendar: "Calendar",
    notes: "Notes",
    wishlist: "Wishlist",
    ai: "AI",
    plan: "Plan",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",

    // User Plans
    yourCurrentPlan: "Your Current Plan",
    manageSubscription: "Manage your subscription and features",
    active: "Active",
    inactive: "Inactive",
    upgradeToPremium: "Upgrade to Premium",
    upgradeToPro: "Upgrade to Pro",

    // AI Credits
    aiCredits: "AI Credits",
    buyAICredits: "Buy AI Credits",
    creditsRemaining: "credits remaining",

    // Errors
    invalidCredentials: "Invalid credentials",
    loginError: "Login error",
    createAccountError: "Error creating account",
    registrationError: "Registration error",

    // Success Messages
    welcomeBack: "Welcome back!",
    accountCreated: "Account created successfully",

    // Common Actions
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    update: "Update",
    confirm: "Confirm",

    // Time and Dates
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",
    thisWeek: "This week",
    nextWeek: "Next week",
    thisMonth: "This month",
    nextMonth: "Next month",
  },

  fr: {
    // Navigation and General
    home: "Accueil",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    blog: "Blog",
    contact: "Contact",
    signIn: "Se connecter",
    signUp: "S'inscrire",
    getStarted: "Commencer",
    learnMore: "En savoir plus",
    readMore: "Lire plus",
    back: "Retour",
    loading: "Chargement...",
    loadingApp: "Chargement de l'application...",

    // Hero Section
    heroTitle: "Organisez votre vie avec l'IA",
    heroSubtitle: "La plateforme de productivité la plus avancée",
    heroDescription:
      "Gérez les tâches, le calendrier et les notes avec l'intelligence artificielle. Boostez votre productivité avec des outils intelligents.",
    startFree: "Commencer gratuitement",
    watchDemo: "Voir la démo",

    // Features
    featuresTitle: "Fonctionnalités puissantes",
    featuresSubtitle: "Tout ce dont vous avez besoin pour être plus productif",
    taskManagement: "Gestion des tâches",
    taskManagementDesc: "Organisez et priorisez vos tâches facilement",
    aiAssistant: "Assistant IA",
    aiAssistantDesc: "Obtenez une aide intelligente pour vos projets",
    smartCalendar: "Calendrier intelligent",
    smartCalendarDesc: "Planifiez votre temps efficacement",
    teamCollaboration: "Collaboration d'équipe",
    teamCollaborationDesc: "Travaillez mieux avec votre équipe",
    analytics: "Analyses avancées",
    analyticsDesc: "Aperçus sur votre productivité",
    integrations: "Intégrations",
    integrationsDesc: "Connectez-vous avec vos outils préférés",

    // Pricing
    pricingTitle: "Tarifs simples et transparents",
    pricingSubtitle: "Choisissez le plan parfait pour vous",
    free: "Gratuit",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensuel",
    yearly: "Annuel",
    mostPopular: "Le plus populaire",
    choosePlan: "Choisir le plan",

    // Plan Features
    basicFeatures: "Fonctionnalités de base pour commencer",
    advancedFeatures: "Fonctionnalités avancées pour les professionnels",
    allFeatures: "Toutes les fonctionnalités + IA avancée",
    unlimitedTasks: "Tâches illimitées",
    basicSupport: "Support de base",
    aiAssistance: "Assistance IA",
    prioritySupport: "Support prioritaire",
    advancedAnalytics: "Analyses avancées",
    teamFeatures: "Fonctionnalités d'équipe",
    customIntegrations: "Intégrations personnalisées",

    // Testimonials
    testimonialsTitle: "Ce que disent nos utilisateurs",
    testimonialsSubtitle: "Des milliers de professionnels font confiance à FutureTask",

    // Blog
    blogTitle: "Blog et ressources",
    blogSubtitle: "Conseils et stratégies pour améliorer votre productivité",
    latestPosts: "Derniers articles",

    // Footer
    footerDescription: "La plateforme de productivité la plus avancée au monde.",
    quickLinks: "Liens rapides",
    support: "Support",
    legal: "Légal",
    followUs: "Suivez-nous",
    allRightsReserved: "Tous droits réservés.",

    // Authentication
    signInToAccount: "Connectez-vous à votre compte",
    createFreeAccount: "Créez votre compte gratuit",
    name: "Nom",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    noAccountQuestion: "Pas de compte ? Inscrivez-vous",
    hasAccountQuestion: "Déjà un compte ? Connectez-vous",
    createAccount: "Créer un compte",

    // Demo Users
    demoUsersLabel: "Utilisateurs de démonstration :",

    // App Interface
    dashboard: "Tableau de bord",
    tasks: "Tâches",
    calendar: "Calendrier",
    notes: "Notes",
    wishlist: "Liste de souhaits",
    ai: "IA",
    plan: "Plan",
    settings: "Paramètres",
    profile: "Profil",
    logout: "Déconnexion",

    // User Plans
    yourCurrentPlan: "Votre plan actuel",
    manageSubscription: "Gérez votre abonnement et fonctionnalités",
    active: "Actif",
    inactive: "Inactif",
    upgradeToPremium: "Passer à Premium",
    upgradeToPro: "Passer à Pro",

    // AI Credits
    aiCredits: "Crédits IA",
    buyAICredits: "Acheter des crédits IA",
    creditsRemaining: "crédits restants",

    // Errors
    invalidCredentials: "Identifiants invalides",
    loginError: "Erreur de connexion",
    createAccountError: "Erreur lors de la création du compte",
    registrationError: "Erreur d'inscription",

    // Success Messages
    welcomeBack: "Bon retour !",
    accountCreated: "Compte créé avec succès",

    // Common Actions
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    remove: "Retirer",
    update: "Mettre à jour",
    confirm: "Confirmer",

    // Time and Dates
    today: "Aujourd'hui",
    tomorrow: "Demain",
    yesterday: "Hier",
    thisWeek: "Cette semaine",
    nextWeek: "Semaine prochaine",
    thisMonth: "Ce mois",
    nextMonth: "Mois prochain",
  },

  de: {
    // Navigation and General
    home: "Startseite",
    features: "Funktionen",
    pricing: "Preise",
    blog: "Blog",
    contact: "Kontakt",
    signIn: "Anmelden",
    signUp: "Registrieren",
    getStarted: "Loslegen",
    learnMore: "Mehr erfahren",
    readMore: "Weiterlesen",
    back: "Zurück",
    loading: "Laden...",
    loadingApp: "App wird geladen...",

    // Hero Section
    heroTitle: "Organisieren Sie Ihr Leben mit KI",
    heroSubtitle: "Die fortschrittlichste Produktivitätsplattform",
    heroDescription:
      "Verwalten Sie Aufgaben, Kalender und Notizen mit künstlicher Intelligenz. Steigern Sie Ihre Produktivität mit intelligenten Tools.",
    startFree: "Kostenlos starten",
    watchDemo: "Demo ansehen",

    // Features
    featuresTitle: "Leistungsstarke Funktionen",
    featuresSubtitle: "Alles was Sie brauchen, um produktiver zu sein",
    taskManagement: "Aufgabenverwaltung",
    taskManagementDesc: "Organisieren und priorisieren Sie Ihre Aufgaben mit Leichtigkeit",
    aiAssistant: "KI-Assistent",
    aiAssistantDesc: "Erhalten Sie intelligente Hilfe für Ihre Projekte",
    smartCalendar: "Intelligenter Kalender",
    smartCalendarDesc: "Planen Sie Ihre Zeit effizient",
    teamCollaboration: "Teamzusammenarbeit",
    teamCollaborationDesc: "Arbeiten Sie besser mit Ihrem Team",
    analytics: "Erweiterte Analysen",
    analyticsDesc: "Einblicke in Ihre Produktivität",
    integrations: "Integrationen",
    integrationsDesc: "Verbinden Sie sich mit Ihren Lieblings-Tools",

    // Pricing
    pricingTitle: "Einfache und transparente Preise",
    pricingSubtitle: "Wählen Sie den perfekten Plan für Sie",
    free: "Kostenlos",
    premium: "Premium",
    pro: "Pro",
    monthly: "Monatlich",
    yearly: "Jährlich",
    mostPopular: "Am beliebtesten",
    choosePlan: "Plan wählen",

    // Plan Features
    basicFeatures: "Grundfunktionen zum Einstieg",
    advancedFeatures: "Erweiterte Funktionen für Profis",
    allFeatures: "Alle Funktionen + erweiterte KI",
    unlimitedTasks: "Unbegrenzte Aufgaben",
    basicSupport: "Basis-Support",
    aiAssistance: "KI-Unterstützung",
    prioritySupport: "Priority-Support",
    advancedAnalytics: "Erweiterte Analysen",
    teamFeatures: "Team-Funktionen",
    customIntegrations: "Benutzerdefinierte Integrationen",

    // Testimonials
    testimonialsTitle: "Was unsere Nutzer sagen",
    testimonialsSubtitle: "Tausende von Profis vertrauen FutureTask",

    // Blog
    blogTitle: "Blog & Ressourcen",
    blogSubtitle: "Tipps und Strategien zur Verbesserung Ihrer Produktivität",
    latestPosts: "Neueste Beiträge",

    // Footer
    footerDescription: "Die fortschrittlichste Produktivitätsplattform der Welt.",
    quickLinks: "Schnelle Links",
    support: "Support",
    legal: "Rechtliches",
    followUs: "Folgen Sie uns",
    allRightsReserved: "Alle Rechte vorbehalten.",

    // Authentication
    signInToAccount: "Melden Sie sich in Ihrem Konto an",
    createFreeAccount: "Erstellen Sie Ihr kostenloses Konto",
    name: "Name",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort bestätigen",
    forgotPassword: "Passwort vergessen?",
    noAccountQuestion: "Kein Konto? Registrieren",
    hasAccountQuestion: "Bereits ein Konto? Anmelden",
    createAccount: "Konto erstellen",

    // Demo Users
    demoUsersLabel: "Demo-Benutzer:",

    // App Interface
    dashboard: "Dashboard",
    tasks: "Aufgaben",
    calendar: "Kalender",
    notes: "Notizen",
    wishlist: "Wunschliste",
    ai: "KI",
    plan: "Plan",
    settings: "Einstellungen",
    profile: "Profil",
    logout: "Abmelden",

    // User Plans
    yourCurrentPlan: "Ihr aktueller Plan",
    manageSubscription: "Verwalten Sie Ihr Abonnement und Ihre Funktionen",
    active: "Aktiv",
    inactive: "Inaktiv",
    upgradeToPremium: "Auf Premium upgraden",
    upgradeToPro: "Auf Pro upgraden",

    // AI Credits
    aiCredits: "KI-Credits",
    buyAICredits: "KI-Credits kaufen",
    creditsRemaining: "Credits verbleibend",

    // Errors
    invalidCredentials: "Ungültige Anmeldedaten",
    loginError: "Anmeldefehler",
    createAccountError: "Fehler beim Erstellen des Kontos",
    registrationError: "Registrierungsfehler",

    // Success Messages
    welcomeBack: "Willkommen zurück!",
    accountCreated: "Konto erfolgreich erstellt",

    // Common Actions
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    remove: "Entfernen",
    update: "Aktualisieren",
    confirm: "Bestätigen",

    // Time and Dates
    today: "Heute",
    tomorrow: "Morgen",
    yesterday: "Gestern",
    thisWeek: "Diese Woche",
    nextWeek: "Nächste Woche",
    thisMonth: "Dieser Monat",
    nextMonth: "Nächster Monat",
  },

  it: {
    // Navigation and General
    home: "Home",
    features: "Caratteristiche",
    pricing: "Prezzi",
    blog: "Blog",
    contact: "Contatto",
    signIn: "Accedi",
    signUp: "Registrati",
    getStarted: "Inizia",
    learnMore: "Scopri di più",
    readMore: "Leggi di più",
    back: "Indietro",
    loading: "Caricamento...",
    loadingApp: "Caricamento app...",

    // Hero Section
    heroTitle: "Organizza la tua vita con l'IA",
    heroSubtitle: "La piattaforma di produttività più avanzata",
    heroDescription:
      "Gestisci attività, calendario e note con intelligenza artificiale. Aumenta la tua produttività con strumenti intelligenti.",
    startFree: "Inizia gratis",
    watchDemo: "Guarda demo",

    // Features
    featuresTitle: "Caratteristiche potenti",
    featuresSubtitle: "Tutto ciò di cui hai bisogno per essere più produttivo",
    taskManagement: "Gestione attività",
    taskManagementDesc: "Organizza e dai priorità alle tue attività con facilità",
    aiAssistant: "Assistente IA",
    aiAssistantDesc: "Ottieni aiuto intelligente per i tuoi progetti",
    smartCalendar: "Calendario intelligente",
    smartCalendarDesc: "Pianifica il tuo tempo in modo efficiente",
    teamCollaboration: "Collaborazione di squadra",
    teamCollaborationDesc: "Lavora meglio con il tuo team",
    analytics: "Analisi avanzate",
    analyticsDesc: "Approfondimenti sulla tua produttività",
    integrations: "Integrazioni",
    integrationsDesc: "Connettiti con i tuoi strumenti preferiti",

    // Pricing
    pricingTitle: "Prezzi semplici e trasparenti",
    pricingSubtitle: "Scegli il piano perfetto per te",
    free: "Gratuito",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensile",
    yearly: "Annuale",
    mostPopular: "Più popolare",
    choosePlan: "Scegli piano",

    // Plan Features
    basicFeatures: "Caratteristiche di base per iniziare",
    advancedFeatures: "Caratteristiche avanzate per professionisti",
    allFeatures: "Tutte le caratteristiche + IA avanzata",
    unlimitedTasks: "Attività illimitate",
    basicSupport: "Supporto di base",
    aiAssistance: "Assistenza IA",
    prioritySupport: "Supporto prioritario",
    advancedAnalytics: "Analisi avanzate",
    teamFeatures: "Caratteristiche del team",
    customIntegrations: "Integrazioni personalizzate",

    // Testimonials
    testimonialsTitle: "Cosa dicono i nostri utenti",
    testimonialsSubtitle: "Migliaia di professionisti si fidano di FutureTask",

    // Blog
    blogTitle: "Blog e risorse",
    blogSubtitle: "Consigli e strategie per migliorare la tua produttività",
    latestPosts: "Ultimi post",

    // Footer
    footerDescription: "La piattaforma di produttività più avanzata al mondo.",
    quickLinks: "Link rapidi",
    support: "Supporto",
    legal: "Legale",
    followUs: "Seguici",
    allRightsReserved: "Tutti i diritti riservati.",

    // Authentication
    signInToAccount: "Accedi al tuo account",
    createFreeAccount: "Crea il tuo account gratuito",
    name: "Nome",
    email: "Email",
    password: "Password",
    confirmPassword: "Conferma password",
    forgotPassword: "Password dimenticata?",
    noAccountQuestion: "Non hai un account? Registrati",
    hasAccountQuestion: "Hai già un account? Accedi",
    createAccount: "Crea account",

    // Demo Users
    demoUsersLabel: "Utenti demo:",

    // App Interface
    dashboard: "Dashboard",
    tasks: "Attività",
    calendar: "Calendario",
    notes: "Note",
    wishlist: "Lista desideri",
    ai: "IA",
    plan: "Piano",
    settings: "Impostazioni",
    profile: "Profilo",
    logout: "Esci",

    // User Plans
    yourCurrentPlan: "Il tuo piano attuale",
    manageSubscription: "Gestisci il tuo abbonamento e le caratteristiche",
    active: "Attivo",
    inactive: "Inattivo",
    upgradeToPremium: "Aggiorna a Premium",
    upgradeToPro: "Aggiorna a Pro",

    // AI Credits
    aiCredits: "Crediti IA",
    buyAICredits: "Acquista crediti IA",
    creditsRemaining: "crediti rimanenti",

    // Errors
    invalidCredentials: "Credenziali non valide",
    loginError: "Errore di accesso",
    createAccountError: "Errore nella creazione dell'account",
    registrationError: "Errore di registrazione",

    // Success Messages
    welcomeBack: "Bentornato!",
    accountCreated: "Account creato con successo",

    // Common Actions
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    edit: "Modifica",
    add: "Aggiungi",
    remove: "Rimuovi",
    update: "Aggiorna",
    confirm: "Conferma",

    // Time and Dates
    today: "Oggi",
    tomorrow: "Domani",
    yesterday: "Ieri",
    thisWeek: "Questa settimana",
    nextWeek: "Prossima settimana",
    thisMonth: "Questo mese",
    nextMonth: "Prossimo mese",
  },

  pt: {
    // Navigation and General
    home: "Início",
    features: "Recursos",
    pricing: "Preços",
    blog: "Blog",
    contact: "Contato",
    signIn: "Entrar",
    signUp: "Cadastrar",
    getStarted: "Começar",
    learnMore: "Saiba mais",
    readMore: "Leia mais",
    back: "Voltar",
    loading: "Carregando...",
    loadingApp: "Carregando aplicativo...",

    // Hero Section
    heroTitle: "Organize sua vida com IA",
    heroSubtitle: "A plataforma de produtividade mais avançada",
    heroDescription:
      "Gerencie tarefas, calendário e notas com inteligência artificial. Aumente sua produtividade com ferramentas inteligentes.",
    startFree: "Começar grátis",
    watchDemo: "Ver demo",

    // Features
    featuresTitle: "Recursos poderosos",
    featuresSubtitle: "Tudo que você precisa para ser mais produtivo",
    taskManagement: "Gerenciamento de tarefas",
    taskManagementDesc: "Organize e priorize suas tarefas com facilidade",
    aiAssistant: "Assistente IA",
    aiAssistantDesc: "Obtenha ajuda inteligente para seus projetos",
    smartCalendar: "Calendário inteligente",
    smartCalendarDesc: "Planeje seu tempo de forma eficiente",
    teamCollaboration: "Colaboração em equipe",
    teamCollaborationDesc: "Trabalhe melhor com sua equipe",
    analytics: "Análises avançadas",
    analyticsDesc: "Insights sobre sua produtividade",
    integrations: "Integrações",
    integrationsDesc: "Conecte-se com suas ferramentas favoritas",

    // Pricing
    pricingTitle: "Preços simples e transparentes",
    pricingSubtitle: "Escolha o plano perfeito para você",
    free: "Gratuito",
    premium: "Premium",
    pro: "Pro",
    monthly: "Mensal",
    yearly: "Anual",
    mostPopular: "Mais popular",
    choosePlan: "Escolher plano",

    // Plan Features
    basicFeatures: "Recursos básicos para começar",
    advancedFeatures: "Recursos avançados para profissionais",
    allFeatures: "Todos os recursos + IA avançada",
    unlimitedTasks: "Tarefas ilimitadas",
    basicSupport: "Suporte básico",
    aiAssistance: "Assistência IA",
    prioritySupport: "Suporte prioritário",
    advancedAnalytics: "Análises avançadas",
    teamFeatures: "Recursos de equipe",
    customIntegrations: "Integrações personalizadas",

    // Testimonials
    testimonialsTitle: "O que nossos usuários dizem",
    testimonialsSubtitle: "Milhares de profissionais confiam no FutureTask",

    // Blog
    blogTitle: "Blog e recursos",
    blogSubtitle: "Dicas e estratégias para melhorar sua produtividade",
    latestPosts: "Últimas postagens",

    // Footer
    footerDescription: "A plataforma de produtividade mais avançada do mundo.",
    quickLinks: "Links rápidos",
    support: "Suporte",
    legal: "Legal",
    followUs: "Siga-nos",
    allRightsReserved: "Todos os direitos reservados.",

    // Authentication
    signInToAccount: "Entre na sua conta",
    createFreeAccount: "Crie sua conta gratuita",
    name: "Nome",
    email: "Email",
    password: "Senha",
    confirmPassword: "Confirmar senha",
    forgotPassword: "Esqueceu sua senha?",
    noAccountQuestion: "Não tem conta? Cadastre-se",
    hasAccountQuestion: "Já tem conta? Entre",
    createAccount: "Criar conta",

    // Demo Users
    demoUsersLabel: "Usuários demo:",

    // App Interface
    dashboard: "Painel",
    tasks: "Tarefas",
    calendar: "Calendário",
    notes: "Notas",
    wishlist: "Lista de desejos",
    ai: "IA",
    plan: "Plano",
    settings: "Configurações",
    profile: "Perfil",
    logout: "Sair",

    // User Plans
    yourCurrentPlan: "Seu plano atual",
    manageSubscription: "Gerencie sua assinatura e recursos",
    active: "Ativo",
    inactive: "Inativo",
    upgradeToPremium: "Atualizar para Premium",
    upgradeToPro: "Atualizar para Pro",

    // AI Credits
    aiCredits: "Créditos IA",
    buyAICredits: "Comprar créditos IA",
    creditsRemaining: "créditos restantes",

    // Errors
    invalidCredentials: "Credenciais inválidas",
    loginError: "Erro de login",
    createAccountError: "Erro ao criar conta",
    registrationError: "Erro de cadastro",

    // Success Messages
    welcomeBack: "Bem-vindo de volta!",
    accountCreated: "Conta criada com sucesso",

    // Common Actions
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    add: "Adicionar",
    remove: "Remover",
    update: "Atualizar",
    confirm: "Confirmar",

    // Time and Dates
    today: "Hoje",
    tomorrow: "Amanhã",
    yesterday: "Ontem",
    thisWeek: "Esta semana",
    nextWeek: "Próxima semana",
    thisMonth: "Este mês",
    nextMonth: "Próximo mês",
  },
}

export const supportedLanguages: Language[] = ["es", "en", "fr", "de", "it", "pt"]

export function getTranslation(language: Language, key: keyof Translations): string {
  return translations[language]?.[key] || translations["en"][key] || key
}

export function getTranslations(language: Language): Translations {
  return translations[language] || translations["en"]
}

export function isSupportedLanguage(language: string): language is Language {
  return supportedLanguages.includes(language as Language)
}

export function getLanguageName(language: Language): string {
  const names: Record<Language, string> = {
    es: "Español",
    en: "English",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    pt: "Português",
  }
  return names[language] || language
}

export function getLanguageFlag(language: Language): string {
  const flags: Record<Language, string> = {
    es: "🇪🇸",
    en: "🇺🇸",
    fr: "🇫🇷",
    de: "🇩🇪",
    it: "🇮🇹",
    pt: "🇵🇹",
  }
  return flags[language] || "🌐"
}
