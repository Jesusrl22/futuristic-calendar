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
import { Heart, Plus, Edit, Trash2, Search, Star, Crown, Lock, Sparkles } from "lucide-react"
import { hybridDb, type WishlistItem } from "@/lib/hybrid-database"
import { isPremiumOrPro } from "@/lib/subscription"
import { useLanguage } from "@/hooks/useLanguage"

interface WishlistManagerProps {
  userId: string
  userPlan: string
  onUpgrade: () => void
}

const PRIORITY_COLORS = {
  high: "bg-destructive/20 text-destructive-foreground border-destructive/50",
  medium: "bg-primary/20 text-primary-foreground border-primary/50",
  low: "bg-accent/20 text-accent-foreground border-accent/50",
}

const PREMIUM_LIMIT = 100

export function WishlistManager({ userId, userPlan, onUpgrade }: WishlistManagerProps) {
  const { t } = useLanguage()
  const isPremium = isPremiumOrPro(userPlan)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
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
      title: item.title || "",
      description: item.description || "",
      priority: item.priority || "medium",
    })
    setShowForm(true)
  }

  const handleDelete = async (itemId: string) => {
    if (confirm(t("wishlist.confirmDelete"))) {
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
      title: "",
      description: "",
      priority: "medium",
    })
  }

  const filteredItems = wishlistItems.filter((item) => {
    const itemTitle = item?.title || ""
    const itemDescription = item?.description || ""
    const search = searchTerm.toLowerCase()

    const matchesSearch = itemTitle.toLowerCase().includes(search) || itemDescription.toLowerCase().includes(search)
    const matchesPriority = filterPriority === "all" || item?.priority === filterPriority

    const matchesTab = activeTab === "all" || (activeTab === "high" && item?.priority === "high")

    return matchesSearch && matchesPriority && matchesTab
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("wishlist.title")}</h2>
            <p className="text-muted-foreground text-sm">{t("common.premium")}</p>
          </div>
        </div>

        <Card className="border-2 border-dashed border-border bg-muted/50">
          <CardContent className="pt-12 pb-12">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{t("wishlist.title")}</h3>
                <p className="text-muted-foreground mb-6">
                  Organiza y planifica todos tus deseos y metas con nuestra función premium
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">Hasta 100 deseos organizados</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">Sistema de prioridades para tus metas</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">Seguimiento de progreso y logros</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">Filtros avanzados y búsqueda inteligente</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={onUpgrade}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  {t("common.upgrade")}
                </Button>
                <p className="text-xs text-muted-foreground">Desde €2.49/mes • Cancela cuando quieras</p>
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
          <div className="p-2 bg-primary rounded-lg">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("wishlist.title")}</h2>
            <p className="text-muted-foreground text-sm">
              {wishlistItems.length}/{PREMIUM_LIMIT} {t("wishlist.title").toLowerCase()} (
              {userPlan === "pro" ? "Pro" : "Premium"})
            </p>
          </div>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              disabled={!editingItem && wishlistItems.length >= PREMIUM_LIMIT}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("wishlist.addItem")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Heart className="w-6 h-6 text-primary" />
                {editingItem ? t("wishlist.editItem") : t("wishlist.addItem")}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? "Modifica los detalles de tu deseo" : "Añade algo nuevo a tu lista de deseos"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold">
                  {t("wishlist.itemTitle")} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="¿Qué deseas?"
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold">
                  {t("wishlist.itemDescription")}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles adicionales..."
                  rows={6}
                  className="text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="priority" className="text-base font-semibold">
                  {t("wishlist.itemPriority")}
                </Label>
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
                        <Star className="w-4 h-4 text-destructive" />
                        {t("tasks.priorityHigh")}
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        {t("tasks.priorityMedium")}
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-accent-foreground" />
                        {t("tasks.priorityLow")}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseForm} size="lg">
                  {t("common.cancel")}
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground" size="lg">
                  {editingItem ? t("common.save") : t("common.add")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{wishlistItems.length}</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("tasks.priorityHigh")}</p>
                <p className="text-2xl font-bold text-foreground">
                  {wishlistItems.filter((item) => item?.priority === "high").length}
                </p>
              </div>
              <Star className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("tasks.priorityMedium")}</p>
                <p className="text-2xl font-bold text-foreground">
                  {wishlistItems.filter((item) => item?.priority === "medium").length}
                </p>
              </div>
              <Star className="h-8 w-8 text-accent-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {t("wishlist.filterAll")} ({wishlistItems.length})
          </TabsTrigger>
          <TabsTrigger value="high" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            {t("tasks.priorityHigh")} ({wishlistItems.filter((item) => item?.priority === "high").length})
          </TabsTrigger>
        </TabsList>

        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("common.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder={t("wishlist.itemPriority")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("wishlist.filterAll")}</SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-destructive" />
                      {t("tasks.priorityHigh")}
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary" />
                      {t("tasks.priorityMedium")}
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-accent-foreground" />
                      {t("tasks.priorityLow")}
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
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {searchTerm || filterPriority !== "all" ? t("wishlist.noItems") : t("wishlist.noItems")}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || filterPriority !== "all"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : t("wishlist.noItemsDescription")}
                  </p>
                  {!searchTerm && filterPriority === "all" && wishlistItems.length < PREMIUM_LIMIT && (
                    <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      {t("wishlist.addItem")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const itemTitle = item?.title || "Sin título"
                const itemDescription = item?.description || ""
                const itemPriority = item?.priority || "medium"
                const itemCreatedAt = item?.created_at || new Date().toISOString()

                return (
                  <Card key={item.id} className="hover:shadow-xl transition-all duration-300 border bg-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <Heart className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg line-clamp-2 flex-1">{itemTitle}</CardTitle>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="hover:bg-accent"
                          >
                            <Edit className="w-4 h-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {itemDescription && (
                        <CardDescription className="line-clamp-3 text-muted-foreground mt-2">
                          {itemDescription}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Badge variant="outline" className={`${PRIORITY_COLORS[itemPriority]} font-medium`}>
                        <Star className="w-3 h-3 mr-1" />
                        {itemPriority === "high" && t("tasks.priorityHigh")}
                        {itemPriority === "medium" && t("tasks.priorityMedium")}
                        {itemPriority === "low" && t("tasks.priorityLow")}
                      </Badge>

                      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                        Añadido el {new Date(itemCreatedAt).toLocaleDateString()}
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
