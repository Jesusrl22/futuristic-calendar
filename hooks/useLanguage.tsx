"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translations
const translations = {
  es: {
    // Navigation
    "nav.dashboard": "Panel",
    "nav.tasks": "Tareas",
    "nav.calendar": "Calendario",
    "nav.notes": "Notas",
    "nav.wishlist": "Lista de Deseos",
    "nav.settings": "Configuración",
    "nav.profile": "Perfil",
    "nav.logout": "Cerrar Sesión",

    // Dashboard
    "dashboard.welcome": "Bienvenido a FutureTask",
    "dashboard.subtitle": "Tu asistente de productividad con IA",
    "dashboard.stats.tasks": "Tareas",
    "dashboard.stats.completed": "Completadas",
    "dashboard.stats.notes": "Notas",
    "dashboard.stats.wishlist": "Lista de Deseos",

    // Tasks
    "tasks.title": "Mis Tareas",
    "tasks.add": "Agregar Tarea",
    "tasks.edit": "Editar Tarea",
    "tasks.delete": "Eliminar Tarea",
    "tasks.complete": "Completar",
    "tasks.incomplete": "Pendiente",
    "tasks.priority.high": "Alta",
    "tasks.priority.medium": "Media",
    "tasks.priority.low": "Baja",
    "tasks.filter.all": "Todas",
    "tasks.filter.pending": "Pendientes",
    "tasks.filter.completed": "Completadas",

    // Notes
    "notes.title": "Mis Notas",
    "notes.add": "Nueva Nota",
    "notes.edit": "Editar Nota",
    "notes.delete": "Eliminar Nota",
    "notes.search": "Buscar notas...",

    // Wishlist
    "wishlist.title": "Lista de Deseos",
    "wishlist.add": "Agregar Deseo",
    "wishlist.edit": "Editar Deseo",
    "wishlist.delete": "Eliminar Deseo",
    "wishlist.complete": "Completar",

    // Forms
    "form.title": "Título",
    "form.description": "Descripción",
    "form.content": "Contenido",
    "form.priority": "Prioridad",
    "form.category": "Categoría",
    "form.tags": "Etiquetas",
    "form.dueDate": "Fecha límite",
    "form.save": "Guardar",
    "form.cancel": "Cancelar",
    "form.delete": "Eliminar",

    // Settings
    "settings.title": "Configuración",
    "settings.language": "Idioma",
    "settings.theme": "Tema",
    "settings.notifications": "Notificaciones",
    "settings.pomodoro": "Pomodoro",
    "settings.workDuration": "Duración del trabajo",
    "settings.breakDuration": "Duración del descanso",
    "settings.longBreakDuration": "Descanso largo",
    "settings.sessionsBeforeLongBreak": "Sesiones antes del descanso largo",

    // Subscription
    "subscription.title": "Suscripción",
    "subscription.current": "Plan Actual",
    "subscription.upgrade": "Mejorar Plan",
    "subscription.free": "Gratuito",
    "subscription.pro": "Pro",
    "subscription.features": "Características",
    "subscription.aiCredits": "Créditos de IA",
    "subscription.unlimited": "Ilimitado",

    // AI Assistant
    "ai.title": "Asistente IA",
    "ai.placeholder": "Pregúntame algo...",
    "ai.send": "Enviar",
    "ai.thinking": "Pensando...",
    "ai.error": "Error al procesar la solicitud",
    "ai.noCredits": "Sin créditos de IA disponibles",

    // Pomodoro
    "pomodoro.title": "Pomodoro",
    "pomodoro.start": "Iniciar",
    "pomodoro.pause": "Pausar",
    "pomodoro.reset": "Reiniciar",
    "pomodoro.work": "Trabajo",
    "pomodoro.break": "Descanso",
    "pomodoro.longBreak": "Descanso Largo",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.warning": "Advertencia",
    "common.info": "Información",
    "common.confirm": "Confirmar",
    "common.yes": "Sí",
    "common.no": "No",
    "common.close": "Cerrar",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.export": "Exportar",
    "common.import": "Importar",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.tasks": "Tasks",
    "nav.calendar": "Calendar",
    "nav.notes": "Notes",
    "nav.wishlist": "Wishlist",
    "nav.settings": "Settings",
    "nav.profile": "Profile",
    "nav.logout": "Logout",

    // Dashboard
    "dashboard.welcome": "Welcome to FutureTask",
    "dashboard.subtitle": "Your AI-powered productivity assistant",
    "dashboard.stats.tasks": "Tasks",
    "dashboard.stats.completed": "Completed",
    "dashboard.stats.notes": "Notes",
    "dashboard.stats.wishlist": "Wishlist",

    // Tasks
    "tasks.title": "My Tasks",
    "tasks.add": "Add Task",
    "tasks.edit": "Edit Task",
    "tasks.delete": "Delete Task",
    "tasks.complete": "Complete",
    "tasks.incomplete": "Pending",
    "tasks.priority.high": "High",
    "tasks.priority.medium": "Medium",
    "tasks.priority.low": "Low",
    "tasks.filter.all": "All",
    "tasks.filter.pending": "Pending",
    "tasks.filter.completed": "Completed",

    // Notes
    "notes.title": "My Notes",
    "notes.add": "New Note",
    "notes.edit": "Edit Note",
    "notes.delete": "Delete Note",
    "notes.search": "Search notes...",

    // Wishlist
    "wishlist.title": "Wishlist",
    "wishlist.add": "Add Wish",
    "wishlist.edit": "Edit Wish",
    "wishlist.delete": "Delete Wish",
    "wishlist.complete": "Complete",

    // Forms
    "form.title": "Title",
    "form.description": "Description",
    "form.content": "Content",
    "form.priority": "Priority",
    "form.category": "Category",
    "form.tags": "Tags",
    "form.dueDate": "Due Date",
    "form.save": "Save",
    "form.cancel": "Cancel",
    "form.delete": "Delete",

    // Settings
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.notifications": "Notifications",
    "settings.pomodoro": "Pomodoro",
    "settings.workDuration": "Work Duration",
    "settings.breakDuration": "Break Duration",
    "settings.longBreakDuration": "Long Break Duration",
    "settings.sessionsBeforeLongBreak": "Sessions Before Long Break",

    // Subscription
    "subscription.title": "Subscription",
    "subscription.current": "Current Plan",
    "subscription.upgrade": "Upgrade Plan",
    "subscription.free": "Free",
    "subscription.pro": "Pro",
    "subscription.features": "Features",
    "subscription.aiCredits": "AI Credits",
    "subscription.unlimited": "Unlimited",

    // AI Assistant
    "ai.title": "AI Assistant",
    "ai.placeholder": "Ask me something...",
    "ai.send": "Send",
    "ai.thinking": "Thinking...",
    "ai.error": "Error processing request",
    "ai.noCredits": "No AI credits available",

    // Pomodoro
    "pomodoro.title": "Pomodoro",
    "pomodoro.start": "Start",
    "pomodoro.pause": "Pause",
    "pomodoro.reset": "Reset",
    "pomodoro.work": "Work",
    "pomodoro.break": "Break",
    "pomodoro.longBreak": "Long Break",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.warning": "Warning",
    "common.info": "Information",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",
    "common.close": "Close",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.export": "Export",
    "common.import": "Import",
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    // Load language from localStorage or detect browser language
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("en")) {
        setLanguageState("en")
      } else {
        setLanguageState("es")
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const value = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
