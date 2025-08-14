import { Briefcase, User, Heart, BookOpen, Dumbbell, Users, Palette, Home } from "lucide-react"
import type { Achievement, Testimonial, UserPreferences } from "@/types"

export const TASK_CATEGORIES = [
  { id: "work", name: { en: "Work", es: "Trabajo" }, icon: Briefcase, color: "bg-blue-500" },
  { id: "personal", name: { en: "Personal", es: "Personal" }, icon: User, color: "bg-green-500" },
  { id: "health", name: { en: "Health", es: "Salud" }, icon: Heart, color: "bg-red-500" },
  { id: "learning", name: { en: "Learning", es: "Aprendizaje" }, icon: BookOpen, color: "bg-purple-500" },
  { id: "fitness", name: { en: "Fitness", es: "Ejercicio" }, icon: Dumbbell, color: "bg-orange-500" },
  { id: "social", name: { en: "Social", es: "Social" }, icon: Users, color: "bg-pink-500" },
  { id: "creative", name: { en: "Creative", es: "Creativo" }, icon: Palette, color: "bg-yellow-500" },
  { id: "home", name: { en: "Home", es: "Hogar" }, icon: Home, color: "bg-indigo-500" },
]

export const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

export const THEMES = {
  free: [
    {
      id: "cosmic",
      name: { en: "Cosmic Purple", es: "Púrpura Cósmico" },
      gradient: "from-purple-400 via-pink-500 to-red-500",
      preview: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
    },
    {
      id: "ocean",
      name: { en: "Ocean Blue", es: "Azul Océano" },
      gradient: "from-blue-400 via-purple-500 to-pink-500",
      preview: "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500",
    },
    {
      id: "forest",
      name: { en: "Forest Green", es: "Verde Bosque" },
      gradient: "from-green-400 via-blue-500 to-purple-500",
      preview: "bg-gradient-to-r from-green-400 via-blue-500 to-purple-500",
    },
  ],
  premium: [
    {
      id: "sunset",
      name: { en: "Golden Sunset", es: "Atardecer Dorado" },
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      preview: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
    },
    {
      id: "aurora",
      name: { en: "Aurora Borealis", es: "Aurora Boreal" },
      gradient: "from-green-300 via-blue-500 to-purple-600",
      preview: "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600",
    },
    {
      id: "galaxy",
      name: { en: "Deep Galaxy", es: "Galaxia Profunda" },
      gradient: "from-indigo-900 via-purple-900 to-pink-900",
      preview: "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900",
    },
    {
      id: "neon",
      name: { en: "Neon Dreams", es: "Sueños Neón" },
      gradient: "from-pink-500 via-purple-500 to-cyan-500",
      preview: "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500",
    },
  ],
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_task",
    title: { en: "Getting Started", es: "Primeros Pasos" },
    description: { en: "Complete your first task", es: "Completa tu primera tarea" },
    icon: "🎯",
    unlocked: false,
    rarity: "common",
    category: "tasks",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "task_master_10",
    title: { en: "Task Warrior", es: "Guerrero de Tareas" },
    description: { en: "Complete 10 tasks", es: "Completa 10 tareas" },
    icon: "⚔️",
    unlocked: false,
    rarity: "common",
    category: "tasks",
    progress: 0,
    maxProgress: 10,
  },
  {
    id: "task_master_50",
    title: { en: "Task Champion", es: "Campeón de Tareas" },
    description: { en: "Complete 50 tasks", es: "Completa 50 tareas" },
    icon: "🏅",
    unlocked: false,
    rarity: "rare",
    category: "tasks",
    progress: 0,
    maxProgress: 50,
  },
  {
    id: "streak_week",
    title: { en: "Week Warrior", es: "Guerrero Semanal" },
    description: { en: "Maintain a 7-day streak", es: "Mantén una racha de 7 días" },
    icon: "🔥",
    unlocked: false,
    rarity: "rare",
    category: "streaks",
    progress: 0,
    maxProgress: 7,
  },
  {
    id: "pomodoro_master",
    title: { en: "Focus Master", es: "Maestro del Enfoque" },
    description: { en: "Complete 50 Pomodoro sessions", es: "Completa 50 sesiones Pomodoro" },
    icon: "🧠",
    unlocked: false,
    rarity: "epic",
    category: "pomodoro",
    progress: 0,
    maxProgress: 50,
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Product Manager at Tech Corp",
    content:
      "FutureTask has completely transformed how I manage my daily tasks. The Pomodoro timer and achievement system keep me motivated throughout the day!",
    rating: 5,
    avatar: "/testimonials/sarah.jpg",
    verified: true,
  },
  {
    id: "2",
    name: "Miguel Rodriguez",
    role: "Freelance Designer",
    content:
      "The best task management app I've ever used. The calendar integration and analytics help me stay on top of everything. Highly recommended!",
    rating: 5,
    avatar: "/testimonials/miguel.jpg",
    verified: true,
  },
  {
    id: "3",
    name: "Emma Chen",
    role: "Computer Science Student",
    content:
      "Perfect for managing my studies and personal projects. The themes are beautiful and the interface is so intuitive. Love the achievement system!",
    rating: 5,
    avatar: "/testimonials/emma.jpg",
    verified: true,
  },
  {
    id: "4",
    name: "David Kim",
    role: "Marketing Director",
    content:
      "The premium features are worth every penny. Unlimited tasks, advanced analytics, and priority support have boosted my productivity by 40%.",
    rating: 5,
    avatar: "/testimonials/david.jpg",
    verified: true,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Entrepreneur",
    content:
      "I've tried dozens of productivity apps, but FutureTask is the only one that stuck. The combination of simplicity and powerful features is perfect.",
    rating: 5,
    avatar: "/testimonials/lisa.jpg",
    verified: true,
  },
  {
    id: "6",
    name: "Carlos Mendoza",
    role: "Software Engineer",
    content:
      "As a developer, I appreciate the clean interface and smooth performance. The Pomodoro technique integration has improved my coding sessions significantly.",
    rating: 5,
    avatar: "/testimonials/carlos.jpg",
    verified: true,
  },
]

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  language: "en",
  notifications: true,
  soundEnabled: true,
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  dailyGoal: 8,
  weeklyGoal: 40,
  backgroundGradient: "from-purple-400 via-pink-500 to-red-500",
  isPremium: false,
  selectedTheme: "cosmic",
  userName: "",
  userGoals: [],
  hasSelectedPlan: false,
}
