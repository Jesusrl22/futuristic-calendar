import { Briefcase, User, Heart, BookOpen, Dumbbell, Users, Palette, Home } from "lucide-react"

export const taskCategories = [
  { id: "work", name: { en: "Work", es: "Trabajo" }, icon: Briefcase, color: "bg-blue-500" },
  { id: "personal", name: { en: "Personal", es: "Personal" }, icon: User, color: "bg-green-500" },
  { id: "health", name: { en: "Health", es: "Salud" }, icon: Heart, color: "bg-red-500" },
  { id: "learning", name: { en: "Learning", es: "Aprendizaje" }, icon: BookOpen, color: "bg-purple-500" },
  { id: "fitness", name: { en: "Fitness", es: "Ejercicio" }, icon: Dumbbell, color: "bg-orange-500" },
  { id: "social", name: { en: "Social", es: "Social" }, icon: Users, color: "bg-pink-500" },
  { id: "creative", name: { en: "Creative", es: "Creativo" }, icon: Palette, color: "bg-yellow-500" },
  { id: "home", name: { en: "Home", es: "Hogar" }, icon: Home, color: "bg-indigo-500" },
]
