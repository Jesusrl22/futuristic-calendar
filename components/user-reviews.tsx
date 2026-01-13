"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, Send, Loader2 } from "lucide-react"

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
  userId?: string
  isDarkMode?: boolean
}

export function UserReviews({ userId, isDarkMode = false }: UserReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState<"rating" | "helpful" | "newest">("rating")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    comment: "",
  })

  useEffect(() => {
    fetchReviews()
  }, [sortBy])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?limit=6&sortBy=${sortBy}`)
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("[v0] Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.comment) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: userId || null,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit review")

      setFormData({ name: "", email: "", rating: 5, title: "", comment: "" })
      setShowForm(false)
      fetchReviews()
    } catch (error) {
      console.error("[v0] Error submitting review:", error)
      alert("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
        ))}
      </div>
    )
  }

  return (
    <div className={`py-16 px-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          User Reviews
        </h2>
        <p className={`text-center mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          See what our community thinks about Future Task
        </p>

        {/* Sort buttons and add review button */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-2 flex-wrap justify-center">
            {(["rating", "helpful", "newest"] as const).map((sort) => (
              <Button
                key={sort}
                variant={sortBy === sort ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(sort)}
                className="capitalize"
              >
                {sort === "rating" ? "Best Rated" : sort === "helpful" ? "Most Helpful" : "Newest"}
              </Button>
            ))}
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="mx-auto">
            Share Your Review
          </Button>
        </div>

        {/* Review Form */}
        {showForm && (
          <Card className={`p-6 mb-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                  required
                />
                <Input
                  placeholder="Your Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  Rating: {formData.rating} stars
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        size={32}
                        className={star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Input
                placeholder="Review Title (optional)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""}
              />

              <Textarea
                placeholder="Share your thoughts about Future Task *"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className={isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                rows={4}
                required
              />

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className={`p-6 flex flex-col ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{review.name}</h3>
                    {review.title && (
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{review.title}</p>
                    )}
                  </div>
                </div>

                <div className="mb-3">{renderStars(review.rating)}</div>

                <p className={`flex-grow mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{review.comment}</p>

                <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
