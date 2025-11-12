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
    settings: "Settings",
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
    settings: "Configuración",
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
  },
}

export type Language = "en" | "es" | "fr" | "de" | "it"

export function useTranslation(lang: Language = "en") {
  return {
    t: (key: string) => {
      const keys = key.split(".")
      let value: any = translations[lang]
      for (const k of keys) {
        value = value?.[k]
      }
      return value || key
    },
    lang,
  }
}
