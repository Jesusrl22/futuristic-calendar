"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ExternalLink } from "@/components/icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpgradeModal } from "@/components/upgrade-modal"

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [itemForm, setItemForm] = useState({
    title: "",
    description: "",
    price: "",
    priority: "medium",
    url: "",
  })
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSubscriptionAndFetch()
  }, [])

  const checkSubscriptionAndFetch = async () => {
    const sessionResponse = await fetch("/api/auth/check-session")
    const sessionData = await sessionResponse.json()

    if (sessionData.hasSession && sessionData.userId) {
      const profileResponse = await fetch(`/api/user/profile?userId=${sessionData.userId}`)
      const profileData = await profileResponse.json()

      setSubscriptionTier(profileData.profile?.subscription_tier || "free")
      setLoading(false)

      if (profileData.profile?.subscription_tier === "premium" || profileData.profile?.subscription_tier === "pro") {
        fetchItems()
      }
    }
  }

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/wishlist")
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    }
  }

  const handleSaveItem = async () => {
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: itemForm.title,
          description: itemForm.description,
          price: itemForm.price ? Number.parseFloat(itemForm.price) : null,
          priority: itemForm.priority,
          url: itemForm.url,
        }),
      })

      setItemForm({ title: "", description: "", price: "", priority: "medium", url: "" })
      setIsDialogOpen(false)
      fetchItems()
    } catch (error) {
      console.error("Error saving wishlist item:", error)
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      await fetch(`/api/wishlist?id=${itemId}`, {
        method: "DELETE",
      })
      fetchItems()
    } catch (error) {
      console.error("Error deleting wishlist item:", error)
    }
  }

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true
    return item.priority === filter
  })

  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (subscriptionTier !== "premium" && subscriptionTier !== "pro") {
    return <UpgradeModal feature="Wishlist" requiredPlan="premium" />
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          <span className="text-primary neon-text">Wishlist</span>
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="neon-glow-hover">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>Add Wishlist Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="Item title"
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Item description"
                  className="bg-secondary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    placeholder="0.00"
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={itemForm.priority}
                    onValueChange={(value) => setItemForm({ ...itemForm, priority: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>URL (optional)</Label>
                <Input
                  value={itemForm.url}
                  onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                  placeholder="https://..."
                  className="bg-secondary/50"
                />
              </div>
              <Button onClick={handleSaveItem} className="w-full neon-glow-hover">
                Add to Wishlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card p-6 neon-glow-hover">
          <h3 className="text-sm text-muted-foreground mb-2">Total Items</h3>
          <p className="text-3xl font-bold">{items.length}</p>
        </Card>
        <Card className="glass-card p-6 neon-glow-hover">
          <h3 className="text-sm text-muted-foreground mb-2">Total Value</h3>
          <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
        </Card>
        <Card className="glass-card p-6 neon-glow-hover">
          <h3 className="text-sm text-muted-foreground mb-2">High Priority</h3>
          <p className="text-3xl font-bold">{items.filter((i) => i.priority === "high").length}</p>
        </Card>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
          <TabsTrigger value="medium">Medium Priority</TabsTrigger>
          <TabsTrigger value="low">Low Priority</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id}>
              <Card className="glass-card p-6 neon-glow-hover transition-all duration-300 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex-1">{item.description}</p>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    {item.price && <span className="text-lg font-bold text-primary">${item.price}</span>}
                    <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {filteredItems.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No items in wishlist</p>
        </Card>
      )}
    </div>
  )
}
