"use client"

import { useState, useEffect, useCallback } from "react"

interface Language {
  code: "en" | "es" | "fr" | "de" | "it"
  name: string
  flag: string
}

const availableLanguages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
]

// Simplified translations object
const translations = {
  en: {
    common: {
      appName: "FutureTask",
      loading: "Loading...",
      success: "Success",
      error: "Error",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      copy: "Copy",
      search: "Search...",
      filter: "Filter",
      upgrade: "Upgrade",
      premium: "Premium",
      time: "Time",
      today: "Today",
      week: "Week",
      month: "Month",
      enabled: "Enabled",
      update: "Update",
    },
    navigation: {
      tasks: "Tasks",
      calendar: "Calendar",
      settings: "Settings",
    },
    tasks: {
      addTask: "Add Task",
      editTask: "Edit Task",
      createTask: "Create Task",
      updateTask: "Update Task",
      deleteTask: "Delete Task",
      title: "Title",
      description: "Description",
      category: "Category",
      priority: "Priority",
      dueDate: "Due Date",
      completed: "Completed",
      todayTasks: "Today's Tasks",
      noTasks: "No tasks found",
      createFirst: "Create your first task to get started.",
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    categories: {
      work: "Work",
      personal: "Personal",
      health: "Health",
      learning: "Learning",
      fitness: "Fitness",
      social: "Social",
      creative: "Creative",
      home: "Home",
    },
    settings: {
      general: "General",
      appearance: "Appearance",
      notifications: "Notifications",
      account: "Account",
      language: "Language",
      sound: "Sound Effects",
      theme: "Theme",
    },
    premium: {
      upgrade: "Upgrade to Premium",
      features: "Premium Features",
    },
    pomodoro: {
      timer: "Pomodoro Timer",
      completed: "Session completed!",
      break: "Break completed!",
    },
    auth: {
      signOut: "Sign Out",
    },
  },
  es: {
    common: {
      appName: "FutureTask",
      loading: "Cargando...",
      success: "Éxito",
      error: "Error",
      cancel: "Cancelar",
      save: "Guardar",
      edit: "Editar",
      delete: "Eliminar",
      copy: "Copiar",
      search: "Buscar...",
      filter: "Filtrar",
      upgrade: "Actualizar",
      premium: "Premium",
      time: "Hora",
      today: "Hoy",
      week: "Semana",
      month: "Mes",
      enabled: "Habilitado",
      update: "Actualizar",
    },
    navigation: {
      tasks: "Tareas",
      calendar: "Calendario",
      settings: "Configuración",
    },
    tasks: {
      addTask: "Añadir Tarea",
      editTask: "Editar Tarea",
      createTask: "Crear Tarea",
      updateTask: "Actualizar Tarea",
      deleteTask: "Eliminar Tarea",
      title: "Título",
      description: "Descripción",
      category: "Categoría",
      priority: "Prioridad",
      dueDate: "Fecha Límite",
      completed: "Completada",
      todayTasks: "Tareas de Hoy",
      noTasks: "No se encontraron tareas",
      createFirst: "Crea tu primera tarea para empezar.",
      low: "Baja",
      medium: "Media",
      high: "Alta",
    },
    categories: {
      work: "Trabajo",
      personal: "Personal",
      health: "Salud",
      learning: "Aprendizaje",
      fitness: "Ejercicio",
      social: "Social",
      creative: "Creativo",
      home: "Hogar",
    },
    settings: {
      general: "General",
      appearance: "Apariencia",
      notifications: "Notificaciones",
      account: "Cuenta",
      language: "Idioma",
      sound: "Efectos de Sonido",
      theme: "Tema",
    },
    premium: {
      upgrade: "Actualizar a Premium",
      features: "Características Premium",
    },
    pomodoro: {
      timer: "Temporizador Pomodoro",
      completed: "¡Sesión completada!",
      break: "¡Descanso completado!",
    },
    auth: {
      signOut: "Cerrar Sesión",
    },
  },
  fr: {
    common: {
      appName: "FutureTask",
      loading: "Chargement...",
      success: "Succès",
      error: "Erreur",
      cancel: "Annuler",
      save: "Sauvegarder",
      edit: "Modifier",
      delete: "Supprimer",
      copy: "Copier",
      search: "Rechercher...",
      filter: "Filtrer",
      upgrade: "Mettre à niveau",
      premium: "Premium",
      time: "Heure",
      today: "Aujourd'hui",
      week: "Semaine",
      month: "Mois",
      enabled: "Activé",
      update: "Mettre à jour",
    },
    navigation: {
      tasks: "Tâches",
      calendar: "Calendrier",
      settings: "Paramètres",
    },
    tasks: {
      addTask: "Ajouter une Tâche",
      editTask: "Modifier la Tâche",
      createTask: "Créer une Tâche",
      updateTask: "Mettre à jour la Tâche",
      deleteTask: "Supprimer la Tâche",
      title: "Titre",
      description: "Description",
      category: "Catégorie",
      priority: "Priorité",
      dueDate: "Date d'échéance",
      completed: "Terminée",
      todayTasks: "Tâches d'aujourd'hui",
      noTasks: "Aucune tâche trouvée",
      createFirst: "Créez votre première tâche pour commencer.",
      low: "Faible",
      medium: "Moyen",
      high: "Élevé",
    },
    categories: {
      work: "Travail",
      personal: "Personnel",
      health: "Santé",
      learning: "Apprentissage",
      fitness: "Fitness",
      social: "Social",
      creative: "Créatif",
      home: "Maison",
    },
    settings: {
      general: "Général",
      appearance: "Apparence",
      notifications: "Notifications",
      account: "Compte",
      language: "Langue",
      sound: "Effets Sonores",
      theme: "Thème",
    },
    premium: {
      upgrade: "Passer à Premium",
      features: "Fonctionnalités Premium",
    },
    pomodoro: {
      timer: "Minuteur Pomodoro",
      completed: "Session terminée !",
      break: "Pause terminée !",
    },
    auth: {
      signOut: "Se déconnecter",
    },
  },
  de: {
    common: {
      appName: "FutureTask",
      loading: "Laden...",
      success: "Erfolg",
      error: "Fehler",
      cancel: "Abbrechen",
      save: "Speichern",
      edit: "Bearbeiten",
      delete: "Löschen",
      copy: "Kopieren",
      search: "Suchen...",
      filter: "Filtern",
      upgrade: "Upgraden",
      premium: "Premium",
      time: "Zeit",
      today: "Heute",
      week: "Woche",
      month: "Monat",
      enabled: "Aktiviert",
      update: "Aktualisieren",
    },
    navigation: {
      tasks: "Aufgaben",
      calendar: "Kalender",
      settings: "Einstellungen",
    },
    tasks: {
      addTask: "Aufgabe Hinzufügen",
      editTask: "Aufgabe Bearbeiten",
      createTask: "Aufgabe Erstellen",
      updateTask: "Aufgabe Aktualisieren",
      deleteTask: "Aufgabe Löschen",
      title: "Titel",
      description: "Beschreibung",
      category: "Kategorie",
      priority: "Priorität",
      dueDate: "Fälligkeitsdatum",
      completed: "Abgeschlossen",
      todayTasks: "Heutige Aufgaben",
      noTasks: "Keine Aufgaben gefunden",
      createFirst: "Erstellen Sie Ihre erste Aufgabe, um zu beginnen.",
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
    },
    categories: {
      work: "Arbeit",
      personal: "Persönlich",
      health: "Gesundheit",
      learning: "Lernen",
      fitness: "Fitness",
      social: "Sozial",
      creative: "Kreativ",
      home: "Zuhause",
    },
    settings: {
      general: "Allgemein",
      appearance: "Erscheinungsbild",
      notifications: "Benachrichtigungen",
      account: "Konto",
      language: "Sprache",
      sound: "Soundeffekte",
      theme: "Theme",
    },
    premium: {
      upgrade: "Auf Premium upgraden",
      features: "Premium-Funktionen",
    },
    pomodoro: {
      timer: "Pomodoro-Timer",
      completed: "Sitzung abgeschlossen!",
      break: "Pause abgeschlossen!",
    },
    auth: {
      signOut: "Abmelden",
    },
  },
  it: {
    common: {
      appName: "FutureTask",
      loading: "Caricamento...",
      success: "Successo",
      error: "Errore",
      cancel: "Annulla",
      save: "Salva",
      edit: "Modifica",
      delete: "Elimina",
      copy: "Copia",
      search: "Cerca...",
      filter: "Filtra",
      upgrade: "Aggiorna",
      premium: "Premium",
      time: "Ora",
      today: "Oggi",
      week: "Settimana",
      month: "Mese",
      enabled: "Abilitato",
      update: "Aggiorna",
    },
    navigation: {
      tasks: "Attività",
      calendar: "Calendario",
      settings: "Impostazioni",
    },
    tasks: {
      addTask: "Aggiungi Attività",
      editTask: "Modifica Attività",
      createTask: "Crea Attività",
      updateTask: "Aggiorna Attività",
      deleteTask: "Elimina Attività",
      title: "Titolo",
      description: "Descrizione",
      category: "Categoria",
      priority: "Priorità",
      dueDate: "Data di Scadenza",
      completed: "Completata",
      todayTasks: "Attività di Oggi",
      noTasks: "Nessuna attività trovata",
      createFirst: "Crea la tua prima attività per iniziare.",
      low: "Bassa",
      medium: "Media",
      high: "Alta",
    },
    categories: {
      work: "Lavoro",
      personal: "Personale",
      health: "Salute",
      learning: "Apprendimento",
      fitness: "Fitness",
      social: "Sociale",
      creative: "Creativo",
      home: "Casa",
    },
    settings: {
      general: "Generale",
      appearance: "Aspetto",
      notifications: "Notifiche",
      account: "Account",
      language: "Lingua",
      sound: "Effetti Sonori",
      theme: "Tema",
    },
    premium: {
      upgrade: "Passa a Premium",
      features: "Funzionalità Premium",
    },
    pomodoro: {
      timer: "Timer Pomodoro",
      completed: "Sessione completata!",
      break: "Pausa completata!",
    },
    auth: {
      signOut: "Disconnetti",
    },
  },
}

export function useTranslation(initialLanguage: "en" | "es" | "fr" | "de" | "it" = "es") {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "es" | "fr" | "de" | "it">(initialLanguage)
  const [isLoading, setIsLoading] = useState(false)

  const changeLanguage = useCallback((language: "en" | "es" | "fr" | "de" | "it") => {
    setCurrentLanguage(language)
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", language)
    }
  }, [])

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".")
      let value: any = translations[currentLanguage]

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          // Return the key if translation is not found
          return key
        }
      }

      return typeof value === "string" ? value : key
    },
    [currentLanguage],
  )

  // Load initial language on mount
  useEffect(() => {
    const loadInitialLanguage = () => {
      let languageToLoad = initialLanguage

      // Check localStorage for saved language preference
      if (typeof window !== "undefined") {
        const savedLanguage = localStorage.getItem("preferred-language") as "en" | "es" | "fr" | "de" | "it" | null
        if (savedLanguage && availableLanguages.some((lang) => lang.code === savedLanguage)) {
          languageToLoad = savedLanguage
        }
      }

      setCurrentLanguage(languageToLoad)
    }

    loadInitialLanguage()
  }, [initialLanguage])

  return {
    t,
    currentLanguage,
    changeLanguage,
    availableLanguages,
    isLoading,
  }
}
