"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface WishlistFormProps {
  onAddItem: (item: {
    title: string
    description?: string
    price?: number
    url?: string
    priority: "low" | "medium" | "high"
    category: string
  }) => void
  onEditItem?: (
    itemId: string,
    updates: {
      title: string
      description?: string
      price?: number
      url?: string
      priority: "low" | "medium" | "high"
      category: string
    },
  ) => void
  editingItem?: {
    id: string
    title: string
    description?: string
    price?: number
    url?: string
    priority: "low" | "medium" | "high"
    category: string
  } | null
  translations: (key: string) => string
}

export function WishlistForm({ onAddItem, onEditItem, editingItem, translations: t }: WishlistFormProps) {
  const [open, setOpen] = useState(false)
  const [itemTitle, setItemTitle] = useState("")
  const [itemDescription, setItemDescription] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [itemUrl, setItemUrl] = useState("")
  const [itemPriority, setItemPriority] = useState<"low" | "medium" | "high">("medium")
  const [itemCategory, setItemCategory] = useState("personal")

  useEffect(() => {
    if (editingItem) {
      setItemTitle(editingItem.title)
      setItemDescription(editingItem.description || "")
      setItemPrice(editingItem.price?.toString() || "")
      setItemUrl(editingItem.url || "")
      setItemPriority(editingItem.priority)
      setItemCategory(editingItem.category)
      setOpen(true)
    }
  }, [editingItem])

  const handleSubmit = () => {
    if (!itemTitle.trim()) return

    const itemData = {
      title: itemTitle,
      description: itemDescription || undefined,
      price: itemPrice ? Number.parseFloat(itemPrice) : undefined,
      url: itemUrl || undefined,
      priority: itemPriority,
      category: itemCategory,
    }

    if (editingItem && onEditItem) {
      onEditItem(editingItem.id, itemData)
    } else {
      onAddItem(itemData)
    }

    // Reset form
    setItemTitle("")
    setItemDescription("")
    setItemPrice("")
    setItemUrl("")
    setItemPriority("medium")
    setItemCategory("personal")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          {t("addWishlistItem")}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Editar Deseo" : t("addWishlistItem")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="itemTitle">{t("wishlistTitle")}</Label>
            <Input
              id="itemTitle"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white"
              placeholder={t("wishlistTitle")}
            />
          </div>

          <div>
            <Label htmlFor="itemDescription">{t("wishlistDescription")}</Label>
            <Textarea
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white"
              placeholder={t("wishlistDescription")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="itemPrice">{t("price")}</Label>
              <Input
                id="itemPrice"
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <Label>{t("priority")}</Label>
              <Select value={itemPriority} onValueChange={setItemPriority}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="high" className="text-white">
                    {t("high")}
                  </SelectItem>
                  <SelectItem value="medium" className="text-white">
                    {t("medium")}
                  </SelectItem>
                  <SelectItem value="low" className="text-white">
                    {t("low")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="itemUrl">URL (opcional)</Label>
            <Input
              id="itemUrl"
              type="url"
              value={itemUrl}
              onChange={(e) => setItemUrl(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white"
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Categoría</Label>
            <Input
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white"
              placeholder="Categoría"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-cyan-500">
              {editingItem ? "Actualizar" : t("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
