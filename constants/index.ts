export const STORAGE_KEYS = {
  TASKS: "tasks",
  PREFERENCES: "preferences",
  USER: "user",
  APP_STATE: "appState",
  POMODORO_SESSIONS: "pomodoroSessions",
  WISHLIST: "wishlist",
  NOTES: "notes",
} as const

export const LIMITS = {
  FREE_TASKS_PER_MONTH: 50,
  FREE_POMODORO_SESSIONS_PER_DAY: 5,
  PREMIUM_UNLIMITED: -1,
} as const

export const POMODORO_DEFAULTS = {
  WORK_DURATION: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15,
  SESSIONS_UNTIL_LONG_BREAK: 4,
} as const

export const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
} as const

export const CATEGORIES = [
  { id: "work", name: "Trabajo", icon: "💼", color: "blue" },
  { id: "personal", name: "Personal", icon: "🏠", color: "green" },
  { id: "health", name: "Salud", icon: "❤️", color: "red" },
  { id: "learning", name: "Aprendizaje", icon: "📚", color: "purple" },
  { id: "finance", name: "Finanzas", icon: "💰", color: "yellow" },
  { id: "social", name: "Social", icon: "👥", color: "pink" },
] as const

export const THEMES = {
  FREE: [
    { id: "slate", name: "Gris Pizarra", gradient: "from-slate-50 via-blue-50 to-indigo-100", isPremium: false },
    { id: "blue", name: "Azul Océano", gradient: "from-blue-50 via-cyan-50 to-teal-100", isPremium: false },
    { id: "green", name: "Verde Bosque", gradient: "from-green-50 via-emerald-50 to-teal-100", isPremium: false },
  ],
  PREMIUM: [
    { id: "purple", name: "Púrpura Real", gradient: "from-purple-50 via-violet-50 to-indigo-100", isPremium: true },
    { id: "pink", name: "Flor de Cerezo", gradient: "from-pink-50 via-rose-50 to-red-100", isPremium: true },
    { id: "orange", name: "Naranja Atardecer", gradient: "from-orange-50 via-red-50 to-pink-100", isPremium: true },
    { id: "teal", name: "Verde Azulado Tropical", gradient: "from-teal-50 via-cyan-50 to-blue-100", isPremium: true },
    { id: "cosmic", name: "Cósmico", gradient: "from-indigo-900 via-purple-900 to-pink-900", isPremium: true },
    { id: "sunset", name: "Atardecer Dorado", gradient: "from-yellow-50 via-orange-50 to-red-100", isPremium: true },
    { id: "forest", name: "Bosque Místico", gradient: "from-emerald-900 via-green-800 to-teal-700", isPremium: true },
    { id: "galaxy", name: "Galaxia", gradient: "from-slate-900 via-purple-900 to-slate-900", isPremium: true },
  ],
} as const

export const DEFAULT_PREFERENCES = {
  isPremium: false,
  hasSelectedPlan: false,
  theme: "slate",
  language: "es",
  notifications: true,
  soundEnabled: true,
  dailyGoal: 5,
  weeklyGoal: 35,
  userName: "",
  userEmail: "",
  selectedTheme: "slate",
  backgroundGradient: "from-slate-50 via-blue-50 to-indigo-100",
} as const

export const LANGUAGES = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
] as const
