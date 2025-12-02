"use client"

export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    calendar: "Calendar",
    tasks: "Tasks",
    notes: "Notes",
    wishlist: "Wishlist",
    pomodoro: "Pomodoro",
    stats: "Statistics",
    ai: "AI Assistant",
    achievements: "Achievements",
    subscription: "Subscription",
    settings: "Settings", // Keep as string for menu
    logout: "Logout",

    // Auth
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    name: "Name",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    loading: "Loading...",
    error: "Error",
    success: "Success",

    // Calendar
    addTask: "Add Task",
    createNewTask: "Create New Task",
    editTask: "Edit Task",
    title: "Title",
    description: "Description",
    time: "Time",
    priority: "Priority",
    category: "Category",
    low: "Low",
    medium: "Medium",
    high: "High",
    personal: "Personal",
    work: "Work",
    study: "Study",
    health: "Health",
    finance: "Finance",
    createTask: "Create Task",
    updateTask: "Update Task",
    tasksFor: "Tasks for",
    noTasksForDay: "No tasks for this day",
    deleteConfirm: "Are you sure you want to delete this task?",
    enterTaskTitle: "Please enter a task title",
    dueDateTime: "Due Date & Time",
    enableNotifications: "Enable notifications to get reminders for your tasks",
    enable: "Enable",
    notificationsEnabled: "Notifications enabled - you'll be notified when tasks are due (keep tab open)",
    notificationsBlocked: "Notifications are blocked. To enable them:",
    notificationsInstructions:
      "Click the lock icon in your browser address bar, find Notifications and set it to Allow, then reload the page",

    // Tasks
    newTask: "New Task",
    allTasks: "All",
    activeTasks: "Active",
    completedTasks: "Completed",
    searchTasks: "Search tasks...",
    dueDate: "Due Date",
    dueTime: "Due Time",
    due: "Due",
    noTasksFound: "No tasks found",
    creating: "Creating...",
    updating: "Updating...",

    // Settings
    settingsPage: {
      theme: "Theme",
      selectTheme: "Select Theme",
      language: "Language",
      notifications: "Notifications",
      timezone: "Timezone",
      pomodoroSettings: "Pomodoro Settings",
      workDuration: "Work Duration (minutes)",
      shortBreak: "Short Break (minutes)",
      longBreak: "Long Break (minutes)",
      customThemeDescription: "Create your own theme by selecting two colors",
      primaryColor: "Primary Color",
      secondaryColor: "Secondary Color",
      upgradeForTheme: "Upgrade to {plan} to unlock this theme",
    },

    // Dashboard
    welcomeBack: "Welcome Back",
    quickOverview: "Quick Overview",
    recentActivity: "Recent Activity",
    upcomingTasks: "Upcoming Tasks",
    aiCreditsAvailable: "AI Credits Available",
    monthlyCredits: "Monthly Credits",
    purchasedCredits: "Purchased Credits",
    locked: "Locked",
    upgradeOrBuyCredits: "Upgrade or buy credit packs",

    // Subscription
    subscriptionManagement: "Subscription Management",
    currentPlan: "Current Plan",
    upgradePlan: "Upgrade Plan",
    creditPacks: "Credit Packs",
    buyCreditPacks: "Buy Credit Packs",
    neverExpire: "Never expire",
    includesVAT: "VAT included",
    comingSoon: "Coming Soon",
    paymentConfiguring: "Payment system is being configured",
    monthly: "Monthly",
    annual: "Annual",
    perMonth: "/month",
    perYear: "/year",

    // Pomodoro
    pomodoroTimer: "Pomodoro Timer",
    work: "Work",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    session: "Session",
    completedSessions: "Completed Sessions",

    // Wishlist
    myWishlist: "My Wishlist",
    addWish: "Add Wish",
    createNewWish: "Create New Wish",
    wishTitle: "Wish Title",
    wishDescription: "Description",
    price: "Price",
    url: "URL",

    // Notes
    myNotes: "My Notes",
    newNote: "New Note",
    createNote: "Create Note",
    editNote: "Edit Note",
    noteTitle: "Note Title",
    noteContent: "Content",

    // Statistics
    yourStatistics: "Your Statistics",
    tasksCompleted: "Tasks Completed",
    totalPomodoros: "Total Pomodoros",
    productivityScore: "Productivity Score",
    weeklyGoal: "Weekly Goal",

    // Achievements
    yourAchievements: "Your Achievements",
    unlocked: "Unlocked",
    locked: "Locked",
    progress: "Progress",

    // AI Assistant
    aiAssistant: "AI Assistant",
    askAnything: "Ask me anything...",
    send: "Send",
    creditsRemaining: "credits remaining",
    upgradeToAccess: "Upgrade to Premium or Pro to access AI Assistant",
    buyCredits: "Or buy credit packs",
  },
  es: {
    // Navigation
    dashboard: "Panel",
    calendar: "Calendario",
    tasks: "Tareas",
    notes: "Notas",
    wishlist: "Lista de deseos",
    pomodoro: "Pomodoro",
    stats: "Estadísticas",
    ai: "Asistente IA",
    achievements: "Logros",
    subscription: "Suscripción",
    settings: "Configuración", // Keep as string for menu
    logout: "Cerrar sesión",

    // Auth
    login: "Iniciar sesión",
    signup: "Registrarse",
    email: "Correo electrónico",
    password: "Contraseña",
    name: "Nombre",

    // Common
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Agregar",
    search: "Buscar",
    filter: "Filtrar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",

    // Calendar
    addTask: "Agregar Tarea",
    createNewTask: "Crear Nueva Tarea",
    editTask: "Editar Tarea",
    title: "Título",
    description: "Descripción",
    time: "Hora",
    priority: "Prioridad",
    category: "Categoría",
    low: "Baja",
    medium: "Media",
    high: "Alta",
    personal: "Personal",
    work: "Trabajo",
    study: "Estudio",
    health: "Salud",
    finance: "Finanzas",
    createTask: "Crear Tarea",
    updateTask: "Actualizar Tarea",
    tasksFor: "Tareas para",
    noTasksForDay: "No hay tareas para este día",
    deleteConfirm: "¿Estás seguro de que quieres eliminar esta tarea?",
    enterTaskTitle: "Por favor ingresa un título para la tarea",
    dueDateTime: "Fecha y Hora de Vencimiento",
    enableNotifications: "Habilita las notificaciones para recibir recordatorios de tus tareas",
    enable: "Habilitar",
    notificationsEnabled:
      "Notificaciones habilitadas - recibirás notificaciones cuando venzan las tareas (mantén la pestaña abierta)",
    notificationsBlocked: "Las notificaciones están bloqueadas. Para habilitarlas:",
    notificationsInstructions:
      "Haz clic en el icono del candado en la barra de direcciones, trouvez Notifications et configurez-le sur Autoriser, puis rechargez la page",

    // Tasks
    newTask: "Nueva Tarea",
    allTasks: "Todas",
    activeTasks: "Activas",
    completedTasks: "Completadas",
    searchTasks: "Buscar tareas...",
    dueDate: "Fecha de Vencimiento",
    dueTime: "Hora de Vencimiento",
    due: "Vence",
    noTasksFound: "No se encontraron tareas",
    creating: "Creando...",
    updating: "Actualizando...",

    // Settings
    settingsPage: {
      theme: "Tema",
      selectTheme: "Seleccionar Tema",
      language: "Idioma",
      notifications: "Notificaciones",
      timezone: "Zona Horaria",
      pomodoroSettings: "Configuración Pomodoro",
      workDuration: "Duración Trabajo (minutos)",
      shortBreak: "Descanso Corto (minutos)",
      longBreak: "Descanso Largo (minutos)",
      customThemeDescription: "Crea tu propio tema seleccionando dos colores",
      primaryColor: "Color Primario",
      secondaryColor: "Color Secundario",
      upgradeForTheme: "Actualiza a {plan} para desbloquear este tema",
    },

    // Dashboard
    welcomeBack: "Bienvenido de Nuevo",
    quickOverview: "Resumen Rápido",
    recentActivity: "Actividad Reciente",
    upcomingTasks: "Próximas Tareas",
    aiCreditsAvailable: "Créditos IA Disponibles",
    monthlyCredits: "Créditos Mensuales",
    purchasedCredits: "Créditos Comprados",
    locked: "Bloqueado",
    upgradeOrBuyCredits: "Mejora o compra packs de créditos",

    // Subscription
    subscriptionManagement: "Gestión de Suscripción",
    currentPlan: "Plan Actual",
    upgradePlan: "Mejorar Plan",
    creditPacks: "Packs de Créditos",
    buyCreditPacks: "Comprar Packs de Créditos",
    neverExpire: "Nunca caducan",
    includesVAT: "IVA incluido",
    comingSoon: "Próximamente",
    paymentConfiguring: "Sistema de pago en configuración",
    monthly: "Mensual",
    annual: "Anual",
    perMonth: "/mes",
    perYear: "/año",

    // Pomodoro
    pomodoroTimer: "Temporizador Pomodoro",
    work: "Trabajo",
    shortBreak: "Descanso Corto",
    longBreak: "Descanso Largo",
    start: "Iniciar",
    pause: "Pausar",
    reset: "Reiniciar",
    session: "Sesión",
    completedSessions: "Sesiones Completadas",

    // Wishlist
    myWishlist: "Mi Lista de Deseos",
    addWish: "Agregar Deseo",
    createNewWish: "Crear Nuevo Deseo",
    wishTitle: "Título del Deseo",
    wishDescription: "Descripción",
    price: "Precio",
    url: "URL",

    // Notes
    myNotes: "Mis Notas",
    newNote: "Nueva Nota",
    createNote: "Crear Nota",
    editNote: "Editar Nota",
    noteTitle: "Título de la Nota",
    noteContent: "Contenido",

    // Statistics
    yourStatistics: "Tus Estadísticas",
    tasksCompleted: "Tareas Completadas",
    totalPomodoros: "Total de Pomodoros",
    productivityScore: "Puntuación de Productividad",
    weeklyGoal: "Objetivo Semanal",

    // Achievements
    yourAchievements: "Tus Logros",
    unlocked: "Desbloqueado",
    locked: "Bloqueado",
    progress: "Progreso",

    // AI Assistant
    aiAssistant: "Asistente IA",
    askAnything: "Pregúntame cualquier cosa...",
    send: "Enviar",
    creditsRemaining: "créditos restantes",
    upgradeToAccess: "Mejora a Premium o Pro para acceder al Asistente IA",
    buyCredits: "O compra packs de créditos",
  },
  fr: {
    // Navigation
    dashboard: "Tableau de bord",
    calendar: "Calendrier",
    tasks: "Tâches",
    notes: "Notes",
    wishlist: "Liste de souhaits",
    pomodoro: "Pomodoro",
    stats: "Statistiques",
    ai: "Assistant IA",
    achievements: "Réalisations",
    subscription: "Abonnement",
    settings: "Paramètres",
    logout: "Déconnexion",

    // Auth
    login: "Connexion",
    signup: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    name: "Nom",

    // Common
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    search: "Rechercher",
    filter: "Filtrer",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",

    // Calendar
    addTask: "Ajouter une tâche",
    createNewTask: "Créer une nouvelle tâche",
    editTask: "Modifier la tâche",
    title: "Titre",
    description: "Description",
    time: "Heure",
    priority: "Priorité",
    category: "Catégorie",
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
    personal: "Personnel",
    work: "Travail",
    study: "Étude",
    health: "Santé",
    finance: "Finance",
    createTask: "Créer la tâche",
    updateTask: "Mettre à jour la tâche",
    tasksFor: "Tâches pour",
    noTasksForDay: "Aucune tâche pour ce jour",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette tâche?",
    enterTaskTitle: "Veuillez entrer un titre de tâche",
    dueDateTime: "Date et heure d'échéance",
    enableNotifications: "Activer les notifications pour recevoir des rappels pour vos tâches",
    enable: "Activer",
    notificationsEnabled:
      "Notifications activées - vous serez notifié lorsque les tâches sont dues (garder l'onglet ouvert)",
    notificationsBlocked: "Les notifications sont bloquées. Pour les activer:",
    notificationsInstructions:
      "Cliquez sur l'icône du cadenas dans la barre d'adresse, trouvez Notifications et configurez-le sur Autoriser, puis rechargez la page",

    // Tasks
    newTask: "Nouvelle tâche",
    allTasks: "Toutes",
    activeTasks: "Actives",
    completedTasks: "Terminées",
    searchTasks: "Rechercher des tâches...",
    dueDate: "Date d'échéance",
    dueTime: "Heure d'échéance",
    due: "Échéance",
    noTasksFound: "Aucune tâche trouvée",
    creating: "Création...",
    updating: "Mise à jour...",

    // Settings
    settingsPage: {
      theme: "Thème",
      selectTheme: "Sélectionner le thème",
      language: "Langue",
      notifications: "Notifications",
      timezone: "Fuseau horaire",
      pomodoroSettings: "Paramètres Pomodoro",
      workDuration: "Durée du travail (minutes)",
      shortBreak: "Pause courte (minutes)",
      longBreak: "Pause longue (minutes)",
      customThemeDescription: "Créez votre propre thème en sélectionnant deux couleurs",
      primaryColor: "Couleur primaire",
      secondaryColor: "Couleur secondaire",
      upgradeForTheme: "Passez à {plan} pour débloquer ce thème",
    },

    // Dashboard
    welcomeBack: "Bon Retour",
    quickOverview: "Aperçu Rapide",
    recentActivity: "Activité Récente",
    upcomingTasks: "Tâches à Venir",
    aiCreditsAvailable: "Crédits IA Disponibles",
    monthlyCredits: "Crédits Mensuels",
    purchasedCredits: "Crédits Achetés",
    locked: "Verrouillé",
    upgradeOrBuyCredits: "Améliorer ou acheter des packs de crédits",

    // Subscription
    subscriptionManagement: "Gestion de l'Abonnement",
    currentPlan: "Plan Actuel",
    upgradePlan: "Améliorer le Plan",
    creditPacks: "Packs de Crédits",
    buyCreditPacks: "Acheter des Packs de Crédits",
    neverExpire: "N'expirent jamais",
    includesVAT: "TVA incluse",
    comingSoon: "Bientôt Disponible",
    paymentConfiguring: "Système de paiement en configuration",
    monthly: "Mensuel",
    annual: "Annuel",
    perMonth: "/mois",
    perYear: "/an",

    // Pomodoro
    pomodoroTimer: "Minuteur Pomodoro",
    work: "Travail",
    shortBreak: "Pause Courte",
    longBreak: "Pause Longue",
    start: "Démarrer",
    pause: "Pause",
    reset: "Réinitialiser",
    session: "Session",
    completedSessions: "Sessions Terminées",

    // Wishlist
    myWishlist: "Ma Liste de Souhaits",
    addWish: "Ajouter un Souhait",
    createNewWish: "Créer un Nouveau Souhait",
    wishTitle: "Titre du Souhait",
    wishDescription: "Description",
    price: "Prix",
    url: "URL",

    // Notes
    myNotes: "Mes Notes",
    newNote: "Nouvelle Note",
    createNote: "Créer une Note",
    editNote: "Modifier la Note",
    noteTitle: "Titre de la Note",
    noteContent: "Contenu",

    // Statistics
    yourStatistics: "Vos Statistiques",
    tasksCompleted: "Tâches Terminées",
    totalPomodoros: "Total de Pomodoros",
    productivityScore: "Score de Productivité",
    weeklyGoal: "Objectif Hebdomadaire",

    // Achievements
    yourAchievements: "Vos Réalisations",
    unlocked: "Débloqué",
    locked: "Verrouillé",
    progress: "Progrès",

    // AI Assistant
    aiAssistant: "Assistant IA",
    askAnything: "Demandez-moi n'importe quoi...",
    send: "Envoyer",
    creditsRemaining: "crédits restants",
    upgradeToAccess: "Passez à Premium ou Pro pour accéder à l'Assistant IA",
    buyCredits: "Ou achetez des packs de crédits",
  },
  de: {
    // Navigation
    dashboard: "Dashboard",
    calendar: "Kalender",
    tasks: "Aufgaben",
    notes: "Notizen",
    wishlist: "Wunschliste",
    pomodoro: "Pomodoro",
    stats: "Statistiken",
    ai: "KI-Assistent",
    achievements: "Erfolge",
    subscription: "Abonnement",
    settings: "Einstellungen",
    logout: "Abmelden",

    // Auth
    login: "Anmelden",
    signup: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    name: "Name",

    // Common
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    search: "Suchen",
    filter: "Filtern",
    loading: "Lädt...",
    error: "Fehler",
    success: "Erfolg",

    // Calendar
    addTask: "Aufgabe hinzufügen",
    createNewTask: "Neue Aufgabe erstellen",
    editTask: "Aufgabe bearbeiten",
    title: "Titel",
    description: "Beschreibung",
    time: "Zeit",
    priority: "Priorität",
    category: "Kategorie",
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch",
    personal: "Persönlich",
    work: "Arbeit",
    study: "Studium",
    health: "Gesundheit",
    finance: "Finanzen",
    createTask: "Aufgabe erstellen",
    updateTask: "Aufgabe aktualisieren",
    tasksFor: "Aufgaben für",
    noTasksForDay: "Keine Aufgaben für diesen Tag",
    deleteConfirm: "Möchten Sie diese Aufgabe wirklich löschen?",
    enterTaskTitle: "Bitte geben Sie einen Aufgabentitel ein",
    dueDateTime: "Fälligkeitsdatum und -zeit",
    enableNotifications: "Aktivieren Sie Benachrichtigungen, um Erinnerungen für Ihre Aufgaben zu erhalten",
    enable: "Aktivieren",
    notificationsEnabled:
      "Benachrichtigungen aktiviert - Sie werden benachrichtigt, wenn Aufgaben fällig sind (Tab offen halten)",
    notificationsBlocked: "Benachrichtigungen sind blockiert. Um sie zu aktivieren:",
    notificationsInstructions:
      "Klicken Sie auf das Schlosssymbol in der Adressleiste, suchen Sie Benachrichtigungen und stellen Sie es auf Zulassen ein, dann laden Sie die Seite neu",

    // Tasks
    newTask: "Neue Aufgabe",
    allTasks: "Alle",
    activeTasks: "Aktiv",
    completedTasks: "Abgeschlossen",
    searchTasks: "Aufgaben suchen...",
    dueDate: "Fälligkeitsdatum",
    dueTime: "Fälligkeitszeit",
    due: "Fällig",
    noTasksFound: "Keine Aufgaben gefunden",
    creating: "Erstellen...",
    updating: "Aktualisieren...",

    // Settings
    settingsPage: {
      theme: "Thema",
      selectTheme: "Thema auswählen",
      language: "Sprache",
      notifications: "Benachrichtigungen",
      timezone: "Zeitzone",
      pomodoroSettings: "Pomodoro-Einstellungen",
      workDuration: "Arbeitsdauer (Minuten)",
      shortBreak: "Kurze Pause (Minuten)",
      longBreak: "Lange Pause (Minuten)",
      customThemeDescription: "Erstellen Sie Ihr eigenes Thema durch Auswahl von zwei Farben",
      primaryColor: "Primärfarbe",
      secondaryColor: "Sekundärfarbe",
      upgradeForTheme: "Upgrade auf {plan}, um dieses Thema freizuschalten",
    },

    // Dashboard
    welcomeBack: "Willkommen Zurück",
    quickOverview: "Schnellübersicht",
    recentActivity: "Letzte Aktivität",
    upcomingTasks: "Anstehende Aufgaben",
    aiCreditsAvailable: "Verfügbare KI-Credits",
    monthlyCredits: "Monatliche Credits",
    purchasedCredits: "Gekaufte Credits",
    locked: "Gesperrt",
    upgradeOrBuyCredits: "Upgraden oder Credit-Packs kaufen",

    // Subscription
    subscriptionManagement: "Abonnementverwaltung",
    currentPlan: "Aktueller Plan",
    upgradePlan: "Plan Upgraden",
    creditPacks: "Credit-Packs",
    buyCreditPacks: "Credit-Packs Kaufen",
    neverExpire: "Läuft nie ab",
    includesVAT: "inkl. MwSt.",
    comingSoon: "Demnächst",
    paymentConfiguring: "Zahlungssystem wird konfiguriert",
    monthly: "Monatlich",
    annual: "Jährlich",
    perMonth: "/Monat",
    perYear: "/Jahr",

    // Pomodoro
    pomodoroTimer: "Pomodoro-Timer",
    work: "Arbeit",
    shortBreak: "Kurze Pause",
    longBreak: "Lange Pause",
    start: "Start",
    pause: "Pause",
    reset: "Zurücksetzen",
    session: "Sitzung",
    completedSessions: "Abgeschlossene Sitzungen",

    // Wishlist
    myWishlist: "Meine Wunschliste",
    addWish: "Wunsch Hinzufügen",
    createNewWish: "Neuen Wunsch Erstellen",
    wishTitle: "Wunschtitel",
    wishDescription: "Beschreibung",
    price: "Preis",
    url: "URL",

    // Notes
    myNotes: "Meine Notizen",
    newNote: "Neue Notiz",
    createNote: "Notiz Erstellen",
    editNote: "Notiz Bearbeiten",
    noteTitle: "Notiztitel",
    noteContent: "Inhalt",

    // Statistics
    yourStatistics: "Ihre Statistiken",
    tasksCompleted: "Erledigte Aufgaben",
    totalPomodoros: "Gesamt-Pomodoros",
    productivityScore: "Produktivitätswert",
    weeklyGoal: "Wochenziel",

    // Achievements
    yourAchievements: "Ihre Erfolge",
    unlocked: "Freigeschaltet",
    locked: "Gesperrt",
    progress: "Fortschritt",

    // AI Assistant
    aiAssistant: "KI-Assistent",
    askAnything: "Frag mich alles...",
    send: "Senden",
    creditsRemaining: "Credits verbleibend",
    upgradeToAccess: "Upgrade auf Premium oder Pro für KI-Assistenten-Zugang",
    buyCredits: "Oder Credit-Packs kaufen",
  },
  it: {
    // Navigation
    dashboard: "Dashboard",
    calendar: "Calendario",
    tasks: "Attività",
    notes: "Note",
    wishlist: "Lista desideri",
    pomodoro: "Pomodoro",
    stats: "Statistiche",
    ai: "Assistente IA",
    achievements: "Successi",
    subscription: "Abbonamento",
    settings: "Impostazioni",
    logout: "Esci",

    // Auth
    login: "Accedi",
    signup: "Registrati",
    email: "Email",
    password: "Password",
    name: "Nome",

    // Common
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    edit: "Modifica",
    add: "Aggiungi",
    search: "Cerca",
    filter: "Filtra",
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",

    // Calendar
    addTask: "Aggiungi attività",
    createNewTask: "Crea nuova attività",
    editTask: "Modifica attività",
    title: "Titolo",
    description: "Descrizione",
    time: "Ora",
    priority: "Priorità",
    category: "Categoria",
    low: "Bassa",
    medium: "Media",
    high: "Alta",
    personal: "Personale",
    work: "Lavoro",
    study: "Studio",
    health: "Salute",
    finance: "Finanze",
    createTask: "Crea attività",
    updateTask: "Aggiorna attività",
    tasksFor: "Attività per",
    noTasksForDay: "Nessuna attività per questo giorno",
    deleteConfirm: "Sei sicuro di voler eliminare questa attività?",
    enterTaskTitle: "Inserisci un titolo per l'attività",
    dueDateTime: "Data e ora di scadenza",
    enableNotifications: "Abilita le notifiche per ricevere promemoria per le tue attività",
    enable: "Abilita",
    notificationsEnabled:
      "Notifiche abilitate - riceverai notifiche quando le attività scadono (mantieni la scheda aperta)",
    notificationsBlocked: "Le notifiche sono bloccate. Per abilitarle:",
    notificationsInstructions:
      "Fai clic sull'icona del lucchetto nella barra degli indirizzi, trova Notifiche e impostalo su Consenti, quindi ricarica la pagina",

    // Tasks
    newTask: "Nuova attività",
    allTasks: "Tutte",
    activeTasks: "Attive",
    completedTasks: "Completate",
    searchTasks: "Cerca attività...",
    dueDate: "Data di scadenza",
    dueTime: "Ora di scadenza",
    due: "Scadenza",
    noTasksFound: "Nessuna attività trovata",
    creating: "Creazione...",
    updating: "Aggiornamento...",

    // Settings
    settingsPage: {
      theme: "Tema",
      selectTheme: "Seleziona tema",
      language: "Lingua",
      notifications: "Notifiche",
      timezone: "Fuso orario",
      pomodoroSettings: "Impostazioni Pomodoro",
      workDuration: "Durata lavoro (minuti)",
      shortBreak: "Pausa breve (minuti)",
      longBreak: "Pausa lunga (minuti)",
      customThemeDescription: "Crea il tuo tema selezionando due colori",
      primaryColor: "Colore primario",
      secondaryColor: "Colore secondario",
      upgradeForTheme: "Passa a {plan} per sbloccare questo tema",
    },

    // Dashboard
    welcomeBack: "Bentornato",
    quickOverview: "Panoramica Rapida",
    recentActivity: "Attività Recente",
    upcomingTasks: "Attività in Arrivo",
    aiCreditsAvailable: "Crediti IA Disponibili",
    monthlyCredits: "Crediti Mensili",
    purchasedCredits: "Crediti Acquistati",
    locked: "Bloccato",
    upgradeOrBuyCredits: "Aggiorna o acquista pacchetti di crediti",

    // Subscription
    subscriptionManagement: "Gestione Abbonamento",
    currentPlan: "Piano Attuale",
    upgradePlan: "Aggiorna Piano",
    creditPacks: "Pacchetti di Crediti",
    buyCreditPacks: "Acquista Pacchetti di Crediti",
    neverExpire: "Non scadono mai",
    includesVAT: "IVA inclusa",
    comingSoon: "Prossimamente",
    paymentConfiguring: "Sistema di pagamento in configurazione",
    monthly: "Mensile",
    annual: "Annuale",
    perMonth: "/mese",
    perYear: "/anno",

    // Pomodoro
    pomodoroTimer: "Timer Pomodoro",
    work: "Lavoro",
    shortBreak: "Pausa Breve",
    longBreak: "Pausa Lunga",
    start: "Avvia",
    pause: "Pausa",
    reset: "Reimposta",
    session: "Sessione",
    completedSessions: "Sessioni Completate",

    // Wishlist
    myWishlist: "La Mia Lista Desideri",
    addWish: "Aggiungi Desiderio",
    createNewWish: "Crea Nuovo Desiderio",
    wishTitle: "Titolo Desiderio",
    wishDescription: "Descrizione",
    price: "Prezzo",
    url: "URL",

    // Notes
    myNotes: "Le Mie Note",
    newNote: "Nuova Nota",
    createNote: "Crea Nota",
    editNote: "Modifica Nota",
    noteTitle: "Titolo Nota",
    noteContent: "Contenuto",

    // Statistics
    yourStatistics: "Le Tue Statistiche",
    tasksCompleted: "Attività Completate",
    totalPomodoros: "Pomodoros Totali",
    productivityScore: "Punteggio di Produttività",
    weeklyGoal: "Obiettivo Settimanale",

    // Achievements
    yourAchievements: "I Tuoi Successi",
    unlocked: "Sbloccato",
    locked: "Bloccato",
    progress: "Progresso",

    // AI Assistant
    aiAssistant: "Assistente IA",
    askAnything: "Chiedimi qualsiasi cosa...",
    send: "Invia",
    creditsRemaining: "crediti rimanenti",
    upgradeToAccess: "Passa a Premium o Pro per accedere all'Assistente IA",
    buyCredits: "O acquista pacchetti di crediti",
  },
} as const

export type Language = "en" | "es" | "fr" | "de" | "it"

import { useContext } from "react"
import { LanguageContext } from "@/contexts/language-context"

export function useTranslation(lang?: Language) {
  const context = useContext(LanguageContext)

  // Use context language if available, otherwise fallback to provided lang or 'en'
  const currentLang = context?.language || lang || "en"

  const t = (key: string) => {
    const keys = key.split(".")
    let value: any = translations[currentLang]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return { t, language: currentLang }
}
