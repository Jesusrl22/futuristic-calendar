import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg animate-pulse"></div>
            <div className="w-24 h-6 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-4 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-8 bg-muted rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs Skeleton */}
      <div className="container py-4">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
          <div className="w-4 h-4 bg-muted rounded animate-pulse"></div>
          <div className="w-8 h-4 bg-muted rounded animate-pulse"></div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="py-12">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary" className="w-fit mx-auto animate-pulse">
              <div className="w-12 h-4 bg-muted rounded"></div>
            </Badge>
            <div className="w-80 h-12 bg-muted rounded mx-auto animate-pulse"></div>
            <div className="w-96 h-6 bg-muted rounded mx-auto animate-pulse"></div>
          </div>

          {/* Search and Filters Skeleton */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 h-10 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-24 h-8 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Skeleton */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-5 h-5 bg-muted rounded animate-pulse"></div>
            <div className="w-40 h-6 bg-muted rounded animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-20 h-5 bg-muted rounded"></div>
                    <div className="w-16 h-5 bg-muted rounded"></div>
                  </div>
                  <div className="w-full h-6 bg-muted rounded mb-2"></div>
                  <div className="w-full h-4 bg-muted rounded mb-1"></div>
                  <div className="w-3/4 h-4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-4 bg-muted rounded"></div>
                      <div className="w-16 h-4 bg-muted rounded"></div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-4 bg-muted rounded"></div>
                      <div className="w-12 h-4 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts Skeleton */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div className="w-40 h-6 bg-muted rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-muted rounded animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-20 h-5 bg-muted rounded"></div>
                  </div>
                  <div className="w-full h-5 bg-muted rounded mb-2"></div>
                  <div className="w-full h-4 bg-muted rounded mb-1"></div>
                  <div className="w-2/3 h-4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-4 bg-muted rounded"></div>
                      <div className="w-16 h-4 bg-muted rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-4 bg-muted rounded"></div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-4 bg-muted rounded"></div>
                        <div className="w-6 h-4 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
