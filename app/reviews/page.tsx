"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"
import { TrustpilotCarousel, TrustpilotMiniWidget } from "@/components/trustpilot-widget"
import { ExternalLink, Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ReviewsPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { language } = useLanguage()

  // Get Trustpilot URL based on language
  const getTrustpilotUrl = () => {
    const localeMap: Record<string, string> = {
      es: "es",
      en: "www",
      fr: "fr",
      de: "de",
      it: "it",
      pt: "pt",
      ru: "ru",
      zh: "cn",
      ja: "jp",
      ko: "kr",
    }
    const subdomain = localeMap[language] || "www"
    return `https://${subdomain}.trustpilot.com/review/future-task.com`
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
          <p className="text-muted-foreground mb-6">{t("verifiedReviewsTrustpilot") || "Verified reviews from Trustpilot"}</p>
          
          {/* Trustpilot Rating Widget */}
          <div className="max-w-md mx-auto mb-8">
            <TrustpilotMiniWidget />
          </div>
        </div>

        {/* Trustpilot Reviews Carousel */}
        <div className="mb-12">
          <TrustpilotCarousel />
        </div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
          {/* View All Reviews */}
          <Card className="glass-card p-6 border border-primary/20 hover:border-primary/40 transition-colors">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{t("viewAllReviews") || "View All Reviews"}</h3>
              <p className="text-sm text-muted-foreground">
                {t("viewAllReviewsDescription") || "See all verified reviews from our users on Trustpilot"}
              </p>
              <Button
                onClick={() => window.open(getTrustpilotUrl(), "_blank", "noopener,noreferrer")}
                className="bg-primary hover:bg-primary/90 w-full"
              >
                {t("seeAllReviews") || "See All Reviews"}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Write a Review */}
          <Card className="glass-card p-6 border border-primary/20 hover:border-primary/40 transition-colors">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <ExternalLink className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{t("writeReview") || "Write a Review"}</h3>
              <p className="text-sm text-muted-foreground">
                {t("writeReviewDescription") || "Share your experience with Future Task on Trustpilot"}
              </p>
              <Button
                onClick={() => window.open(getTrustpilotUrl(), "_blank", "noopener,noreferrer")}
                className="bg-primary hover:bg-primary/90 w-full"
              >
                {t("writeYourReview") || "Write Your Review"}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Section */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            {t("trustpilotVerified") || "All reviews are verified and independently collected by Trustpilot"}
          </p>
        </div>
      </section>
    </div>
  )
}
