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
}

export function useTranslation(lang: "en" | "es" = "en") {
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
