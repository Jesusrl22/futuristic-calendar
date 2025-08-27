export interface Theme {
  id: string
  name: {
    en: string
    es: string
  }
  isPremium: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
    info: string
  }
  gradient: string
  preview: string
}

export const FREE_THEMES: Theme[] = [
  {
    id: "slate",
    name: { en: "Slate Gray", es: "Gris Pizarra" },
    isPremium: false,
    colors: {
      primary: "#475569",
      secondary: "#64748b",
      accent: "#0f172a",
      background: "#f8fafc",
      surface: "#ffffff",
      text: "#0f172a",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradient: "from-slate-400 via-slate-500 to-slate-600",
    preview: "bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600",
  },
  {
    id: "blue",
    name: { en: "Ocean Blue", es: "Azul Océano" },
    isPremium: false,
    colors: {
      primary: "#3b82f6",
      secondary: "#60a5fa",
      accent: "#1e40af",
      background: "#f0f9ff",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e0e7ff",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    preview: "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600",
  },
  {
    id: "green",
    name: { en: "Forest Green", es: "Verde Bosque" },
    isPremium: false,
    colors: {
      primary: "#10b981",
      secondary: "#34d399",
      accent: "#047857",
      background: "#f0fdf4",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#dcfce7",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradient: "from-green-400 via-green-500 to-green-600",
    preview: "bg-gradient-to-r from-green-400 via-green-500 to-green-600",
  },
]

export const PREMIUM_THEMES: Theme[] = [
  {
    id: "purple",
    name: { en: "Royal Purple", es: "Púrpura Real" },
    isPremium: true,
    colors: {
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      accent: "#6d28d9",
      background: "#faf5ff",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e9d5ff",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradient: "from-purple-400 via-purple-500 to-purple-600",
    preview: "bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600",
  },
  {
    id: "pink",
    name: { en: "Cherry Blossom", es: "Flor de Cerezo" },
    isPremium: true,
    colors: {
      primary: "#ec4899",
      secondary: "#f472b6",
      accent: "#be185d",
      background: "#fdf2f8",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#fce7f3",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradient: "from-pink-400 via-pink-500 to-pink-600",
    preview: "bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600",
  },
  {
    id: "orange",
    name: { en: "Sunset Orange", es: "Naranja Atardecer" },
    isPremium: true,
    colors: {
      primary: "#f97316",
      secondary: "#fb923c",
      accent: "#c2410c",
      background: "#fff7ed",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#fed7aa",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradient: "from-orange-400 via-orange-500 to-orange-600",
    preview: "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600",
  },
  {
    id: "teal",
    name: { en: "Tropical Teal", es: "Verde Azulado Tropical" },
    isPremium: true,
    colors: {
      primary: "#14b8a6",
      secondary: "#5eead4",
      accent: "#0f766e",
      background: "#f0fdfa",
      surface: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#ccfbf1",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradient: "from-teal-400 via-teal-500 to-teal-600",
    preview: "bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600",
  },
]

export const THEMES = {
  free: FREE_THEMES,
  premium: PREMIUM_THEMES,
}

export const getAllThemes = (): Theme[] => {
  return [...FREE_THEMES, ...PREMIUM_THEMES]
}

export const getThemeById = (id: string): Theme | undefined => {
  return getAllThemes().find((theme) => theme.id === id)
}

export const getFreeThemes = (): Theme[] => {
  return FREE_THEMES
}

export const getPremiumThemes = (): Theme[] => {
  return PREMIUM_THEMES
}

export const getDefaultTheme = (): Theme => {
  return FREE_THEMES[0] // slate theme
}
