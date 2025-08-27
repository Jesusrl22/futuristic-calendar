export type Category =
  | "work"
  | "personal"
  | "health"
  | "learning"
  | "finance"
  | "shopping"
  | "travel"
  | "hobbies"
  | "fitness"
  | "family"
  | "projects"
  | "social"

export interface CategoryConfig {
  id: Category
  name: {
    en: string
    es: string
  }
  color: string
  icon: string
  isPremium?: boolean
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "work",
    name: { en: "Work", es: "Trabajo" },
    color: "#3b82f6", // blue-500
    icon: "💼",
  },
  {
    id: "personal",
    name: { en: "Personal", es: "Personal" },
    color: "#10b981", // green-500
    icon: "🏠",
  },
  {
    id: "health",
    name: { en: "Health", es: "Salud" },
    color: "#ef4444", // red-500
    icon: "❤️",
  },
  {
    id: "learning",
    name: { en: "Learning", es: "Aprendizaje" },
    color: "#8b5cf6", // violet-500
    icon: "📚",
  },
  {
    id: "finance",
    name: { en: "Finance", es: "Finanzas" },
    color: "#f59e0b", // amber-500
    icon: "💰",
  },
  {
    id: "shopping",
    name: { en: "Shopping", es: "Compras" },
    color: "#ec4899", // pink-500
    icon: "🛒",
  },
  {
    id: "travel",
    name: { en: "Travel", es: "Viajes" },
    color: "#06b6d4", // cyan-500
    icon: "✈️",
  },
  {
    id: "hobbies",
    name: { en: "Hobbies", es: "Pasatiempos" },
    color: "#84cc16", // lime-500
    icon: "🎨",
  },
  // Premium categories
  {
    id: "fitness",
    name: { en: "Fitness", es: "Ejercicio" },
    color: "#f97316", // orange-500
    icon: "💪",
    isPremium: true,
  },
  {
    id: "family",
    name: { en: "Family", es: "Familia" },
    color: "#a855f7", // purple-500
    icon: "👨‍👩‍👧‍👦",
    isPremium: true,
  },
  {
    id: "projects",
    name: { en: "Projects", es: "Proyectos" },
    color: "#14b8a6", // teal-500
    icon: "🚀",
    isPremium: true,
  },
  {
    id: "social",
    name: { en: "Social", es: "Social" },
    color: "#f43f5e", // rose-500
    icon: "👥",
    isPremium: true,
  },
]

export const TASK_CATEGORIES = CATEGORIES

export const getCategoryById = (id: string): CategoryConfig | undefined => {
  return CATEGORIES.find((category) => category.id === id)
}

export const getFreeCategoriesCount = (): number => {
  return CATEGORIES.filter((category) => !category.isPremium).length
}

export const getPremiumCategoriesCount = (): number => {
  return CATEGORIES.filter((category) => category.isPremium).length
}

export const getDefaultCategory = (): CategoryConfig => {
  return CATEGORIES[0] // work category
}
