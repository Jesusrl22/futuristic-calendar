"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  Plus,
  Search,
  Euro,
  Tag,
  Trash2,
  Edit3,
  Crown,
  Lock,
  Star,
  ShoppingCart,
  Gift,
  Home,
  Gamepad2,
  Book,
  Shirt,
} from "lucide-react"

interface WishlistItem {
  id: string
  name: string
  description: string
  price: number
  currency: string
  category: string
  priority: "low" | "medium" | "high"
  url?: string
  imageUrl?: string
  notes: string
  createdAt: string
  userId: string
}

interface WishlistManagerProps {
  userId: string
  isPremium: boolean
  onUpgrade: () => void
}

export function WishlistManager({ userId, isPremium, onUpgrade }: WishlistManagerProps) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "EUR",
    category: "otros",
    priority: "medium" as "low" | "medium" | "high",
    url: "",
    notes: "",
  })

  // Load items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem(`wishlist_${userId}`)
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems))
      } catch (error) {
        console.error("Error loading wishlist:", error)
      }
    }
  }, [userId])

  // Save items to localStorage
  useEffect(() => {
    localStorage.setItem(`wishlist_${userId}`, JSON.stringify(items))
  }, [items, userId])

  const handleAddItem = () => {
    if (!isPremium) {
      onUpgrade()
      return
    }

    if (!formData.name.trim()) return

    const newItem: WishlistItem = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price) || 0,
      currency: formData.currency,
      category: formData.category,
      priority: formData.priority,
      url: formData.url,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      userId,
    }

    setItems((prev) => [newItem, ...prev])
    resetForm()
  }

  const handleEditItem = () => {
    if (!editingItem) return

    const updatedItem: WishlistItem = {
      ...editingItem,
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price) || 0,
      currency: formData.currency,
      category: formData.category,
      priority: formData.priority,
      url: formData.url,
      notes: formData.notes,
    }

    setItems((prev) => prev.map((item) => (item.id === editingItem.id ? updatedItem : item)))
    resetForm()
  }

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "EUR",
      category: "otros",
      priority: "medium",
      url: "",
      notes: "",
    })
    setEditingItem(null)
    setShowForm(false)
  }

  const openEditForm = (item: WishlistItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      currency: item.currency,
      category: item.category,
      priority: item.priority,
      url: item.url || "",
      notes: item.notes,
    })
    setEditingItem(item)
    setShowForm(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      tecnologia: Gamepad2,
      hogar: Home,
      ropa: Shirt,
      libros: Book,
      regalos: Gift,
      otros: ShoppingCart,
    }
    return icons[category as keyof typeof icons] || ShoppingCart
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      tecnologia: "bg-blue-500",
      hogar: "bg-green-500",
      ropa: "bg-purple-500",
      libros: "bg-orange-500",
      regalos: "bg-pink-500",
      otros: "bg-gray-500",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500"
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesPriority = filterPriority === "all" || item.priority === filterPriority

    return matchesSearch && matchesCategory && matchesPriority
  })

  const stats = {
    total: items.length,
    totalValue: items.reduce((sum, item) => sum + item.price, 0),
    categories: [...new Set(items.map((item) => item.category))].length,
    highPriority: items.filter((item) => item.priority === "high").length,
  }

  const categories = [...new Set(items.map((item) => item.category))]

  if (!isPremium) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Función Premium</h3>
          <p className="text-gray-600 mb-4">La lista de deseos está disponible para usuarios Premium y Pro</p>
          <Button onClick={onUpgrade} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="w-4 h-4 mr-2" />
            Actualizar a Premium
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="w-6 h-6 text-pink-600" />
          <h2 className="text-2xl font-bold">Lista de Deseos</h2>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Deseo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">€{stats.totalValue.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Valor Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.categories}</p>
                <p className="text-sm text-gray-600">Categorías</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
                <p className="text-sm text-gray-600">Alta Prioridad</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
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
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay deseos que coincidan con los filtros</p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category)

            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditForm(item)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-600">€{item.price.toFixed(2)}</div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getPriorityColor(item.priority)} text-white`}>{item.priority}</Badge>
                        <Badge className={`${getCategoryColor(item.category)} text-white`}>
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {item.category}
                        </Badge>
                      </div>
                    </div>

                    {item.notes && <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm">{item.notes}</div>}

                    {item.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => window.open(item.url, "_blank")}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ver Producto
                      </Button>
                    )}

                    <div className="text-xs text-gray-500">
                      Agregado: {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Deseo" : "Agregar Nuevo Deseo"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del producto"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="currency">Moneda</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnologia">Tecnología</SelectItem>
                    <SelectItem value="hogar">Hogar</SelectItem>
                    <SelectItem value="ropa">Ropa</SelectItem>
                    <SelectItem value="libros">Libros</SelectItem>
                    <SelectItem value="regalos">Regalos</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="url">URL del Producto</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Notas adicionales..."
                rows={2}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={editingItem ? handleEditItem : handleAddItem}
                className="flex-1"
                disabled={!formData.name.trim()}
              >
                {editingItem ? "Actualizar" : "Agregar"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
