"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react"
import { useTranslation } from "@/lib/use-translation"

interface Review {
  id: string
  name: string
  rating: number
  title?: string
  comment: string
  helpful_count: number
  created_at: string
}

interface UserReviewsProps {
  isDarkMode?: boolean
}

export function UserReviews({ isDarkMode = false }: UserReviewsProps) {
  const t = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const reviewsPerPage = 6

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    comment: "",
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reviews?limit=100&sortBy=rating")
      const data = await response.json()
      setReviews(data.reviews || [])
      setCurrentPage(0)
    } catch (error) {
      console.error("[v0] Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.comment) {
      alert(t("please_fill_required_fields") || "Please fill all required fields")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to submit review")

      setFormData({ name: "", email: "", rating: 5, title: "", comment: "" })
      setShowForm(false)
      fetchReviews()
    } catch (error) {
      console.error("[v0] Error submitting review:", error)
      alert(t("failed_submit_review") || "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "text-primary text-lg" : "text-muted-foreground/30 text-lg"}>
            ★
          </span>
        ))}
      </div>
    )
  }

  const paginatedReviews = reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage)
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)
  const hasNextPage = currentPage < totalPages - 1
  const hasPrevPage = currentPage > 0

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">{t("user_reviews_title") || "User Reviews"}</h2>
        <p className="text-muted-foreground">{t("user_reviews_description") || "What our users say"}</p>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <Card className="glass-card p-6 max-w-2xl mx-auto border border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder={t("your_name") || "Your Name"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-secondary/50 border-primary/30 focus:border-primary"
              />
              <Input
                placeholder={t("your_email") || "Your Email"}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-secondary/50 border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                {t("rating") || "Rating"}: {formData.rating} {t("stars") || "stars"}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="hover:scale-110 transition-transform text-4xl"
                  >
                    <span className={star <= formData.rating ? "text-primary" : "text-muted-foreground/30"}>★</span>
                  </button>
                ))}
              </div>
            </div>

            <Input
              placeholder={t("review_title_optional") || "Review Title (Optional)"}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-secondary/50 border-primary/30 focus:border-primary"
            />

            <Textarea
              placeholder={t("share_your_thoughts") || "Share your thoughts..."}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              required
              className="bg-secondary/50 border-primary/30 focus:border-primary resize-none"
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                {t("cancel") || "Cancel"}
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting") || "Submitting..."}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("submit_review") || "Submit Review"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Reviews Carousel */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>{t("no_reviews_yet") || "No reviews yet. Be the first to share!"}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="glass-card p-6 flex flex-col items-center justify-center gap-4 border border-primary/20 hover:border-primary/40 transition-colors min-h-[300px]">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">{t("share_your_review") || "Share Your Review"}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("user_reviews_description") || "Share your experience with us"}
                </p>
              </div>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary hover:bg-primary/90 text-white w-full"
              >
                {t("write_review") || "Write a Review"}
              </Button>
            </Card>

            {/* Existing reviews */}
            {paginatedReviews.map((review) => (
              <Card
                key={review.id}
                className="glass-card p-6 flex flex-col border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-bold text-primary">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold truncate">{review.name}</h3>
                    {review.title && <p className="text-sm text-muted-foreground line-clamp-1">{review.title}</p>}
                  </div>
                </div>

                <div className="mb-3">{renderStars(review.rating)}</div>

                <p className="flex-grow mb-3 text-sm text-muted-foreground italic line-clamp-4">"{review.comment}"</p>

                <div className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</div>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows */}
          {totalPages > 1 && reviews.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={!hasPrevPage}
                className="hover:bg-primary/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentPage ? "bg-primary w-8" : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={!hasNextPage}
                className="hover:bg-primary/20"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Page counter */}
          {reviews.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              {paginatedReviews.length > 0 && (
                <>
                  {t("showing") || "Showing"} {currentPage * reviewsPerPage + 1}-
                  {Math.min((currentPage + 1) * reviewsPerPage, reviews.length)} {t("of") || "of"} {reviews.length}{" "}
                  {t("reviews") || "reviews"}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
