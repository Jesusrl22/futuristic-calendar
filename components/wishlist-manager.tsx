"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Search,
  Star,
  Crown,
  Lock,
  Smartphone,
  Home,
  Shirt,
  BookOpen,
  Gift,
  Plane,
  Car,
  Music,
  MoreHorizontal,
  Sparkles,
} from "lucide-react"
import { hybridDb, type WishlistItem } from "@/lib/hybrid-database"
import { isPremiumOrPro } from "@/lib/subscription"

interface WishlistManagerProps {
  userId: string
  userPlan: string
  onUpgrade: () => void
}

const CATEGORIES = [
  { id: "tecnologia", label: "Tecnología", icon: Smartphone },
  { id: "hogar", label: "Hogar", icon: Home },
  { id: "ropa", label: "Ropa", icon: Shirt },
  { id: "libros", label: "Libros", icon: BookOpen },
  { id: "regalos", label: "Regalos", icon: Gift },
  { id: "viajes", label: "Viajes", icon: Plane },
  { id: "vehiculos", label: "Vehículos", icon: Car },
  { id: "musica", label: "Música", icon: Music },
  { id: "otros", label: "Otros", icon: MoreHorizontal },
]

const PRIORITY_COLORS = {
  high: "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 border-red-300",
  medium: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 border-yellow-300",
  low: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border-green-300",
}

const PRIORITY_LABELS = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
}

const PREMIUM_LIMIT = 100

export function WishlistManager({ userId, userPlan, onUpgrade }: WishlistManagerProps) {
  const isPremium = isPremiumOrPro(userPlan)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "otros",
    priority: "medium" as "high" | "medium" | "low",
    targetDate: "",
    notes: "",
  })

  useEffect(() => {
    console.log("🎯 WishlistManager - User Plan:", userPlan, "isPremium:", isPremium)
    if (isPremium) {
      loadWishlistItems()
    } else {
      setIsLoading(false)
    }
  }, [userId, isPremium, userPlan])

  const loadWishlistItems = async () => {
    try {
      setIsLoading(true)
      const items = await hybridDb.getWishlistItems(userId)
      setWishlistItems(items)
    } catch (error) {
      console.error("Error loading wishlist items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPremium) {
      onUpgrade()
      return
    }

    if (!editingItem && wishlistItems.length >= PREMIUM_LIMIT) {
      return
    }

    try {
      if (editingItem) {
        await hybridDb.updateWishlistItem(editingItem.id, formData)
      } else {
        await hybridDb.createWishlistItem({ user_id: userId, ...formData })
      }
      await loadWishlistItems()
      handleCloseForm()
    } catch (error) {
      console.error("Error saving wishlist item:", error)
    }
  }

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item)
    setFormData({
      name: item.title,
      description: item.description || "",
      category: item.category || "otros",
      priority: item.priority,
      targetDate: item.target_date ? item.target_date.split("T")[0] : "",
      notes: item.notes || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (itemId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este deseo?")) {
      try {
        await hybridDb.deleteWishlistItem(itemId)
        await loadWishlistItems()
      } catch (error) {
        console.error("Error deleting wishlist item:", error)
      }
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({
      name: "",
      description: "",
      category: "otros",
      priority: "medium",
      targetDate: "",
      notes: "",
    })
  }

  const filteredItems = wishlistItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesPriority = filterPriority === "all" || item.priority === filterPriority

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "high" && item.priority === "high") ||
      (activeTab === "upcoming" && item.target_date && new Date(item.target_date) > new Date())

    return matchesSearch && matchesCategory && matchesPriority && matchesTab
  })

  const usedCategories = Array.from(new Set(wishlistItems.map((item) => item.category)))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando lista de deseos...</p>
        </div>
      </div>
    )
  }

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Lista de Deseos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Función Premium</p>
          </div>
        </div>

        <Card className="border-2 border-dashed border-pink-300 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <CardContent className="pt-12 pb-12">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Lista de Deseos Premium</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Organiza y planifica todos tus deseos y metas con nuestra función premium
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Deseos ilimitados organizados por categorías</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Sistema de prioridades y fechas objetivo</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Tag className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Notas personales y seguimiento de progreso</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Filtros avanzados y búsqueda inteligente</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={onUpgrade}
                  size="lg"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Actualizar a Premium o Pro
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">Desde €2.49/mes • Cancela cuando quieras</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Lista de Deseos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {wishlistItems.length}/{PREMIUM_LIMIT} deseos ({userPlan === "pro" ? "Pro" : "Premium"})
            </p>
          </div>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg"
              disabled={!editingItem && wishlistItems.length >= PREMIUM_LIMIT}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Deseo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                {editingItem ? "Editar Deseo" : "Nuevo Deseo"}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? "Modifica los detalles de tu deseo" : "Añade algo nuevo a tu lista de deseos"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="¿Qué deseas?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles adicionales..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "high" | "medium" | "low") => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-red-500" />
                          Alta
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Media
                        </div>
                      </SelectItem>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-green-500" />
                          Baja
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate">Fecha objetivo (opcional)</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas personales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="¿Por qué lo deseas? ¿Cómo planeas conseguirlo?"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  {editingItem ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Total Deseos</p>
                <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">{wishlistItems.length}</p>
              </div>
              <Heart className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Categorías</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{usedCategories.length}</p>
              </div>
              <Tag className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Alta Prioridad</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {wishlistItems.filter((item) => item.priority === "high").length}
                </p>
              </div>
              <Star className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-300/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Con Fecha</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {wishlistItems.filter((item) => item.target_date).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Todos ({wishlistItems.length})
          </TabsTrigger>
          <TabsTrigger value="high" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Prioridad Alta ({wishlistItems.filter((item) => item.priority === "high").length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Con Fecha ({wishlistItems.filter((item) => item.target_date).length})
          </TabsTrigger>
        </TabsList>

        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar deseos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {CATEGORIES.filter((cat) => usedCategories.includes(cat.id)).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-red-500" />
                      Alta
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Media
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-green-500" />
                      Baja
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {searchTerm || filterCategory !== "all" || filterPriority !== "all"
                      ? "No se encontraron deseos"
                      : "Tu lista de deseos está vacía"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm || filterCategory !== "all" || filterPriority !== "all"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Comienza agregando tus primeros deseos y metas"}
                  </p>
                  {!searchTerm &&
                    filterCategory === "all" &&
                    filterPriority === "all" &&
                    wishlistItems.length < PREMIUM_LIMIT && (
                      <Button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Primer Deseo
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const CategoryIcon = CATEGORIES.find((cat) => cat.id === item.category)?.icon || MoreHorizontal
                return (
                  <Card
                    key={item.id}
                    className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg">
                            <CategoryIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                          </div>
                          <CardTitle className="text-lg line-clamp-2 flex-1">{item.title}</CardTitle>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="hover:bg-blue-100 dark:hover:bg-blue-900"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="hover:bg-red-100 dark:hover:bg-red-900"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      {item.description && (
                        <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-400">
                          {item.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`${PRIORITY_COLORS[item.priority]} font-medium`}>
                          <Star className="w-3 h-3 mr-1" />
                          {PRIORITY_LABELS[item.priority]}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {CATEGORIES.find((cat) => cat.id === item.category)?.label || item.category}
                        </Badge>
                      </div>

                      {item.target_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>Meta: {new Date(item.target_date).toLocaleDateString()}</span>
                        </div>
                      )}

                      {item.notes && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg line-clamp-3">
                          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Notas:</p>
                          {item.notes}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                        Añadido el {new Date(item.created_at).toLocaleDateString()}
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
