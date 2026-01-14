"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ReviewsPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    comment: "",
    rating: 5,
  })

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const response = await fetch("/api/reviews?limit=1000")
      const data = await response.json()
      setReviews(data || [])
    } catch (error) {
      console.error("[v0] Error loading reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", email: "", title: "", comment: "", rating: 5 })
        setShowModal(false)
        loadReviews()
      }
    } catch (error) {
      console.error("[v0] Error submitting review:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            ← {t("back")}
          </Button>
          <h1 className="text-4xl font-bold mb-4">{t("allReviews")}</h1>
          <p className="text-muted-foreground">
            {t("totalReviews")}: {reviews.length}
          </p>
        </div>

        {/* Add Review Button */}
        <div className="text-center mb-12">
          <Button onClick={() => setShowModal(true)} className="neon-glow-hover">
            {t("addReview")}
          </Button>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12">{t("loading")}</div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review: any) => (
              <Card key={review.id} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-primary">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="font-bold mb-2">{review.title}</h3>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">{t("noReviews")}</p>
            <Button onClick={() => setShowModal(true)} className="neon-glow-hover">
              {t("beFirst")}
            </Button>
          </div>
        )}
      </section>

      {/* Review Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("writeReview")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <Input
              placeholder={t("namePlaceholder")}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder={t("emailPlaceholder")}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              placeholder={t("reviewTitle")}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Textarea
              placeholder={t("reviewComment")}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
            />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="text-2xl transition-transform hover:scale-110"
                >
                  <span className={formData.rating >= star ? "text-primary" : "text-muted-foreground"}>⭐</span>
                </button>
              ))}
            </div>
            <Button type="submit" className="w-full neon-glow-hover">
              {t("submitReview")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
