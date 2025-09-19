export type Language = "es" | "en" | "fr" | "de" | "it" | "pt"

export interface Translations {
  // Navigation
  features: string
  pricing: string
  about: string
  blog: string
  login: string
  getStarted: string

  // Hero Section
  heroTitle: string
  heroSubtitle: string
  startFree: string
  watchDemo: string

  // Features
  featuresTitle: string
  featuresSubtitle: string
  taskManagement: string
  taskManagementDesc: string
  smartCalendar: string
  smartCalendarDesc: string
  aiAssistant: string
  aiAssistantDesc: string
  notesTaking: string
  notesTakingDesc: string
  analytics: string
  analyticsDesc: string
  collaboration: string
  collaborationDesc: string

  // Pricing
  pricingTitle: string
  pricingSubtitle: string
  free: string
  premium: string
  pro: string
  freePrice: string
  premiumPrice: string
  proPrice: string
  perMonth: string
  mostPopular: string
  choosePlan: string

  // Testimonials
  testimonialsTitle: string
  testimonialsSubtitle: string
  testimonial1: string
  testimonial1Author: string
  testimonial1Role: string
  testimonial2: string
  testimonial2Author: string
  testimonial2Role: string
  testimonial3: string
  testimonial3Author: string
  testimonial3Role: string

  // Blog
  blogTitle: string
  blogSubtitle: string
  blogPost1Title: string
  blogPost1Excerpt: string
  blogPost2Title: string
  blogPost2Excerpt: string
  blogPost3Title: string
  blogPost3Excerpt: string
  readMore: string

  // Basic translations for components that can't use the hook
  loading: string
  error: string
  success: string
  cancel: string
  save: string
  delete: string
  edit: string
  add: string
  close: string
  confirm: string
}

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
]

const translations: Record<Language, Translations> = {
  es: {
    // Navigation
    features: "Características",
    pricing: "Precios",
    about: "Acerca de",
    blog: "Blog",
    login: "Iniciar Sesión",
    getStarted: "Comenzar",

    // Hero Section
    heroTitle: "Organiza tu vida con IA",
    heroSubtitle:
      "La plataforma de productividad más avanzada del 2025. Gestiona tareas, calendario y notas con inteligencia artificial.",
    startFree: "Comenzar Gratis",
    watchDemo: "Ver Demo",

    // Features
    featuresTitle: "Características Poderosas",
    featuresSubtitle: "Todo lo que necesitas para ser más productivo en un solo lugar",
    taskManagement: "Gestión de Tareas",
    taskManagementDesc: "Organiza y prioriza tus tareas con IA que aprende de tus patrones de trabajo",
    smartCalendar: "Calendario Inteligente",
    smartCalendarDesc: "Planifica tu tiempo de manera eficiente con sugerencias automáticas",
    aiAssistant: "Asistente IA",
    aiAssistantDesc: "Obtén ayuda instantánea para planificar, organizar y optimizar tu día",
    notesTaking: "Notas Inteligentes",
    notesTakingDesc: "Captura y organiza ideas con búsqueda avanzada y categorización automática",
    analytics: "Análisis Detallado",
    analyticsDesc: "Comprende tus patrones de productividad con informes detallados",
    collaboration: "Colaboración",
    collaborationDesc: "Trabaja en equipo con herramientas de colaboración en tiempo real",

    // Pricing
    pricingTitle: "Planes para Todos",
    pricingSubtitle: "Elige el plan perfecto para tus necesidades",
    free: "Gratis",
    premium: "Premium",
    pro: "Pro",
    freePrice: "€0",
    premiumPrice: "€1.99",
    proPrice: "€4.99",
    perMonth: "/mes",
    mostPopular: "Más Popular",
    choosePlan: "Elegir Plan",

    // Testimonials
    testimonialsTitle: "Lo que dicen nuestros usuarios",
    testimonialsSubtitle: "Miles de profesionales ya confían en FutureTask",
    testimonial1:
      "FutureTask ha revolucionado mi forma de trabajar. La IA realmente entiende mis necesidades y me ayuda a ser más eficiente cada día.",
    testimonial1Author: "María González",
    testimonial1Role: "Directora de Marketing",
    testimonial2:
      "Como freelancer, necesitaba una herramienta que me ayudara a gestionar múltiples proyectos. FutureTask es perfecta para eso.",
    testimonial2Author: "Carlos Rodríguez",
    testimonial2Role: "Desarrollador Freelance",
    testimonial3:
      "La integración de IA en la gestión de tareas es impresionante. No puedo imaginar trabajar sin FutureTask ahora.",
    testimonial3Author: "Ana Martín",
    testimonial3Role: "Consultora de Negocios",

    // Blog
    blogTitle: "Últimas Noticias",
    blogSubtitle: "Consejos, trucos y novedades sobre productividad",
    blogPost1Title: "10 Estrategias para Maximizar tu Productividad en 2025",
    blogPost1Excerpt:
      "Descubre las técnicas más efectivas para ser más productivo en el nuevo año con herramientas de IA.",
    blogPost2Title: "El Futuro del Trabajo Remoto: Cómo la IA está Transformando Equipos",
    blogPost2Excerpt:
      "Explora cómo la inteligencia artificial está revolucionando la colaboración y gestión de equipos remotos.",
    blogPost3Title: "Organización Personal en la Era Digital: Guía Completa 2025",
    blogPost3Excerpt:
      "Una guía completa para organizar tu vida digital y personal usando las mejores herramientas y técnicas.",
    readMore: "Leer Más",

    // Basic translations for components that can't use the hook
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    cancel: "Cancelar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Añadir",
    close: "Cerrar",
    confirm: "Confirmar",
  },
  en: {
    // Navigation
    features: "Features",
    pricing: "Pricing",
    about: "About",
    blog: "Blog",
    login: "Login",
    getStarted: "Get Started",

    // Hero Section
    heroTitle: "Organize your life with AI",
    heroSubtitle:
      "The most advanced productivity platform of 2025. Manage tasks, calendar and notes with artificial intelligence.",
    startFree: "Start Free",
    watchDemo: "Watch Demo",

    // Features
    featuresTitle: "Powerful Features",
    featuresSubtitle: "Everything you need to be more productive in one place",
    taskManagement: "Task Management",
    taskManagementDesc: "Organize and prioritize your tasks with AI that learns from your work patterns",
    smartCalendar: "Smart Calendar",
    smartCalendarDesc: "Plan your time efficiently with automatic suggestions",
    aiAssistant: "AI Assistant",
    aiAssistantDesc: "Get instant help to plan, organize and optimize your day",
    notesTaking: "Smart Notes",
    notesTakingDesc: "Capture and organize ideas with advanced search and automatic categorization",
    analytics: "Detailed Analytics",
    analyticsDesc: "Understand your productivity patterns with detailed reports",
    collaboration: "Collaboration",
    collaborationDesc: "Work as a team with real-time collaboration tools",

    // Pricing
    pricingTitle: "Plans for Everyone",
    pricingSubtitle: "Choose the perfect plan for your needs",
    free: "Free",
    premium: "Premium",
    pro: "Pro",
    freePrice: "$0",
    premiumPrice: "$1.99",
    proPrice: "$4.99",
    perMonth: "/month",
    mostPopular: "Most Popular",
    choosePlan: "Choose Plan",

    // Testimonials
    testimonialsTitle: "What our users say",
    testimonialsSubtitle: "Thousands of professionals already trust FutureTask",
    testimonial1:
      "FutureTask has revolutionized the way I work. The AI really understands my needs and helps me be more efficient every day.",
    testimonial1Author: "Maria Gonzalez",
    testimonial1Role: "Marketing Director",
    testimonial2:
      "As a freelancer, I needed a tool to help me manage multiple projects. FutureTask is perfect for that.",
    testimonial2Author: "Carlos Rodriguez",
    testimonial2Role: "Freelance Developer",
    testimonial3:
      "The AI integration in task management is impressive. I can't imagine working without FutureTask now.",
    testimonial3Author: "Ana Martin",
    testimonial3Role: "Business Consultant",

    // Blog
    blogTitle: "Latest News",
    blogSubtitle: "Tips, tricks and news about productivity",
    blogPost1Title: "10 Strategies to Maximize Your Productivity in 2025",
    blogPost1Excerpt: "Discover the most effective techniques to be more productive in the new year with AI tools.",
    blogPost2Title: "The Future of Remote Work: How AI is Transforming Teams",
    blogPost2Excerpt:
      "Explore how artificial intelligence is revolutionizing collaboration and remote team management.",
    blogPost3Title: "Personal Organization in the Digital Age: Complete Guide 2025",
    blogPost3Excerpt:
      "A complete guide to organize your digital and personal life using the best tools and techniques.",
    readMore: "Read More",

    // Basic translations for components that can't use the hook
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    close: "Close",
    confirm: "Confirm",
  },
  fr: {
    // Navigation
    features: "Fonctionnalités",
    pricing: "Tarifs",
    about: "À propos",
    blog: "Blog",
    login: "Connexion",
    getStarted: "Commencer",

    // Hero Section
    heroTitle: "Organisez votre vie avec l'IA",
    heroSubtitle:
      "La plateforme de productivité la plus avancée de 2025. Gérez tâches, calendrier et notes avec l'intelligence artificielle.",
    startFree: "Commencer Gratuitement",
    watchDemo: "Voir la Démo",

    // Features
    featuresTitle: "Fonctionnalités Puissantes",
    featuresSubtitle: "Tout ce dont vous avez besoin pour être plus productif en un seul endroit",
    taskManagement: "Gestion des Tâches",
    taskManagementDesc: "Organisez et priorisez vos tâches avec une IA qui apprend de vos habitudes de travail",
    smartCalendar: "Calendrier Intelligent",
    smartCalendarDesc: "Planifiez votre temps efficacement avec des suggestions automatiques",
    aiAssistant: "Assistant IA",
    aiAssistantDesc: "Obtenez une aide instantanée pour planifier, organiser et optimiser votre journée",
    notesTaking: "Notes Intelligentes",
    notesTakingDesc: "Capturez et organisez vos idées avec recherche avancée et catégorisation automatique",
    analytics: "Analyses Détaillées",
    analyticsDesc: "Comprenez vos modèles de productivité avec des rapports détaillés",
    collaboration: "Collaboration",
    collaborationDesc: "Travaillez en équipe avec des outils de collaboration en temps réel",

    // Pricing
    pricingTitle: "Plans pour Tous",
    pricingSubtitle: "Choisissez le plan parfait pour vos besoins",
    free: "Gratuit",
    premium: "Premium",
    pro: "Pro",
    freePrice: "0€",
    premiumPrice: "1,99€",
    proPrice: "4,99€",
    perMonth: "/mois",
    mostPopular: "Le Plus Populaire",
    choosePlan: "Choisir le Plan",

    // Testimonials
    testimonialsTitle: "Ce que disent nos utilisateurs",
    testimonialsSubtitle: "Des milliers de professionnels font déjà confiance à FutureTask",
    testimonial1:
      "FutureTask a révolutionné ma façon de travailler. L'IA comprend vraiment mes besoins et m'aide à être plus efficace chaque jour.",
    testimonial1Author: "Maria Gonzalez",
    testimonial1Role: "Directrice Marketing",
    testimonial2:
      "En tant que freelance, j'avais besoin d'un outil pour m'aider à gérer plusieurs projets. FutureTask est parfait pour cela.",
    testimonial2Author: "Carlos Rodriguez",
    testimonial2Role: "Développeur Freelance",
    testimonial3:
      "L'intégration de l'IA dans la gestion des tâches est impressionnante. Je ne peux plus imaginer travailler sans FutureTask.",
    testimonial3Author: "Ana Martin",
    testimonial3Role: "Consultante en Affaires",

    // Blog
    blogTitle: "Dernières Nouvelles",
    blogSubtitle: "Conseils, astuces et actualités sur la productivité",
    blogPost1Title: "10 Stratégies pour Maximiser votre Productivité en 2025",
    blogPost1Excerpt:
      "Découvrez les techniques les plus efficaces pour être plus productif dans la nouvelle année avec les outils IA.",
    blogPost2Title: "L'Avenir du Travail à Distance: Comment l'IA Transforme les Équipes",
    blogPost2Excerpt:
      "Explorez comment l'intelligence artificielle révolutionne la collaboration et la gestion d'équipes à distance.",
    blogPost3Title: "Organisation Personnelle à l'Ère Numérique: Guide Complet 2025",
    blogPost3Excerpt:
      "Un guide complet pour organiser votre vie numérique et personnelle en utilisant les meilleurs outils et techniques.",
    readMore: "Lire Plus",

    // Basic translations for components that can't use the hook
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    cancel: "Annuler",
    save: "Enregistrer",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    close: "Fermer",
    confirm: "Confirmer",
  },
  de: {
    // Navigation
    features: "Funktionen",
    pricing: "Preise",
    about: "Über uns",
    blog: "Blog",
    login: "Anmelden",
    getStarted: "Loslegen",

    // Hero Section
    heroTitle: "Organisieren Sie Ihr Leben mit KI",
    heroSubtitle:
      "Die fortschrittlichste Produktivitätsplattform von 2025. Verwalten Sie Aufgaben, Kalender und Notizen mit künstlicher Intelligenz.",
    startFree: "Kostenlos Starten",
    watchDemo: "Demo Ansehen",

    // Features
    featuresTitle: "Mächtige Funktionen",
    featuresSubtitle: "Alles was Sie brauchen, um produktiver zu sein, an einem Ort",
    taskManagement: "Aufgabenverwaltung",
    taskManagementDesc: "Organisieren und priorisieren Sie Ihre Aufgaben mit KI, die aus Ihren Arbeitsmustern lernt",
    smartCalendar: "Intelligenter Kalender",
    smartCalendarDesc: "Planen Sie Ihre Zeit effizient mit automatischen Vorschlägen",
    aiAssistant: "KI-Assistent",
    aiAssistantDesc: "Erhalten Sie sofortige Hilfe beim Planen, Organisieren und Optimieren Ihres Tages",
    notesTaking: "Intelligente Notizen",
    notesTakingDesc: "Erfassen und organisieren Sie Ideen mit erweiterter Suche und automatischer Kategorisierung",
    analytics: "Detaillierte Analysen",
    analyticsDesc: "Verstehen Sie Ihre Produktivitätsmuster mit detaillierten Berichten",
    collaboration: "Zusammenarbeit",
    collaborationDesc: "Arbeiten Sie im Team mit Echtzeit-Kollaborationstools",

    // Pricing
    pricingTitle: "Pläne für Jeden",
    pricingSubtitle: "Wählen Sie den perfekten Plan für Ihre Bedürfnisse",
    free: "Kostenlos",
    premium: "Premium",
    pro: "Pro",
    freePrice: "0€",
    premiumPrice: "1,99€",
    proPrice: "4,99€",
    perMonth: "/Monat",
    mostPopular: "Am Beliebtesten",
    choosePlan: "Plan Wählen",

    // Testimonials
    testimonialsTitle: "Was unsere Nutzer sagen",
    testimonialsSubtitle: "Tausende von Fachleuten vertrauen bereits auf FutureTask",
    testimonial1:
      "FutureTask hat meine Arbeitsweise revolutioniert. Die KI versteht wirklich meine Bedürfnisse und hilft mir, jeden Tag effizienter zu sein.",
    testimonial1Author: "Maria Gonzalez",
    testimonial1Role: "Marketing-Direktorin",
    testimonial2:
      "Als Freelancer brauchte ich ein Tool, das mir bei der Verwaltung mehrerer Projekte hilft. FutureTask ist perfekt dafür.",
    testimonial2Author: "Carlos Rodriguez",
    testimonial2Role: "Freelance-Entwickler",
    testimonial3:
      "Die KI-Integration im Aufgabenmanagement ist beeindruckend. Ich kann mir nicht vorstellen, ohne FutureTask zu arbeiten.",
    testimonial3Author: "Ana Martin",
    testimonial3Role: "Unternehmensberaterin",

    // Blog
    blogTitle: "Neueste Nachrichten",
    blogSubtitle: "Tipps, Tricks und Neuigkeiten über Produktivität",
    blogPost1Title: "10 Strategien zur Maximierung Ihrer Produktivität in 2025",
    blogPost1Excerpt: "Entdecken Sie die effektivsten Techniken, um im neuen Jahr mit KI-Tools produktiver zu sein.",
    blogPost2Title: "Die Zukunft der Remote-Arbeit: Wie KI Teams Transformiert",
    blogPost2Excerpt:
      "Erkunden Sie, wie künstliche Intelligenz die Zusammenarbeit und das Management von Remote-Teams revolutioniert.",
    blogPost3Title: "Persönliche Organisation im Digitalen Zeitalter: Vollständiger Leitfaden 2025",
    blogPost3Excerpt:
      "Ein vollständiger Leitfaden zur Organisation Ihres digitalen und persönlichen Lebens mit den besten Tools und Techniken.",
    readMore: "Mehr Lesen",

    // Basic translations for components that can't use the hook
    loading: "Laden...",
    error: "Fehler",
    success: "Erfolg",
    cancel: "Abbrechen",
    save: "Speichern",
    delete: "Löschen",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    close: "Schließen",
    confirm: "Bestätigen",
  },
  it: {
    // Navigation
    features: "Caratteristiche",
    pricing: "Prezzi",
    about: "Chi siamo",
    blog: "Blog",
    login: "Accedi",
    getStarted: "Inizia",

    // Hero Section
    heroTitle: "Organizza la tua vita con l'IA",
    heroSubtitle:
      "La piattaforma di produttività più avanzata del 2025. Gestisci attività, calendario e note con intelligenza artificiale.",
    startFree: "Inizia Gratis",
    watchDemo: "Guarda Demo",

    // Features
    featuresTitle: "Caratteristiche Potenti",
    featuresSubtitle: "Tutto ciò di cui hai bisogno per essere più produttivo in un unico posto",
    taskManagement: "Gestione Attività",
    taskManagementDesc: "Organizza e dai priorità alle tue attività con IA che impara dai tuoi modelli di lavoro",
    smartCalendar: "Calendario Intelligente",
    smartCalendarDesc: "Pianifica il tuo tempo in modo efficiente con suggerimenti automatici",
    aiAssistant: "Assistente IA",
    aiAssistantDesc: "Ottieni aiuto istantaneo per pianificare, organizzare e ottimizzare la tua giornata",
    notesTaking: "Note Intelligenti",
    notesTakingDesc: "Cattura e organizza idee con ricerca avanzata e categorizzazione automatica",
    analytics: "Analisi Dettagliate",
    analyticsDesc: "Comprendi i tuoi modelli di produttività con report dettagliati",
    collaboration: "Collaborazione",
    collaborationDesc: "Lavora in team con strumenti di collaborazione in tempo reale",

    // Pricing
    pricingTitle: "Piani per Tutti",
    pricingSubtitle: "Scegli il piano perfetto per le tue esigenze",
    free: "Gratuito",
    premium: "Premium",
    pro: "Pro",
    freePrice: "€0",
    premiumPrice: "€1,99",
    proPrice: "€4,99",
    perMonth: "/mese",
    mostPopular: "Più Popolare",
    choosePlan: "Scegli Piano",

    // Testimonials
    testimonialsTitle: "Cosa dicono i nostri utenti",
    testimonialsSubtitle: "Migliaia di professionisti si fidano già di FutureTask",
    testimonial1:
      "FutureTask ha rivoluzionato il mio modo di lavorare. L'IA capisce davvero le mie esigenze e mi aiuta ad essere più efficiente ogni giorno.",
    testimonial1Author: "Maria Gonzalez",
    testimonial1Role: "Direttrice Marketing",
    testimonial2:
      "Come freelancer, avevo bisogno di uno strumento per aiutarmi a gestire più progetti. FutureTask è perfetto per questo.",
    testimonial2Author: "Carlos Rodriguez",
    testimonial2Role: "Sviluppatore Freelance",
    testimonial3:
      "L'integrazione dell'IA nella gestione delle attività è impressionante. Non riesco a immaginare di lavorare senza FutureTask ora.",
    testimonial3Author: "Ana Martin",
    testimonial3Role: "Consulente Aziendale",

    // Blog
    blogTitle: "Ultime Notizie",
    blogSubtitle: "Consigli, trucchi e novità sulla produttività",
    blogPost1Title: "10 Strategie per Massimizzare la tua Produttività nel 2025",
    blogPost1Excerpt: "Scopri le tecniche più efficaci per essere più produttivo nel nuovo anno con strumenti IA.",
    blogPost2Title: "Il Futuro del Lavoro Remoto: Come l'IA sta Trasformando i Team",
    blogPost2Excerpt:
      "Esplora come l'intelligenza artificiale sta rivoluzionando la collaborazione e la gestione di team remoti.",
    blogPost3Title: "Organizzazione Personale nell'Era Digitale: Guida Completa 2025",
    blogPost3Excerpt:
      "Una guida completa per organizzare la tua vita digitale e personale usando i migliori strumenti e tecniche.",
    readMore: "Leggi di Più",

    // Basic translations for components that can't use the hook
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",
    cancel: "Annulla",
    save: "Salva",
    delete: "Elimina",
    edit: "Modifica",
    add: "Aggiungi",
    close: "Chiudi",
    confirm: "Conferma",
  },
  pt: {
    // Navigation
    features: "Recursos",
    pricing: "Preços",
    about: "Sobre",
    blog: "Blog",
    login: "Entrar",
    getStarted: "Começar",

    // Hero Section
    heroTitle: "Organize sua vida com IA",
    heroSubtitle:
      "A plataforma de produtividade mais avançada de 2025. Gerencie tarefas, calendário e notas com inteligência artificial.",
    startFree: "Começar Grátis",
    watchDemo: "Ver Demo",

    // Features
    featuresTitle: "Recursos Poderosos",
    featuresSubtitle: "Tudo que você precisa para ser mais produtivo em um só lugar",
    taskManagement: "Gestão de Tarefas",
    taskManagementDesc: "Organize e priorize suas tarefas com IA que aprende com seus padrões de trabalho",
    smartCalendar: "Calendário Inteligente",
    smartCalendarDesc: "Planeje seu tempo eficientemente com sugestões automáticas",
    aiAssistant: "Assistente IA",
    aiAssistantDesc: "Obtenha ajuda instantânea para planejar, organizar e otimizar seu dia",
    notesTaking: "Notas Inteligentes",
    notesTakingDesc: "Capture e organize ideias com busca avançada e categorização automática",
    analytics: "Análises Detalhadas",
    analyticsDesc: "Entenda seus padrões de produtividade com relatórios detalhados",
    collaboration: "Colaboração",
    collaborationDesc: "Trabalhe em equipe com ferramentas de colaboração em tempo real",

    // Pricing
    pricingTitle: "Planos para Todos",
    pricingSubtitle: "Escolha o plano perfeito para suas necessidades",
    free: "Grátis",
    premium: "Premium",
    pro: "Pro",
    freePrice: "R$0",
    premiumPrice: "R$9,99",
    proPrice: "R$24,99",
    perMonth: "/mês",
    mostPopular: "Mais Popular",
    choosePlan: "Escolher Plano",

    // Testimonials
    testimonialsTitle: "O que nossos usuários dizem",
    testimonialsSubtitle: "Milhares de profissionais já confiam no FutureTask",
    testimonial1:
      "FutureTask revolucionou minha forma de trabalhar. A IA realmente entende minhas necessidades e me ajuda a ser mais eficiente todos os dias.",
    testimonial1Author: "Maria Gonzalez",
    testimonial1Role: "Diretora de Marketing",
    testimonial2:
      "Como freelancer, precisava de uma ferramenta para me ajudar a gerenciar múltiplos projetos. FutureTask é perfeito para isso.",
    testimonial2Author: "Carlos Rodriguez",
    testimonial2Role: "Desenvolvedor Freelancer",
    testimonial3:
      "A integração de IA no gerenciamento de tarefas é impressionante. Não consigo imaginar trabalhar sem FutureTask agora.",
    testimonial3Author: "Ana Martin",
    testimonial3Role: "Consultora de Negócios",

    // Blog
    blogTitle: "Últimas Notícias",
    blogSubtitle: "Dicas, truques e novidades sobre produtividade",
    blogPost1Title: "10 Estratégias para Maximizar sua Produtividade em 2025",
    blogPost1Excerpt: "Descubra as técnicas mais eficazes para ser mais produtivo no novo ano com ferramentas de IA.",
    blogPost2Title: "O Futuro do Trabalho Remoto: Como a IA está Transformando Equipes",
    blogPost2Excerpt:
      "Explore como a inteligência artificial está revolucionando a colaboração e gestão de equipes remotas.",
    blogPost3Title: "Organização Pessoal na Era Digital: Guia Completo 2025",
    blogPost3Excerpt:
      "Um guia completo para organizar sua vida digital e pessoal usando as melhores ferramentas e técnicas.",
    readMore: "Ler Mais",

    // Basic translations for components that can't use the hook
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    cancel: "Cancelar",
    save: "Salvar",
    delete: "Excluir",
    edit: "Editar",
    add: "Adicionar",
    close: "Fechar",
    confirm: "Confirmar",
  },
}

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.es
}

export function isSupportedLanguage(lang: string): lang is Language {
  return ["es", "en", "fr", "de", "it", "pt"].includes(lang)
}

export function getTranslation(key: string, language: Language = "es"): string {
  const translations = getTranslations(language)
  return translations[key] || key
}

export default { languages, getTranslation }
