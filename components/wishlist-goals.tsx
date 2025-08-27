"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Target,
  CalendarIcon,
  Edit3,
  Trash2,
  Check,
  Star,
  Trophy,
  Heart,
  Briefcase,
  BookOpen,
  Plane,
  Home,
  Gamepad2,
  ShoppingCart,
  Activity,
} from "lucide-react"
import { format } from "date-fns"
import type { Language } from "@/types"

interface WishlistItem {
  id: string
  title: string
  description?: string
  category: string
  priority: "low" | "medium" | "high"
  targetDate?: Date
  achieved: boolean
  createdAt: Date
  achievedAt?: Date
  progress: number
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  completed: boolean
  completedAt?: Date
}

interface Goal {
  id: string
  title: string
  description?: string
  category: string
  priority: "low" | "medium" | "high"
  targetDate?: Date
  achieved: boolean
  createdAt: Date
  achievedAt?: Date
  progress: number
  targetValue: number
  currentValue: number
  unit: string
  milestones: Milestone[]
}

const CATEGORIES = [
  {
    id: "career",
    name: { en: "Career", es: "Carrera", fr: "Carrière", de: "Karriere", it: "Carriera" },
    icon: Briefcase,
    color: "blue",
  },
  {
    id: "health",
    name: { en: "Health", es: "Salud", fr: "Santé", de: "Gesundheit", it: "Salute" },
    icon: Activity,
    color: "green",
  },
  {
    id: "learning",
    name: { en: "Learning", es: "Aprendizaje", fr: "Apprentissage", de: "Lernen", it: "Apprendimento" },
    icon: BookOpen,
    color: "purple",
  },
  {
    id: "travel",
    name: { en: "Travel", es: "Viajes", fr: "Voyage", de: "Reisen", it: "Viaggi" },
    icon: Plane,
    color: "cyan",
  },
  {
    id: "personal",
    name: { en: "Personal", es: "Personal", fr: "Personnel", de: "Persönlich", it: "Personale" },
    icon: Heart,
    color: "pink",
  },
  {
    id: "home",
    name: { en: "Home", es: "Hogar", fr: "Maison", de: "Zuhause", it: "Casa" },
    icon: Home,
    color: "yellow",
  },
  {
    id: "entertainment",
    name: {
      en: "Entertainment",
      es: "Entretenimiento",
      fr: "Divertissement",
      de: "Unterhaltung",
      it: "Intrattenimento",
    },
    icon: Gamepad2,
    color: "red",
  },
  {
    id: "shopping",
    name: { en: "Shopping", es: "Compras", fr: "Shopping", de: "Einkaufen", it: "Shopping" },
    icon: ShoppingCart,
    color: "orange",
  },
]

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

interface WishlistGoalsProps {
  language: Language
}

export function WishlistGoals({ language }: WishlistGoalsProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [activeTab, setActiveTab] = useState("wishlist")
  const [showWishlistDialog, setShowWishlistDialog] = useState(false)
  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [editingWishlist, setEditingWishlist] = useState<WishlistItem | null>(null)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("personal")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [targetDate, setTargetDate] = useState<Date>()
  const [targetValue, setTargetValue] = useState(100)
  const [unit, setUnit] = useState("")

  const { toast } = useToast()

  const translations = {
    en: {
      wishlist: "Wishlist",
      goals: "Goals",
      addWishlistItem: "Add Wishlist Item",
      addGoal: "Add Goal",
      title: "Title",
      description: "Description",
      category: "Category",
      priority: "Priority",
      targetDate: "Target Date",
      targetValue: "Target Value",
      unit: "Unit",
      progress: "Progress",
      achieved: "Achieved",
      notAchieved: "Not Achieved",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      markAchieved: "Mark as Achieved",
      addMilestone: "Add Milestone",
      milestones: "Milestones",
      noItems: "No items yet",
      createFirst: "Create your first item to get started",
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    es: {
      wishlist: "Lista de Deseos",
      goals: "Objetivos",
      addWishlistItem: "Añadir a Lista de Deseos",
      addGoal: "Añadir Objetivo",
      title: "Título",
      description: "Descripción",
      category: "Categoría",
      priority: "Prioridad",
      targetDate: "Fecha Objetivo",
      targetValue: "Valor Objetivo",
      unit: "Unidad",
      progress: "Progreso",
      achieved: "Logrado",
      notAchieved: "No Logrado",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      markAchieved: "Marcar como Logrado",
      addMilestone: "Añadir Hito",
      milestones: "Hitos",
      noItems: "No hay elementos aún",
      createFirst: "Crea tu primer elemento para comenzar",
      low: "Baja",
      medium: "Media",
      high: "Alta",
    },
    fr: {
      wishlist: "Liste de Souhaits",
      goals: "Objectifs",
      addWishlistItem: "Ajouter à la Liste",
      addGoal: "Ajouter Objectif",
      title: "Titre",
      description: "Description",
      category: "Catégorie",
      priority: "Priorité",
      targetDate: "Date Cible",
      targetValue: "Valeur Cible",
      unit: "Unité",
      progress: "Progrès",
      achieved: "Atteint",
      notAchieved: "Non Atteint",
      save: "Sauvegarder",
      cancel: "Annuler",
      edit: "Modifier",
      delete: "Supprimer",
      markAchieved: "Marquer comme Atteint",
      addMilestone: "Ajouter Étape",
      milestones: "Étapes",
      noItems: "Aucun élément encore",
      createFirst: "Créez votre premier élément pour commencer",
      low: "Faible",
      medium: "Moyen",
      high: "Élevé",
    },
    de: {
      wishlist: "Wunschliste",
      goals: "Ziele",
      addWishlistItem: "Zur Wunschliste hinzufügen",
      addGoal: "Ziel hinzufügen",
      title: "Titel",
      description: "Beschreibung",
      category: "Kategorie",
      priority: "Priorität",
      targetDate: "Zieldatum",
      targetValue: "Zielwert",
      unit: "Einheit",
      progress: "Fortschritt",
      achieved: "Erreicht",
      notAchieved: "Nicht Erreicht",
      save: "Speichern",
      cancel: "Abbrechen",
      edit: "Bearbeiten",
      delete: "Löschen",
      markAchieved: "Als Erreicht markieren",
      addMilestone: "Meilenstein hinzufügen",
      milestones: "Meilensteine",
      noItems: "Noch keine Elemente",
      createFirst: "Erstellen Sie Ihr erstes Element um zu beginnen",
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
    },
    it: {
      wishlist: "Lista dei Desideri",
      goals: "Obiettivi",
      addWishlistItem: "Aggiungi alla Lista",
      addGoal: "Aggiungi Obiettivo",
      title: "Titolo",
      description: "Descrizione",
      category: "Categoria",
      priority: "Priorità",
      targetDate: "Data Obiettivo",
      targetValue: "Valore Obiettivo",
      unit: "Unità",
      progress: "Progresso",
      achieved: "Raggiunto",
      notAchieved: "Non Raggiunto",
      save: "Salva",
      cancel: "Annulla",
      edit: "Modifica",
      delete: "Elimina",
      markAchieved: "Segna come Raggiunto",
      addMilestone: "Aggiungi Traguardo",
      milestones: "Traguardi",
      noItems: "Nessun elemento ancora",
      createFirst: "Crea il tuo primo elemento per iniziare",
      low: "Basso",
      medium: "Medio",
      high: "Alto",
    },
  }

  const t = translations[language] || translations.es

  // Load data from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist-items")
    const savedGoals = localStorage.getItem("goals")

    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist)
        setWishlistItems(
          parsed.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            targetDate: item.targetDate ? new Date(item.targetDate) : undefined,
            achievedAt: item.achievedAt ? new Date(item.achievedAt) : undefined,
          })),
        )
      } catch (error) {
        console.error("Error parsing wishlist items:", error)
      }
    }

    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals)
        setGoals(
          parsed.map((goal: any) => ({
            ...goal,
            createdAt: new Date(goal.createdAt),
            targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
            achievedAt: goal.achievedAt ? new Date(goal.achievedAt) : undefined,
          })),
        )
      } catch (error) {
        console.error("Error parsing goals:", error)
      }
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist-items", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals))
  }, [goals])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setCategory("personal")
    setPriority("medium")
    setTargetDate(undefined)
    setTargetValue(100)
    setUnit("")
    setEditingWishlist(null)
    setEditingGoal(null)
  }

  const handleSaveWishlist = () => {
    if (!title.trim()) return

    const wishlistItem: WishlistItem = {
      id: editingWishlist?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      targetDate,
      achieved: false,
      createdAt: editingWishlist?.createdAt || new Date(),
      progress: 0,
      milestones: editingWishlist?.milestones || [],
    }

    if (editingWishlist) {
      setWishlistItems((prev) => prev.map((item) => (item.id === editingWishlist.id ? wishlistItem : item)))
      toast.success("Elemento actualizado exitosamente")
    } else {
      setWishlistItems((prev) => [wishlistItem, ...prev])
      toast.success("Elemento añadido a la lista de deseos")
    }

    resetForm()
    setShowWishlistDialog(false)
  }

  const handleSaveGoal = () => {
    if (!title.trim()) return

    const goal: Goal = {
      id: editingGoal?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      targetDate,
      achieved: false,
      createdAt: editingGoal?.createdAt || new Date(),
      progress: editingGoal?.progress || 0,
      targetValue,
      currentValue: editingGoal?.currentValue || 0,
      unit: unit.trim(),
      milestones: editingGoal?.milestones || [],
    }

    if (editingGoal) {
      setGoals((prev) => prev.map((g) => (g.id === editingGoal.id ? goal : g)))
      toast.success("Objetivo actualizado exitosamente")
    } else {
      setGoals((prev) => [goal, ...prev])
      toast.success("Objetivo añadido exitosamente")
    }

    resetForm()
    setShowGoalDialog(false)
  }

  const handleDeleteWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
    toast.success("Elemento eliminado")
  }

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
    toast.success("Objetivo eliminado")
  }

  const handleToggleWishlistAchieved = (id: string) => {
    setWishlistItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              achieved: !item.achieved,
              achievedAt: !item.achieved ? new Date() : undefined,
              progress: !item.achieved ? 100 : 0,
            }
          : item,
      ),
    )
    toast.success("Estado actualizado")
  }

  const handleToggleGoalAchieved = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              achieved: !goal.achieved,
              achievedAt: !goal.achieved ? new Date() : undefined,
              progress: !goal.achieved ? 100 : 0,
              currentValue: !goal.achieved ? goal.targetValue : goal.currentValue,
            }
          : goal,
      ),
    )
    toast.success("Estado actualizado")
  }

  const startEditWishlist = (item: WishlistItem) => {
    setEditingWishlist(item)
    setTitle(item.title)
    setDescription(item.description || "")
    setCategory(item.category)
    setPriority(item.priority)
    setTargetDate(item.targetDate)
    setShowWishlistDialog(true)
  }

  const startEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setTitle(goal.title)
    setDescription(goal.description || "")
    setCategory(goal.category)
    setPriority(goal.priority)
    setTargetDate(goal.targetDate)
    setTargetValue(goal.targetValue)
    setUnit(goal.unit)
    setShowGoalDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Target className="h-8 w-8 mr-3" />
          {activeTab === "wishlist" ? t.wishlist : t.goals}
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/10 border-white/20">
          <TabsTrigger value="wishlist" className="text-white data-[state=active]:bg-white/20">
            <Star className="h-4 w-4 mr-2" />
            {t.wishlist}
          </TabsTrigger>
          <TabsTrigger value="goals" className="text-white data-[state=active]:bg-white/20">
            <Trophy className="h-4 w-4 mr-2" />
            {t.goals}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wishlist" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showWishlistDialog} onOpenChange={setShowWishlistDialog}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetForm()
                    setShowWishlistDialog(true)
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addWishlistItem}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle>{editingWishlist ? t.edit : t.addWishlistItem}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t.title}</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder={t.title}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t.description}</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder={t.description}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{t.category}</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center">
                                <cat.icon className="h-4 w-4 mr-2" />
                                {cat.name[language]}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t.priority}</label>
                      <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{t.low}</SelectItem>
                          <SelectItem value="medium">{t.medium}</SelectItem>
                          <SelectItem value="high">{t.high}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t.targetDate}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {targetDate ? format(targetDate, "PPP") : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={targetDate} onSelect={setTargetDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm()
                        setShowWishlistDialog(false)
                      }}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {t.cancel}
                    </Button>
                    <Button
                      onClick={handleSaveWishlist}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      {t.save}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {wishlistItems.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <Star className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{t.noItems}</h3>
                <p className="text-white/60 mb-4">{t.createFirst}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item) => {
                const category = CATEGORIES.find((c) => c.id === item.category)
                const CategoryIcon = category?.icon || Star

                return (
                  <Card
                    key={item.id}
                    className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="h-5 w-5 text-white" />
                          <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge className={`${PRIORITY_COLORS[item.priority]} text-xs`}>{t[item.priority]}</Badge>
                          {item.achieved && (
                            <Badge className="bg-green-500 text-white text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              {t.achieved}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {item.description && <p className="text-white/70 text-sm">{item.description}</p>}

                      {item.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm text-white/70">
                            <span>{t.progress}</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      )}

                      {item.targetDate && (
                        <div className="flex items-center text-sm text-white/70">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {format(item.targetDate, "PPP")}
                        </div>
                      )}

                      <div className="flex justify-between pt-2">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditWishlist(item)}
                            className="text-white hover:bg-white/20 p-2"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteWishlist(item.id)}
                            className="text-white hover:bg-white/20 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleToggleWishlistAchieved(item.id)}
                          className={`${
                            item.achieved ? "bg-green-500 hover:bg-green-600" : "bg-white/20 hover:bg-white/30"
                          } text-white border-0`}
                        >
                          {item.achieved ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              {t.achieved}
                            </>
                          ) : (
                            t.markAchieved
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetForm()
                    setShowGoalDialog(true)
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addGoal}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingGoal ? t.edit : t.addGoal}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t.title}</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder={t.title}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t.description}</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder={t.description}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{t.category}</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center">
                                <cat.icon className="h-4 w-4 mr-2" />
                                {cat.name[language]}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t.priority}</label>
                      <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{t.low}</SelectItem>
                          <SelectItem value="medium">{t.medium}</SelectItem>
                          <SelectItem value="high">{t.high}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{t.targetValue}</label>
                      <Input
                        type="number"
                        value={targetValue}
                        onChange={(e) => setTargetValue(Number(e.target.value))}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t.unit}</label>
                      <Input
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="kg, hours, pages..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t.targetDate}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {targetDate ? format(targetDate, "PPP") : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={targetDate} onSelect={setTargetDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm()
                        setShowGoalDialog(false)
                      }}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {t.cancel}
                    </Button>
                    <Button
                      onClick={handleSaveGoal}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      {t.save}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {goals.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{t.noItems}</h3>
                <p className="text-white/60 mb-4">{t.createFirst}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => {
                const category = CATEGORIES.find((c) => c.id === goal.category)
                const CategoryIcon = category?.icon || Trophy

                return (
                  <Card
                    key={goal.id}
                    className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="h-5 w-5 text-white" />
                          <CardTitle className="text-white text-lg">{goal.title}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge className={`${PRIORITY_COLORS[goal.priority]} text-xs`}>{t[goal.priority]}</Badge>
                          {goal.achieved && (
                            <Badge className="bg-green-500 text-white text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              {t.achieved}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {goal.description && <p className="text-white/70 text-sm">{goal.description}</p>}

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-white/70">
                          <span>{t.progress}</span>
                          <span>
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      {goal.targetDate && (
                        <div className="flex items-center text-sm text-white/70">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {format(goal.targetDate, "PPP")}
                        </div>
                      )}

                      <div className="flex justify-between pt-2">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditGoal(goal)}
                            className="text-white hover:bg-white/20 p-2"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-white hover:bg-white/20 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleToggleGoalAchieved(goal.id)}
                          className={`${
                            goal.achieved ? "bg-green-500 hover:bg-green-600" : "bg-white/20 hover:bg-white/30"
                          } text-white border-0`}
                        >
                          {goal.achieved ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              {t.achieved}
                            </>
                          ) : (
                            t.markAchieved
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default WishlistGoals
